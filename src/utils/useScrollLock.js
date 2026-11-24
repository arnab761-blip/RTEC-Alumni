import { useEffect } from 'react';

let lockCount = 0;

export function forceUnlockScroll() {
  lockCount = 0;
  if (typeof document !== 'undefined') {
    document.body.classList.remove('modal-scroll-locked');
    document.documentElement.classList.remove('modal-scroll-locked');
  }
  if (window.__lenis) {
    try {
      window.__lenis.start();
    } catch (e) {
      // ignore
    }
  }
}

/**
 * useScrollLock hook locks background page scrolling (including Lenis smooth scroll)
 * when a modal, drawer, or dialog is active, and guarantees 100% immediate release
 * when closed.
 *
 * @param {boolean} isLocked Whether the modal/drawer is currently open
 */
export function useScrollLock(isLocked) {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    if (isLocked) {
      lockCount++;
      document.body.classList.add('modal-scroll-locked');
      document.documentElement.classList.add('modal-scroll-locked');
      if (window.__lenis) {
        try {
          window.__lenis.stop();
        } catch (e) {
          // ignore
        }
      }
    }

    return () => {
      if (isLocked) {
        lockCount = Math.max(0, lockCount - 1);
        if (lockCount === 0) {
          document.body.classList.remove('modal-scroll-locked');
          document.documentElement.classList.remove('modal-scroll-locked');
          if (window.__lenis) {
            try {
              window.__lenis.start();
            } catch (e) {
              // ignore
            }
          }
        }
      }
    };
  }, [isLocked]);
}

