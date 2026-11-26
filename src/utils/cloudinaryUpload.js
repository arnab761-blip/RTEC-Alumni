/**
 * Client-side image compression + Cloudinary upload utility.
 * Compresses images in-browser via HTML5 Canvas before uploading
 * so uploads are fast and use minimal Cloudinary storage.
 */

const DEFAULT_MAX_DIMENSION = 900;
const TARGET_MAX_BYTES = 200 * 1024; // 200 KB

function canvasToBlob(canvas, mimeType, quality) {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), mimeType, quality);
  });
}

function loadImageFromFile(file) {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to decode selected image file.'));
    };
    img.src = objectUrl;
  });
}

/**
 * Compresses and resizes an image file in the browser.
 * @param {File} file
 * @param {object} [options]
 * @returns {Promise<{blob: Blob, fileName: string, originalSize: number, compressedSize: number, width: number, height: number}>}
 */
export async function compressImageFile(file, options = {}) {
  if (!file || !file.type?.startsWith('image/')) {
    throw new Error('Please select a valid image file (JPG, PNG, WebP).');
  }

  const maxDim = options.maxDimension || DEFAULT_MAX_DIMENSION;
  const img = await loadImageFromFile(file);

  let width = img.naturalWidth || img.width;
  let height = img.naturalHeight || img.height;

  if (width > maxDim || height > maxDim) {
    if (width >= height) {
      height = Math.round((height * maxDim) / width);
      width = maxDim;
    } else {
      width = Math.round((width * maxDim) / height);
      height = maxDim;
    }
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, width, height);

  // Prefer WebP for best compression; fall back to JPEG if unsupported
  let mimeType = 'image/webp';
  let blob = await canvasToBlob(canvas, mimeType, 0.82);
  if (!blob || blob.type !== 'image/webp') {
    mimeType = 'image/jpeg';
    blob = await canvasToBlob(canvas, mimeType, 0.82);
  }

  // Step down quality if still above target size
  if (blob && blob.size > TARGET_MAX_BYTES) {
    const retryBlob = await canvasToBlob(canvas, mimeType, 0.65);
    if (retryBlob && retryBlob.size < blob.size) {
      blob = retryBlob;
    }
  }
  if (blob && blob.size > 350 * 1024) {
    const retryBlob = await canvasToBlob(canvas, mimeType, 0.5);
    if (retryBlob && retryBlob.size < blob.size) {
      blob = retryBlob;
    }
  }

  if (!blob) {
    throw new Error('Failed to compress image.');
  }

  const baseName = (file.name || 'photo').replace(/\.[^.]+$/, '');
  const ext = mimeType === 'image/webp' ? 'webp' : 'jpg';

  return {
    blob,
    fileName: `${baseName}.${ext}`,
    originalSize: file.size,
    compressedSize: blob.size,
    width,
    height
  };
}

export function formatBytes(bytes) {
  if (!bytes || bytes <= 0) return '0 KB';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function uploadFormDataWithProgress(url, formData, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && typeof onProgress === 'function') {
        const percent = Math.min(99, Math.round((event.loaded / event.total) * 100));
        onProgress(percent);
      }
    };

    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText || '{}');
        if (xhr.status >= 200 && xhr.status < 300 && data.secure_url) {
          if (typeof onProgress === 'function') onProgress(100);
          resolve(data);
        } else {
          reject(new Error(data?.error?.message || `Cloudinary upload failed (${xhr.status})`));
        }
      } catch {
        reject(new Error(`Cloudinary upload failed (${xhr.status})`));
      }
    };

    xhr.onerror = () => reject(new Error('Network error while uploading image to Cloudinary.'));
    xhr.send(formData);
  });
}

/**
 * Compresses an image file and uploads it to Cloudinary.
 * Supports:
 * 1) Direct unsigned upload if VITE_CLOUDINARY_CLOUD_NAME & VITE_CLOUDINARY_UPLOAD_PRESET are set.
 * 2) Backend signed upload via POST /api/cloudinary-signature otherwise.
 */
export async function uploadCompressedImageToCloudinary(file, options = {}) {
  const {
    apiBaseUrl = '',
    folder = 'rtec-alumni/students',
    onProgress
  } = options;

  const compressed = await compressImageFile(file);

  const envCloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const envPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const formData = new FormData();
  formData.append('file', compressed.blob, compressed.fileName);

  let uploadUrl = '';

  if (envCloudName && envPreset) {
    uploadUrl = `https://api.cloudinary.com/v1_1/${envCloudName}/image/upload`;
    formData.append('upload_preset', envPreset);
    formData.append('folder', folder);
  } else {
    const cleanBase = String(apiBaseUrl || '').replace(/\/+$/, '');
    const sigRes = await fetch(`${cleanBase}/api/cloudinary-signature`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ folder })
    });
    const sigData = await sigRes.json().catch(() => ({}));
    if (!sigRes.ok || !sigData.success) {
      throw new Error(
        sigData.error ||
        'Cloudinary is not configured. Please add Cloudinary credentials.'
      );
    }

    uploadUrl = `https://api.cloudinary.com/v1_1/${sigData.cloudName}/image/upload`;
    formData.append('api_key', sigData.apiKey);
    formData.append('timestamp', String(sigData.timestamp));
    formData.append('signature', sigData.signature);
    formData.append('folder', sigData.folder);
  }

  const result = await uploadFormDataWithProgress(uploadUrl, formData, onProgress);

  return {
    url: result.secure_url,
    publicId: result.public_id,
    originalSize: compressed.originalSize,
    compressedSize: compressed.compressedSize
  };
}
