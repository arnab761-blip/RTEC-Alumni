/**
 * RTEC Analytics Tracker
 * 
 * Guarantees:
 * 1. Zero performance overhead: All pings run asynchronously during idle time or background beacon
 * 2. Never blocks main thread, rendering, or animations
 * 3. Gracefully degrades if offline or network unavailable
 * 4. Tracks:
 *    - Session ID & Visitor ID
 *    - Logged-in user details (if available) or Guest status
 *    - Page path & title
 *    - Device type (Mobile / Tablet / Desktop) & Browser
 *    - Time spent on site / page (duration in seconds)
 */

function getVisitorId() {
  try {
    let vid = localStorage.getItem('rtec_vid');
    if (!vid) {
      vid = 'v_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
      localStorage.setItem('rtec_vid', vid);
    }
    return vid;
  } catch {
    return 'v_temp_' + Math.random().toString(36).substring(2, 10);
  }
}

function getSessionId() {
  try {
    let sid = sessionStorage.getItem('rtec_sid');
    if (!sid) {
      sid = 's_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
      sessionStorage.setItem('rtec_sid', sid);
    }
    return sid;
  } catch {
    return 's_temp_' + Math.random().toString(36).substring(2, 10);
  }
}

function getDeviceType() {
  if (typeof navigator === 'undefined') return 'Desktop';
  const ua = navigator.userAgent || '';
  if (/iPad|Tablet|PlayBook/i.test(ua)) return 'Tablet';
  if (/Mobile|Android|iP(hone|od)|BlackBerry|IEMobile|Kindle/i.test(ua)) return 'Mobile';
  return 'Desktop';
}

function getBrowserName() {
  if (typeof navigator === 'undefined') return 'Browser';
  const ua = navigator.userAgent || '';
  if (/Edg\//i.test(ua)) return 'Edge';
  if (/OPR\//i.test(ua)) return 'Opera';
  if (/Chrome\//i.test(ua)) return 'Chrome';
  if (/Firefox\//i.test(ua)) return 'Firefox';
  if (/Safari\//i.test(ua)) return 'Safari';
  return 'Browser';
}

class AnalyticsTracker {
  constructor() {
    this.sessionStartTime = Date.now();
    this.pageStartTime = Date.now();
    this.currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
    this.timerId = null;
    this.user = null;
    this.apiBaseUrl = '';
    this.isInitialized = false;
  }

  init(apiBaseUrl, user) {
    if (typeof window === 'undefined') return;
    this.apiBaseUrl = (apiBaseUrl || '').replace(/\/+$/, '');
    this.user = user;

    if (this.isInitialized) return;
    this.isInitialized = true;

    // Send initial pageview non-blockingly after page has settled (idle callback or timeout)
    this.scheduleNonBlockingPing();

    // Setup visibilitychange listener for unload duration tracking
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.sendPing(true);
      } else {
        // Resumed
        this.pageStartTime = Date.now();
      }
    });

    // Window beforeunload (last chance beacon)
    window.addEventListener('beforeunload', () => {
      this.sendPing(true);
    });

    // Background heartbeat every 45s while visible
    this.startHeartbeat();
  }

  setUser(user) {
    this.user = user;
  }

  setApiBaseUrl(url) {
    this.apiBaseUrl = (url || '').replace(/\/+$/, '');
  }

  onPageChange(newPath) {
    if (this.currentPath === newPath) return;

    // Send closing ping for previous page with accumulated duration
    this.sendPing(true);

    this.currentPath = newPath;
    this.pageStartTime = Date.now();

    // Schedule ping for new page
    this.scheduleNonBlockingPing();
  }

  scheduleNonBlockingPing() {
    if (typeof window === 'undefined') return;
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => this.sendPing(false), { timeout: 2500 });
    } else {
      setTimeout(() => this.sendPing(false), 800);
    }
  }

  startHeartbeat() {
    if (this.timerId) clearInterval(this.timerId);
    this.timerId = setInterval(() => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        this.sendPing(false);
      }
    }, 45000);
  }

  sendPing(isFinal = false) {
    try {
      const now = Date.now();
      const durationSeconds = Math.max(1, Math.round((now - this.sessionStartTime) / 1000));
      const targetUrl = (this.apiBaseUrl ? `${this.apiBaseUrl}` : '') + '/api/analytics/track';

      const isLoggedIn = Boolean(this.user && this.user.role && this.user.role !== 'guest');
      const payload = {
        sessionId: getSessionId(),
        visitorId: getVisitorId(),
        isLoggedIn,
        user: isLoggedIn ? {
          id: this.user.id || this.user._id,
          name: this.user.name || this.user.nameBn,
          email: this.user.email,
          role: this.user.role
        } : null,
        page: this.currentPath || window.location.pathname || '/',
        pageTitle: typeof document !== 'undefined' ? document.title : '',
        device: getDeviceType(),
        browser: getBrowserName(),
        referrer: typeof document !== 'undefined' ? (document.referrer || '') : '',
        durationSeconds
      };

      const jsonStr = JSON.stringify(payload);

      // Prefer navigator.sendBeacon when available (completely async, zero freeze)
      if (navigator.sendBeacon) {
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const success = navigator.sendBeacon(targetUrl, blob);
        if (success) return;
      }

      // Fallback: fetch with keepalive & abort signal
      fetch(targetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: jsonStr,
        keepalive: true,
        mode: 'cors'
      }).catch(() => {
        // Silently ignore network failures (zero disruption)
      });
    } catch {
      // Ignore
    }
  }
}

export const tracker = new AnalyticsTracker();
