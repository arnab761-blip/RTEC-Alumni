import { useEffect } from 'react';

let lockCount = 0;

export function forceUnlockScroll() {
  lockCount = 0;
  if (typeof document !== 'undefined') {
    document.body.classList.remove('modal-scroll-locked');
    document.documentElement.classList.remove('modal-scroll-locked');
  }
}

/**
 * useScrollLock locks native background page scrolling while a modal or drawer is active
 * and releases it cleanly on unmount or close.
 *
 * @param {boolean} isLocked Whether a modal or drawer is currently open
 */
export function useScrollLock(isLocked) {
  useEffect(() => {
    if (typeof document === 'undefined' || !isLocked) return;

    lockCount++;
    document.body.classList.add('modal-scroll-locked');
    document.documentElement.classList.add('modal-scroll-locked');

    return () => {
      lockCount = Math.max(0, lockCount - 1);
      if (lockCount === 0) {
        document.body.classList.remove('modal-scroll-locked');
        document.documentElement.classList.remove('modal-scroll-locked');
      }
    };
  }, [isLocked]);
}
