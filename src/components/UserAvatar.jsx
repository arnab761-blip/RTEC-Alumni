import React, { useState } from 'react';
import { formatDriveImageUrl } from '../utils/driveImage.js';
import { User, GraduationCap, Award, BookOpen } from 'lucide-react';

/**
 * Universal Academic UserAvatar Component
 * 
 * Guarantees:
 * 1. If an actual photo is uploaded by user or admin, it renders clearly via Google Drive or direct URL.
 * 2. If NO photo was uploaded or image fails to load, it displays a pristine, elegant
 *    academic avatar silhouette icon (NEVER any random stock photo or stranger).
 */
export default function UserAvatar({
  src,
  name = '',
  className = 'w-10 h-10 rounded-xl',
  role = 'user',
  iconClassName = 'w-1/2 h-1/2'
}) {
  const [imgError, setImgError] = useState(false);
  const formattedSrc = formatDriveImageUrl(src);
  const hasValidPhoto = Boolean(formattedSrc && !imgError && !formattedSrc.includes('unsplash.com'));

  // Select appropriate academic fallback icon
  const getIcon = () => {
    switch (role) {
      case 'teacher':
      case 'faculty':
        return BookOpen;
      case 'alumni':
        return Award;
      case 'student':
        return GraduationCap;
      default:
        return User;
    }
  };

  const IconComponent = getIcon();

  if (hasValidPhoto) {
    return (
      <img
        src={formattedSrc}
        alt={name || 'Avatar'}
        className={`${className} object-cover`}
        onError={() => setImgError(true)}
      />
    );
  }

  // Pure SVG silhouette / academic crest avatar when no photo uploaded
  return (
    <div
      className={`${className} flex items-center justify-center shrink-0 bg-[#F4EFE6] dark:bg-[#201E1A] border border-[#C5A880]/30 text-[#854D0E] dark:text-[#DFCA9E] select-none`}
      title={name || 'User Avatar'}
      aria-label={name || 'User Avatar'}
    >
      <IconComponent className={iconClassName} />
    </div>
  );
}
