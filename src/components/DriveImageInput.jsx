import React, { useState } from 'react';
import { formatDriveImageUrl } from '../utils/driveImage.js';
import { Sparkles } from 'lucide-react';

/**
 * Reusable Google Drive image input with live preview and professional instruction guidelines
 */
export default function DriveImageInput({
  label,
  value,
  onChange,
  placeholder,
  lang = 'bn',
  fallbackIcon: FallbackIcon = Sparkles
}) {
  const [imgError, setImgError] = useState(false);
  const formattedUrl = formatDriveImageUrl(value);

  return (
    <div className="space-y-2">
      <label className="text-[#DCD3C1] font-semibold block text-xs">
        {label}
      </label>

      <div className="flex items-start gap-3">
        {/* Live Preview Box */}
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#141311] border-2 border-emerald-500/40 overflow-hidden shrink-0 flex items-center justify-center shadow-md">
          {value && !imgError ? (
            <img
              src={formattedUrl}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="text-center p-2 text-[#A89884]">
              <FallbackIcon className="w-5 h-5 mx-auto text-emerald-400/50 mb-1" />
              <span className="text-[9px] block leading-tight font-mono">
                {lang === 'bn' ? 'ছবির প্রিভিউ' : 'Preview'}
              </span>
            </div>
          )}
        </div>

        {/* URL Input & Professional Guide Box */}
        <div className="flex-1 min-w-0 space-y-2">
          <input
            type="text"
            value={value || ''}
            onChange={(e) => {
              setImgError(false);
              onChange(e.target.value);
            }}
            placeholder={placeholder || (lang === 'bn' ? 'গুগল ড্রাইভ লিংক বা ছবির URL পেস্ট করুন...' : 'Paste Google Drive link or image URL...')}
            className="w-full p-2.5 rounded-xl bg-[#141311] border border-[#C5A880]/30 text-[#FDFBF7] text-xs focus:border-emerald-500 focus:outline-none placeholder-[#A89884]/60 font-sans"
          />

          {/* Professional Google Drive Instruction Box */}
          <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-[11px] text-emerald-200 leading-relaxed shadow-sm">
            <p className="font-bold flex items-center gap-1.5 text-emerald-300 mb-1.5">
              <span>💡</span>
              <span>
                {lang === 'bn'
                  ? 'গুগল ড্রাইভ (Google Drive) দিয়ে ছবি দেওয়ার সহজ নিয়ম:'
                  : 'How to use Google Drive photo link:'}
              </span>
            </p>
            <ol className="list-decimal list-inside space-y-1 text-[11px] text-[#DCD3C1]">
              {lang === 'bn' ? (
                <>
                  <li>আপনার ছবিটি <strong>Google Drive</strong>-এ আপলোড করুন।</li>
                  <li>ছবিতে রাইট-ক্লিক করে <strong>Share</strong> নির্বাচন করুন এবং General access-এ <strong>"Anyone with the link"</strong> সিলেক্ট করুন।</li>
                  <li>এরপর <strong>"Copy link"</strong> করে সেই লিংকটি উপরের বক্সে পেস্ট করে দিন। সরাসরি ছবি লোড হবে!</li>
                </>
              ) : (
                <>
                  <li>Upload the image to your <strong>Google Drive</strong>.</li>
                  <li>Right click the file, select <strong>Share</strong>, and set General access to <strong>"Anyone with the link"</strong>.</li>
                  <li>Click <strong>"Copy link"</strong> and paste the link into the box above.</li>
                </>
              )}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
