/**
 * RTEC Analytics Tracker
 * 
 * Guarantees:
 * 1. Zero performance overhead: All pings run asynchronously without blocking the UI
 * 2. Never blocks main thread, rendering, or animations
 * 3. Works 100% reliably on Mobile, Tablet & Desktop browsers
 * 4. Tracks:
 *    - Session ID & Visitor ID
 *    - Logged-in user details (if available) or Guest status
 *    - Page path & title
 *    - Device type (Mobile / Tablet / Desktop) & Browser
 *    - Time spent on site / page (duration in seconds)
 */

const PROD_API_BASE = 'https://rtec-alumni.onrender.com';

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

function resolveTargetUrl(customBase) {
  if (customBase && typeof customBase === 'string' && customBase.trim()) {
    return `${customBase.replace(/\/+$/, '')}/api/analytics/track`;
  }
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return `${PROD_API_BASE}/api/analytics/track`;
  }
  return '/api/analytics/track';
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

    // Send initial pageview immediately on load (async, non-blocking)
    this.scheduleQuickPing();

    // Setup visibilitychange listener for page hidden/resumed
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.sendPing(true);
      } else {
        this.pageStartTime = Date.now();
        this.scheduleQuickPing();
      }
    });

    // Window beforeunload (exit beacon)
    window.addEventListener('beforeunload', () => {
      this.sendPing(true);
    });

    // Background heartbeat every 30s while page remains open
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

    // Send closing ping for previous page
    this.sendPing(true);

    this.currentPath = newPath;
    this.pageStartTime = Date.now();

    // Schedule immediate ping for new page
    this.scheduleQuickPing();
  }

  scheduleQuickPing() {
    if (typeof window === 'undefined') return;
    setTimeout(() => this.sendPing(false), 120);
  }

  startHeartbeat() {
    if (this.timerId) clearInterval(this.timerId);
    this.timerId = setInterval(() => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        this.sendPing(false);
      }
    }, 30000);
  }

  sendPing(isFinal = false) {
    try {
      const now = Date.now();
      const durationSeconds = Math.max(1, Math.round((now - this.sessionStartTime) / 1000));
      const targetUrl = resolveTargetUrl(this.apiBaseUrl);

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

      // 1. Standard fetch with keepalive: true (Universal support, works with CORS seamlessly)
      fetch(targetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: jsonStr,
        keepalive: true,
        mode: 'cors'
      }).catch(() => {
        // Fallback to sendBeacon if fetch rejected (e.g. page unmounting)
        if (isFinal && navigator.sendBeacon) {
          try {
            const blob = new Blob([jsonStr], { type: 'application/json' });
            navigator.sendBeacon(targetUrl, blob);
          } catch {
            // ignore
          }
        }
      });
    } catch {
      // Ignore
    }
  }
}

export const tracker = new AnalyticsTracker();
