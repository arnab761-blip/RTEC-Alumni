/**
 * Utility to convert Google Drive shareable URLs into direct, embeddable image URLs
 * so images can render inside <img> tags without requiring backend storage.
 */
export function formatDriveImageUrl(url) {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();

  // Pattern to catch Google Drive file IDs:
  // e.g. https://drive.google.com/file/d/1XyZ.../view?usp=sharing
  // or https://drive.google.com/open?id=1XyZ...
  // or https://drive.google.com/uc?id=1XyZ...
  // or https://lh3.googleusercontent.com/d/1XyZ...
  const driveRegex = /(?:drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?(?:export=[^&]+&)?id=)|lh3\.googleusercontent\.com\/d\/)([a-zA-Z0-9_-]+)/;
  const match = trimmed.match(driveRegex);

  if (match && match[1]) {
    const fileId = match[1];
    // Google's high-res thumbnail endpoint allows direct CORS-friendly image loading
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1200`;
  }

  return trimmed;
}
