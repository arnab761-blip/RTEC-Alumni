import React, { useRef, useState } from 'react';
import { formatDriveImageUrl } from '../utils/driveImage.js';
import { formatBytes, uploadCompressedImageToCloudinary } from '../utils/cloudinaryUpload.js';
import { UploadCloud, Trash2, Loader2, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

/**
 * Gallery Image Upload Input with client-side compression and Cloudinary upload.
 * Replaces legacy Google Drive link paste workflow across all forms.
 */
export default function CloudinaryImageInput({
  label,
  value,
  onChange,
  lang = 'bn',
  fallbackIcon: FallbackIcon = Sparkles,
  apiBaseUrl = '',
  folder = 'rtec-alumni/uploads',
  darkSurface = false,
  onUploadingChange
}) {
  const fileInputRef = useRef(null);
  const [imgError, setImgError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadStats, setUploadStats] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const previewUrl = formatDriveImageUrl(value);

  const setUploadingState = (state) => {
    setIsUploading(state);
    if (typeof onUploadingChange === 'function') {
      onUploadingChange(state);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input so selecting the same file again triggers onChange
    e.target.value = '';

    setErrorMsg('');
    setUploadStats(null);
    setProgress(10);
    setUploadingState(true);

    try {
      const result = await uploadCompressedImageToCloudinary(file, {
        apiBaseUrl,
        folder,
        onProgress: (pct) => setProgress(pct)
      });

      setImgError(false);
      onChange(result.url);
      setUploadStats({
        originalSize: result.originalSize,
        compressedSize: result.compressedSize
      });
    } catch (err) {
      setErrorMsg(
        err?.message ||
        (lang === 'bn'
          ? 'ছবি আপলোড করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।'
          : 'Failed to upload image. Please try again.')
      );
    } finally {
      setUploadingState(false);
      setProgress(0);
    }
  };

  const handleRemove = () => {
    setImgError(false);
    setUploadStats(null);
    setErrorMsg('');
    onChange('');
  };

  const labelClass = darkSurface
    ? 'block text-xs font-semibold text-slate-300'
    : 'block text-xs font-semibold text-[#1C1917] dark:text-[#DCD3C1]';

  const previewBoxClass = darkSurface
    ? 'relative w-20 h-20 rounded-2xl bg-slate-950 border-2 border-emerald-500/40 overflow-hidden shrink-0 flex items-center justify-center shadow-md'
    : 'relative w-20 h-20 rounded-2xl bg-[#FAF9F6] dark:bg-[#141311] border-2 border-[#C5A880]/40 overflow-hidden shrink-0 flex items-center justify-center shadow-sm';

  const helperTextClass = darkSurface
    ? 'text-[11px] text-slate-400 leading-relaxed'
    : 'text-[11px] text-[#57534E] dark:text-[#A89884] leading-relaxed';

  return (
    <div className="space-y-2">
      <label className={labelClass}>
        {label}
      </label>

      <div className="flex items-start gap-3">
        {/* Live Preview Box */}
        <div className={previewBoxClass}>
          {value && !imgError ? (
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className={`text-center p-2 ${darkSurface ? 'text-slate-500' : 'text-[#A89884]'}`}>
              <FallbackIcon className={`w-5 h-5 mx-auto mb-1 ${darkSurface ? 'text-emerald-400/60' : 'text-[#854D0E]/60 dark:text-[#DFCA9E]/60'}`} />
              <span className="text-[9px] block leading-tight font-mono">
                {lang === 'bn' ? 'ছবির প্রিভিউ' : 'Preview'}
              </span>
            </div>
          )}

          {isUploading && (
            <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white">
              <Loader2 className="w-5 h-5 animate-spin mb-1" />
              <span className="text-[10px] font-mono">{progress}%</span>
            </div>
          )}
        </div>

        {/* Gallery Upload Controls */}
        <div className="flex-1 min-w-0 space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs font-semibold transition shadow-sm cursor-pointer"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>
                    {lang === 'bn' ? 'কম্প্রেস ও আপলোড হচ্ছে...' : 'Compressing & Uploading...'}
                  </span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" />
                  <span>
                    {value
                      ? (lang === 'bn' ? 'ছবি পরিবর্তন করুন' : 'Change Photo')
                      : (lang === 'bn' ? 'গ্যালারি থেকে ছবি বেছে নিন' : 'Choose Photo from Gallery')}
                  </span>
                </>
              )}
            </button>

            {value && !isUploading && (
              <button
                type="button"
                onClick={handleRemove}
                className={`inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-red-500/25 text-xs font-semibold transition cursor-pointer ${
                  darkSurface
                    ? 'bg-red-500/15 hover:bg-red-500/25 text-red-300'
                    : 'bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400'
                }`}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? 'মুছে ফেলুন' : 'Remove'}</span>
              </button>
            )}
          </div>

          {uploadStats && (
            <p className={`text-[11px] flex items-center gap-1.5 font-medium ${darkSurface ? 'text-emerald-300' : 'text-emerald-700 dark:text-emerald-300'}`}>
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>
                {lang === 'bn'
                  ? `ছবি কম্প্রেস হয়ে আপলোড হয়েছে (${formatBytes(uploadStats.originalSize)} → ${formatBytes(uploadStats.compressedSize)})`
                  : `Compressed & uploaded (${formatBytes(uploadStats.originalSize)} → ${formatBytes(uploadStats.compressedSize)})`}
              </span>
            </p>
          )}

          {errorMsg && (
            <p className={`text-[11px] flex items-start gap-1.5 font-medium ${darkSurface ? 'text-red-400' : 'text-red-600 dark:text-red-400'}`}>
              <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </p>
          )}

          <p className={helperTextClass}>
            {lang === 'bn'
              ? 'ফোন বা কম্পিউটারের গ্যালারি থেকে সরাসরি ছবি সিলেক্ট করুন। ছবিটি স্বয়ংক্রিয়ভাবে কম্প্রেস হয়ে Cloudinary-তে সংরক্ষিত হবে।'
              : 'Select a photo directly from your gallery or computer. It will be automatically compressed before uploading to Cloudinary.'}
          </p>
        </div>
      </div>
    </div>
  );
}
