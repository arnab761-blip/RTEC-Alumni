import { useEffect } from 'react';

let lockCount = 0;

export function forceUnlockScroll() {
  lockCount = 0;
  if (typeof document !== 'undefined') {
    document.body.classList.remove('modal-scroll-locked');
    document.documentElement.classList.remove('modal-scroll-locked');
    document.body.style.paddingRight = '';
  }
}

/**
 * useScrollLock locks native background page scrolling while a modal or drawer is active
 * and compensates for any scrollbar width shift on browsers without native gutter support.
 *
 * @param {boolean} isLocked Whether a modal or drawer is currently open/exiting
 */
export function useScrollLock(isLocked) {
  useEffect(() => {
    if (typeof document === 'undefined' || !isLocked) return;

    if (lockCount === 0) {
      const prevClientWidth = document.documentElement.clientWidth;
      document.body.classList.add('modal-scroll-locked');
      document.documentElement.classList.add('modal-scroll-locked');
      const shift = document.documentElement.clientWidth - prevClientWidth;
      if (shift > 0) {
        document.body.style.paddingRight = `${shift}px`;
      }
    }
    lockCount++;

    return () => {
      lockCount = Math.max(0, lockCount - 1);
      if (lockCount === 0) {
        document.body.classList.remove('modal-scroll-locked');
        document.documentElement.classList.remove('modal-scroll-locked');
        document.body.style.paddingRight = '';
      }
    };
  }, [isLocked]);
}
