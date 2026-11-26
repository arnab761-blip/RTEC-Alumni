import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_ALUMNI,
  INITIAL_EVENTS,
  INITIAL_JOBS,
  INITIAL_CAMPAIGNS,
  INITIAL_NEWS,
  INITIAL_FORUM_POSTS,
  INITIAL_MEMORIES,
  INITIAL_TEACHERS,
  INITIAL_STUDENTS,
  INITIAL_STUDENT_SUBMISSIONS
} from '../data/mockData.js';
import confetti from 'canvas-confetti';

const sanitizeAvatar = (url) => {
  if (!url || typeof url !== 'string') return '';
  if (url.includes('unsplash.com')) return '';
  return url;
};

export const SUPER_ADMIN_EMAILS = ['megasonic298@gmail.com', 'arnab.rts761@gmail.com'];
export const DEFAULT_ADMIN_EMAILS = [...SUPER_ADMIN_EMAILS];

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // 0. Authorized Admin Emails List (Super Admins: megasonic298@gmail.com, arnab.rts761@gmail.com)
  const [adminEmails, setAdminEmails] = useState(() => {
    const saved = localStorage.getItem('rtec_admin_emails');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const merged = Array.from(new Set([
            ...SUPER_ADMIN_EMAILS,
            ...parsed.map(e => String(e).toLowerCase().trim()).filter(Boolean)
          ]));
          return merged;
        }
      } catch (e) {}
    }
    return DEFAULT_ADMIN_EMAILS;
  });

  useEffect(() => {
    localStorage.setItem('rtec_admin_emails', JSON.stringify(adminEmails));
  }, [adminEmails]);

  const isAdminEmail = (email) => {
    if (!email || typeof email !== 'string') return false;
    const clean = email.toLowerCase().trim();
    return SUPER_ADMIN_EMAILS.includes(clean) || adminEmails.some(e => e.toLowerCase().trim() === clean);
  };

  // Google OAuth Client ID (for real Google Identity Services popup)
  const DEFAULT_GOOGLE_CLIENT_ID = '782343280980-essi85hu3m14a10suicn7b16ve13tn5n.apps.googleusercontent.com';
  const [googleClientId, setGoogleClientIdState] = useState(() => {
    return import.meta.env.VITE_GOOGLE_CLIENT_ID || localStorage.getItem('rtec_google_client_id') || DEFAULT_GOOGLE_CLIENT_ID;
  });

  const updateGoogleClientId = (clientId) => {
    const clean = String(clientId || '').trim();
    setGoogleClientIdState(clean);
    if (clean) {
      localStorage.setItem('rtec_google_client_id', clean);
    } else {
      localStorage.removeItem('rtec_google_client_id');
    }
    syncEntityToMongo('/api/settings/kv', 'POST', { key: 'googleClientId', value: clean });
    return clean;
  };

  // Backend API Base URL (local dev uses Vite '/api' proxy; production uses Render URL)
  const DEFAULT_API_BASE = import.meta.env.VITE_API_URL
    ? String(import.meta.env.VITE_API_URL).replace(/\/+$/, '')
    : (import.meta.env.PROD ? 'https://rtec-alumni.onrender.com' : '');

  const [apiBaseUrl, setApiBaseUrlState] = useState(() => {
    const saved = localStorage.getItem('rtec_api_url');
    return saved ? String(saved).replace(/\/+$/, '') : DEFAULT_API_BASE;
  });

  const updateApiBaseUrl = (url) => {
    const clean = String(url || '').trim().replace(/\/+$/, '');
    setApiBaseUrlState(clean);
    if (clean) {
      localStorage.setItem('rtec_api_url', clean);
    } else {
      localStorage.removeItem('rtec_api_url');
    }
    return clean;
  };

  const resolveApiUrl = (endpoint) => {
    if (!endpoint) return endpoint;
    if (/^https?:\/\//i.test(endpoint)) return endpoint;
    const base = (apiBaseUrl || '').replace(/\/+$/, '');
    return base ? `${base}${endpoint}` : endpoint;
  };

  const apiFetch = async (endpoint, options = {}, retries = 2) => {
    const url = resolveApiUrl(endpoint);
    let lastError;
    for (let attempt = 0; attempt <= retries; attempt++) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 35000);
      try {
        const res = await fetch(url, { ...options, signal: controller.signal });
        clearTimeout(timeoutId);
        if (res.status >= 500 && attempt < retries) {
          await new Promise(r => setTimeout(r, 1500 * (attempt + 1)));
          continue;
        }
        return res;
      } catch (err) {
        clearTimeout(timeoutId);
        lastError = err;
        if (attempt < retries) {
          await new Promise(r => setTimeout(r, 1500 * (attempt + 1)));
        }
      }
    }
    throw lastError || new Error('Network request failed');
  };

  // Global Auth Feedback Popup State (Login Successful / Logged Out)
  const [authFeedback, setAuthFeedback] = useState(null);
  const triggerAuthFeedback = (type, info = {}) => {
    const id = Date.now();
    setAuthFeedback({
      id,
      type,
      name: info?.name || info?.nameBn || info?.email || 'RTEC Member',
      email: info?.email || ''
    });
    setTimeout(() => {
      setAuthFeedback(prev => (prev?.id === id ? null : prev));
    }, 3500);
  };
  const dismissAuthFeedback = () => setAuthFeedback(null);

  // 1. Current Authenticated User (Defaults to a regular guest visitor)
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('rtec_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.batch && parsed.batch.includes('2011-12')) {
          parsed.batch = '1st Batch (2018-19)';
        }
        if (parsed.avatar) {
          parsed.avatar = sanitizeAvatar(parsed.avatar);
        }
        // Strict Authorization: Verify admin role against authorized admin list!
        const cleanEmail = (parsed.email || '').toLowerCase().trim();
        if (parsed.role === 'admin') {
          if (!SUPER_ADMIN_EMAILS.includes(cleanEmail)) {
            const savedAdmins = localStorage.getItem('rtec_admin_emails');
            let allowed = [...SUPER_ADMIN_EMAILS];
            try {
              if (savedAdmins) allowed = [...SUPER_ADMIN_EMAILS, ...JSON.parse(savedAdmins).map(e => String(e).toLowerCase().trim())];
            } catch (err) {}
            if (!allowed.includes(cleanEmail)) {
              parsed.role = 'student'; // Demote non-authorized users
            }
          }
        }
        return parsed;
      } catch (e) {}
    }
    return {
      id: 'guest',
      name: 'Guest Visitor',
      nameBn: 'অতিথি পরিদর্শক',
      role: 'guest',
      email: '',
      avatar: '',
      isVerified: false
    };
  });

  // 2. Language State (Defaults to English 'en' on first visit; persists user's choice)
  const [lang, setLangState] = useState(() => localStorage.getItem('rtec_lang') || 'en');

  const setLang = (newLang) => {
    localStorage.setItem('rtec_lang', newLang);
    setLangState(newLang);
  };

  // 2.1 College Logo (Admin customizable, defaults to official RTEC logo)
  const [collegeLogo, setCollegeLogo] = useState(() => {
    return localStorage.getItem('rtec_college_logo') || '/images/rtec-logo.png';
  });

  // 2.2 Eye-soothing Theme Switching
  const applyThemeToDOM = (nextTheme) => {
    const root = document.documentElement;
    if (nextTheme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }
    localStorage.setItem('rtec_theme', nextTheme);
  };

  // Theme State ('light' by default, switchable to 'dark')
  const [theme, setThemeState] = useState(() => {
    const saved = localStorage.getItem('rtec_theme') || 'light';
    const root = document.documentElement;
    if (saved === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }
    return saved;
  });

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    applyThemeToDOM(nextTheme);
    setThemeState(nextTheme);
  };

  const setTheme = (newTheme) => {
    applyThemeToDOM(newTheme);
    setThemeState(newTheme);
  };

  useEffect(() => {
    localStorage.setItem('rtec_theme', theme);
  }, [theme]);

  // 3. Teachers / Faculty List
  const [teachers, setTeachers] = useState(() => {
    const saved = localStorage.getItem('rtec_teachers');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === 12 && parsed[0]?.name?.includes('Saifur Rahman')) {
          return parsed.map(t => ({ ...t, photo: sanitizeAvatar(t.photo) }));
        }
      } catch (e) {}
    }
    try {
      localStorage.setItem('rtec_teachers', JSON.stringify(INITIAL_TEACHERS));
    } catch (e) {}
    return INITIAL_TEACHERS.map(t => ({ ...t, photo: sanitizeAvatar(t.photo) }));
  });

  // 4. Current Students List (1st to 8th Batch: 2018-19 to 2025-26)
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('rtec_students');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const hasOldBatch = parsed.some(s => s.batch && s.batch.includes('2015-16'));
          const hasRoll = parsed.some(s => s.roll !== undefined);
          const hasDummy = parsed.some(s => s.id === 'std-1' || s.name === 'Md. Rayhan Kabir' || s.regNo === '2022-10-01');
          const hasSecondBatch = parsed.some(s => s.batch && s.batch.includes('2nd'));
          const hasThirdBatch = parsed.some(s => s.batch && s.batch.includes('3rd'));
          const hasFourthBatch = parsed.some(s => s.batch && s.batch.includes('4th'));
          const hasFifthBatch = parsed.some(s => s.batch && s.batch.includes('5th'));
          const hasSixthBatch = parsed.some(s => s.batch && s.batch.includes('6th'));
          const hasSeventhBatch = parsed.some(s => s.batch && s.batch.includes('7th'));
          const hasEighthBatch = parsed.some(s => s.batch && s.batch.includes('8th'));
          if (hasOldBatch || hasRoll || hasDummy || !hasSecondBatch || !hasThirdBatch || !hasFourthBatch || !hasFifthBatch || !hasSixthBatch || !hasSeventhBatch || !hasEighthBatch || parsed.length < 834) {
            localStorage.setItem('rtec_students', JSON.stringify(INITIAL_STUDENTS));
            return INITIAL_STUDENTS;
          }
          return parsed
            .map(s => {
              const base = s.regNo
                ? INITIAL_STUDENTS.find(init => init.regNo && init.regNo.trim().toLowerCase() === String(s.regNo).trim().toLowerCase())
                : null;
              if (base && (String(s.id || '').startsWith('std-sub-') || !s.serialNo || !s.studentType || !s.session)) {
                return {
                  ...base,
                  ...s,
                  id: base.id,
                  serialNo: base.serialNo,
                  batchSlNo: base.batchSlNo,
                  deptSlNo: base.deptSlNo,
                  session: base.session,
                  year: base.year,
                  studentType: base.studentType,
                  avatar: sanitizeAvatar(s.avatar)
                };
              }
              return { ...s, avatar: sanitizeAvatar(s.avatar) };
            })
            .sort((a, b) => (a.serialNo || 999999) - (b.serialNo || 999999));
        }
      } catch (e) {}
    }
    return INITIAL_STUDENTS.map(s => ({ ...s, avatar: sanitizeAvatar(s.avatar) }));
  });

  // 5. Alumni List (1st to 8th Batch: 2018-19 to 2025-26)
  const [alumni, setAlumni] = useState(() => {
    const saved = localStorage.getItem('rtec_alumni');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const hasDummy = parsed.some(a => a.id?.startsWith('alm-') || a.name?.includes('Tanvir Ahmed') || a.company?.includes('Square Textiles'));
          if (!hasDummy) {
            return parsed.map(a => ({ ...a, avatar: sanitizeAvatar(a.avatar) }));
          }
        }
      } catch (e) {}
    }
    try {
      localStorage.setItem('rtec_alumni', JSON.stringify([]));
    } catch (e) {}
    return [];
  });

  // 6. Events List (Clean real events only - purge legacy dummy events)
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('rtec_events');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const clean = parsed.filter(e => {
            const isLegacySeed = e.id === 'evt-1' || e.id === 'evt-2' || e.id === 'evt-3';
            const hasUnsplash = typeof e.image === 'string' && e.image.includes('unsplash.com');
            return !isLegacySeed && !hasUnsplash;
          });
          if (clean.length !== parsed.length) {
            localStorage.setItem('rtec_events', JSON.stringify(clean));
          }
          return clean;
        }
      } catch (e) {}
    }
    return INITIAL_EVENTS;
  });

  // 7. Jobs List (Clean verified jobs only)
  const [jobs, setJobs] = useState(() => {
    const saved = localStorage.getItem('rtec_jobs');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const clean = parsed.filter(j => !j.id?.startsWith('job-') || j.isUserCreated);
          if (clean.length !== parsed.length) {
            localStorage.setItem('rtec_jobs', JSON.stringify(clean));
          }
          return clean;
        }
      } catch (e) {}
    }
    try {
      localStorage.setItem('rtec_jobs', JSON.stringify([]));
    } catch (e) {}
    return [];
  });

  // 8. Fundraising Campaigns (Clean real campaigns only)
  const [campaigns, setCampaigns] = useState(() => {
    const saved = localStorage.getItem('rtec_campaigns');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const clean = parsed.filter(c => {
            const isLegacySeed = c.id === 'cmp-1' || c.id === 'cmp-2' || c.id === 'cmp-3';
            const hasUnsplash = typeof c.image === 'string' && c.image.includes('unsplash.com');
            return !isLegacySeed && !hasUnsplash;
          });
          if (clean.length !== parsed.length) {
            localStorage.setItem('rtec_campaigns', JSON.stringify(clean));
          }
          return clean;
        }
      } catch (e) {}
    }
    return INITIAL_CAMPAIGNS;
  });

  // 9. News & Notices (Clean official notices only)
  const [news, setNews] = useState(() => {
    const saved = localStorage.getItem('rtec_news');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const clean = parsed.filter(n => !n.id?.startsWith('news-') || n.isUserCreated);
          if (clean.length !== parsed.length) {
            localStorage.setItem('rtec_news', JSON.stringify(clean));
          }
          return clean;
        }
      } catch (e) {}
    }
    try {
      localStorage.setItem('rtec_news', JSON.stringify([]));
    } catch (e) {}
    return [];
  });

  // 10. Forum Posts & Experience Share
  const [forumPosts, setForumPosts] = useState(() => {
    const normalizePost = (p, pIdx) => ({
      ...p,
      avatar: sanitizeAvatar(p.avatar),
      type: p.type || 'experience',
      authorId: p.authorId || `usr-p-${pIdx}`,
      authorEmail: p.authorEmail || '',
      replies: (p.replies || []).map((r, rIdx) => ({
        ...r,
        avatar: sanitizeAvatar(r.avatar),
        id: r.id || `rpl-${p.id || pIdx}-${rIdx}`,
        authorId: r.authorId || `usr-r-${rIdx}`,
        authorEmail: r.authorEmail || '',
        isDeleted: Boolean(r.isDeleted),
        isEdited: Boolean(r.isEdited)
      }))
    });

    const saved = localStorage.getItem('rtec_forum');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const clean = parsed.filter(p => !p.id?.startsWith('frm-') || p.isUserCreated);
          if (clean.length !== parsed.length) {
            localStorage.setItem('rtec_forum', JSON.stringify(clean));
          }
          return clean.map(normalizePost);
        }
      } catch (e) {}
    }
    try {
      localStorage.setItem('rtec_forum', JSON.stringify([]));
    } catch (e) {}
    return [];
  });

  // 11. Footer & College Contact Details (Admin Configurable)
  const DEFAULT_FOOTER_CONTACT = {
    phone: '+880 521-55421',
    email: 'info@rtec.edu.bd',
    addressBn: 'টুকুরিয়া, পীরগঞ্জ, রংপুর-৫৪২০, বাংলাদেশ',
    addressEn: 'Tukuriya, Pirganj, Rangpur-5420, Bangladesh'
  };

  const [footerContact, setFooterContact] = useState(() => {
    const saved = localStorage.getItem('rtec_footer_contact');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') return { ...DEFAULT_FOOTER_CONTACT, ...parsed };
      } catch (e) {}
    }
    return DEFAULT_FOOTER_CONTACT;
  });

  const updateFooterContact = (newContact) => {
    const updated = { ...footerContact, ...newContact };
    setFooterContact(updated);
    localStorage.setItem('rtec_footer_contact', JSON.stringify(updated));
    syncEntityToMongo('/api/settings/contact', 'POST', updated);
    confetti({ particleCount: 30, spread: 50 });
    return updated;
  };

  const resetFooterContact = () => {
    setFooterContact(DEFAULT_FOOTER_CONTACT);
    localStorage.setItem('rtec_footer_contact', JSON.stringify(DEFAULT_FOOTER_CONTACT));
    syncEntityToMongo('/api/settings/contact', 'POST', DEFAULT_FOOTER_CONTACT);
  };

  const [memories, setMemories] = useState(() => {
    const saved = localStorage.getItem('rtec_memories');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const clean = parsed.filter(m => {
            const isLegacySeed = ['mem-1', 'mem-2', 'mem-3', 'mem-4', 'mem-5', 'mem-6'].includes(m.id);
            const hasUnsplash = typeof m.image === 'string' && m.image.includes('unsplash.com');
            return !isLegacySeed && !hasUnsplash;
          });
          if (clean.length !== parsed.length) {
            localStorage.setItem('rtec_memories', JSON.stringify(clean));
          }
          return clean;
        }
      } catch (e) {}
    }
    return INITIAL_MEMORIES;
  });

  // 11. Student Self-Input Submissions (Pending Admin Approval)
  const [studentSubmissions, setStudentSubmissions] = useState(() => {
    const saved = localStorage.getItem('rtec_student_submissions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const hasDummy = parsed.some(s => s.id === 'sub-101' || s.nameEn === 'Md. Touhidul Islam');
          if (hasDummy) {
            localStorage.setItem('rtec_student_submissions', JSON.stringify([]));
            return [];
          }
          return parsed
            .map(s => {
              const base = s.regNo
                ? INITIAL_STUDENTS.find(init => init.regNo && init.regNo.trim().toLowerCase() === String(s.regNo).trim().toLowerCase())
                : null;
              if (base && (String(s.id || '').startsWith('std-sub-') || !s.serialNo || !s.studentType || !s.session)) {
                return {
                  ...base,
                  ...s,
                  id: base.id,
                  serialNo: base.serialNo,
                  batchSlNo: base.batchSlNo,
                  deptSlNo: base.deptSlNo,
                  session: base.session,
                  year: base.year,
                  studentType: base.studentType,
                  avatar: sanitizeAvatar(s.avatar)
                };
              }
              return { ...s, avatar: sanitizeAvatar(s.avatar) };
            })
            .sort((a, b) => (a.serialNo || 999999) - (b.serialNo || 999999));
        }
      } catch (e) {}
    }
    return INITIAL_STUDENT_SUBMISSIONS.map(s => ({ ...s, avatar: sanitizeAvatar(s.avatar) }));
  });

  // 11.1 Active Tracked Submission ID for the current student session
  const [mySubmissionId, setMySubmissionId] = useState(() => {
    return localStorage.getItem('rtec_my_submission_id') || '';
  });

  useEffect(() => {
    if (mySubmissionId) {
      localStorage.setItem('rtec_my_submission_id', mySubmissionId);
    }
  }, [mySubmissionId]);

  // Reactive lookup strictly scoped to the current authenticated user's email (prevents cross-account leaks)
  const currentSessionEmail = user && user.role !== 'guest' ? (user.email || '').toLowerCase().trim() : '';
  const mySubmission = currentSessionEmail
    ? (studentSubmissions.find(s => s.email && s.email.toLowerCase().trim() === currentSessionEmail) || null)
    : (mySubmissionId
        ? (studentSubmissions.find(s => s.id === mySubmissionId && (!s.email || s.email.toLowerCase().trim() === (localStorage.getItem('rtec_my_submission_email') || '').toLowerCase().trim())) || null)
        : null);

  // Shared ownership & duplicate claim checker ("One Registration Number = One Verified Gmail")
  const getRegNoClaimConflict = (regNo, requesterEmail = '', excludeSubmissionId = null) => {
    const normReg = String(regNo || '').trim().toLowerCase();
    if (!normReg) return null;
    const normEmail = String(requesterEmail || '').trim().toLowerCase();

    // 1. Active (pending or approved) submission owned by a different email
    const subConflict = studentSubmissions.find(s => {
      if (!s || (excludeSubmissionId && s.id === excludeSubmissionId)) return false;
      if (s.status === 'declined') return false;
      if (!s.regNo || s.regNo.trim().toLowerCase() !== normReg) return false;
      const ownerEmail = (s.email || '').trim().toLowerCase();
      if (!ownerEmail) return false;
      return !normEmail || ownerEmail !== normEmail;
    });
    if (subConflict) {
      return {
        reason: 'submission',
        ownerEmail: subConflict.email,
        status: subConflict.status,
        name: subConflict.name || subConflict.nameEn || ''
      };
    }

    // 2. Claimed Student Directory record
    const studentMatch = students.find(
      st => st && st.regNo && st.regNo.trim().toLowerCase() === normReg
    );
    if (studentMatch && studentMatch.email && studentMatch.email.trim() !== '') {
      const ownerEmail = studentMatch.email.trim().toLowerCase();
      if (!normEmail || ownerEmail !== normEmail) {
        return {
          reason: 'directory',
          ownerEmail: studentMatch.email,
          status: 'approved',
          name: studentMatch.name || studentMatch.nameBn || ''
        };
      }
    }

    // 3. Claimed Alumni Directory record
    const alumniMatch = alumni.find(
      al => al && al.regNo && al.regNo.trim().toLowerCase() === normReg && al.email && al.email.trim() !== ''
    );
    if (alumniMatch) {
      const ownerEmail = alumniMatch.email.trim().toLowerCase();
      if (!normEmail || ownerEmail !== normEmail) {
        return {
          reason: 'alumni',
          ownerEmail: alumniMatch.email,
          status: 'approved',
          name: alumniMatch.name || alumniMatch.nameBn || ''
        };
      }
    }

    return null;
  };

  // 11.2 ID Disputes & Prank Reports
  const [disputes, setDisputes] = useState(() => {
    const saved = localStorage.getItem('rtec_disputes');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
    }
    return [];
  });

  // 11.3 Contact Inquiries, Mentorship Requests, Event Registrations (Admin View), Job Applications
  const [contactMessages, setContactMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('rtec_contact_messages');
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  });

  const [mentorshipRequests, setMentorshipRequests] = useState(() => {
    try {
      const saved = localStorage.getItem('rtec_mentorship_requests');
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  });

  const [allEventRegistrations, setAllEventRegistrations] = useState([]);

  const [jobApplications, setJobApplications] = useState(() => {
    try {
      const saved = localStorage.getItem('rtec_job_applications');
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try { localStorage.setItem('rtec_contact_messages', JSON.stringify(contactMessages)); } catch (e) {}
  }, [contactMessages]);

  useEffect(() => {
    try { localStorage.setItem('rtec_mentorship_requests', JSON.stringify(mentorshipRequests)); } catch (e) {}
  }, [mentorshipRequests]);

  useEffect(() => {
    try { localStorage.setItem('rtec_job_applications', JSON.stringify(jobApplications)); } catch (e) {}
  }, [jobApplications]);

  useEffect(() => {
    localStorage.setItem('rtec_disputes', JSON.stringify(disputes));
  }, [disputes]);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('rtec_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('rtec_lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('rtec_teachers', JSON.stringify(teachers));
  }, [teachers]);

  useEffect(() => {
    localStorage.setItem('rtec_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('rtec_alumni', JSON.stringify(alumni));
  }, [alumni]);

  useEffect(() => {
    localStorage.setItem('rtec_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('rtec_jobs', JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem('rtec_campaigns', JSON.stringify(campaigns));
  }, [campaigns]);

  useEffect(() => {
    localStorage.setItem('rtec_news', JSON.stringify(news));
  }, [news]);

  useEffect(() => {
    localStorage.setItem('rtec_forum', JSON.stringify(forumPosts));
  }, [forumPosts]);

  useEffect(() => {
    localStorage.setItem('rtec_memories', JSON.stringify(memories));
  }, [memories]);

  useEffect(() => {
    localStorage.setItem('rtec_student_submissions', JSON.stringify(studentSubmissions));
  }, [studentSubmissions]);

  useEffect(() => {
    if (collegeLogo) {
      localStorage.setItem('rtec_college_logo', collegeLogo);
    } else {
      localStorage.removeItem('rtec_college_logo');
    }
  }, [collegeLogo]);

  const updateCollegeLogo = (logoUrl) => {
    setCollegeLogo(logoUrl || '');
    syncEntityToMongo('/api/settings/kv', 'POST', { key: 'collegeLogo', value: logoUrl || '' });
    confetti({ particleCount: 50, spread: 60 });
  };

  const resetCollegeLogo = () => {
    setCollegeLogo('');
    localStorage.removeItem('rtec_college_logo');
    syncEntityToMongo('/api/settings/kv', 'POST', { key: 'collegeLogo', value: '' });
  };

  // ============================================
  // MONGODB ATLAS SYNC HELPERS
  // ============================================
  const syncEntityToMongo = async (endpoint, method = 'POST', payload = null) => {
    try {
      await apiFetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: payload ? JSON.stringify(payload) : undefined
      }, 2);
    } catch (e) {
      // offline silent fallback
    }
  };

  const syncUserToMongo = (userData) => {
    if (!userData || !userData.email) return;
    syncEntityToMongo('/api/auth/sync', 'POST', userData);
  };

  // Auth Functions
  const login = (role, email, name, batch = '', dept = '', extra = {}) => {
    const regNo = extra.regNo ? String(extra.regNo).trim() : '';
    const phone = extra.phone ? String(extra.phone).trim() : '';
    const cleanEmail = (email || '').toLowerCase().trim();

    // STRICT AUTHORIZATION: Admin accounts MUST sign in via verified Google Identity Services OAuth
    const isAuthorizedAdmin = isAdminEmail(cleanEmail);
    if (isAuthorizedAdmin && !extra.googleVerified) {
      return { error: 'ADMIN_GOOGLE_REQUIRED' };
    }
    let effectiveRole = isAuthorizedAdmin ? 'admin' : (role === 'admin' ? 'student' : role);

    // Clear previous session submission tracking before switching user
    untrackSubmission();
    const existingSub = cleanEmail
      ? studentSubmissions.find(s => s.email && s.email.toLowerCase().trim() === cleanEmail)
      : null;
    if (existingSub) {
      setMySubmissionId(existingSub.id);
      localStorage.setItem('rtec_my_submission_id', existingSub.id);
      localStorage.setItem('rtec_my_submission_email', cleanEmail);
      if (existingSub.regNo) localStorage.setItem('rtec_my_submission_reg', existingSub.regNo);
    }

    const verifiedStudent = cleanEmail
      ? students.find(s => s.email && s.email.toLowerCase().trim() === cleanEmail)
      : null;

    const newUser = {
      id: `usr-${Date.now()}`,
      name: name || existingSub?.name || verifiedStudent?.name || (effectiveRole === 'admin' ? 'Administrator' : 'Registered Member'),
      nameBn: name || existingSub?.name || verifiedStudent?.nameBn || (effectiveRole === 'admin' ? 'এডমিনিস্ট্রেটর' : 'নিবন্ধিত সদস্য'),
      role: effectiveRole, // 'admin' | 'alumni' | 'student'
      batch: existingSub?.batch || verifiedStudent?.batch || batch,
      department: existingSub?.department || verifiedStudent?.department || dept,
      company: effectiveRole === 'alumni' ? 'Textile Industry' : (effectiveRole === 'admin' ? 'RTEC Administration' : 'Student at RTEC'),
      email: cleanEmail || 'user@rtec.edu.bd',
      phone: phone || existingSub?.phone || verifiedStudent?.phone || '',
      regNo: regNo || existingSub?.regNo || verifiedStudent?.regNo || '',
      avatar: sanitizeAvatar(existingSub?.avatar || verifiedStudent?.avatar) || '',
      isVerified: effectiveRole === 'admin' || effectiveRole === 'alumni' || Boolean(verifiedStudent) || existingSub?.status === 'approved',
      googleVerified: Boolean(extra.googleVerified),
      submissionStatus: existingSub?.status || 'none',
      submissionId: existingSub?.id || null
    };
    setUser(newUser);
    syncUserToMongo(newUser);
    triggerAuthFeedback('login', newUser);
    return newUser;
  };

  const logout = () => {
    const prevInfo = user;
    untrackSubmission();
    setUser({
      id: 'guest',
      name: 'Guest Visitor',
      nameBn: 'অতিথি পরিদর্শক',
      role: 'guest',
      isVerified: false
    });
    triggerAuthFeedback('logout', prevInfo);
  };

  // ============================================
  // TEACHERS / FACULTY CRUD
  // ============================================
  const addTeacher = (teacherData) => {
    const newTeacher = {
      id: `tch-${Date.now()}`,
      status: 'Active',
      photo: sanitizeAvatar(teacherData?.photo) || '',
      ...teacherData
    };
    setTeachers(prev => [newTeacher, ...prev]);
    syncEntityToMongo('/api/teachers', 'POST', newTeacher);
    confetti({ particleCount: 50, spread: 60 });
    return newTeacher;
  };

  const updateTeacher = (id, updatedData) => {
    setTeachers(prev => prev.map(t => (t.id === id ? { ...t, ...updatedData } : t)));
    syncEntityToMongo('/api/teachers', 'POST', { id, ...updatedData });
  };

  const deleteTeacher = (id) => {
    setTeachers(prev => prev.filter(t => t.id !== id));
    syncEntityToMongo(`/api/teachers/${id}`, 'DELETE');
  };

  // ============================================
  // STUDENTS CRUD
  // ============================================
  const addStudent = (studentData) => {
    const newStudent = {
      id: `std-${Date.now()}`,
      status: 'Regular',
      avatar: sanitizeAvatar(studentData?.avatar) || '',
      ...studentData
    };
    setStudents(prev => [newStudent, ...prev]);
    syncEntityToMongo('/api/students', 'POST', newStudent);
    confetti({ particleCount: 50, spread: 60 });
    return newStudent;
  };

  const updateStudent = (id, updatedData) => {
    setStudents(prev => prev.map(s => (s.id === id ? { ...s, ...updatedData } : s)));
    syncEntityToMongo('/api/students', 'POST', { id, ...updatedData });
  };

  const deleteStudent = (id) => {
    setStudents(prev => prev.filter(s => s.id !== id));
    syncEntityToMongo(`/api/students/${id}`, 'DELETE');
  };

  // ============================================
  // MONGODB ATLAS SYNC & API HELPERS
  // ============================================
  const [mongoStatus, setMongoStatus] = useState({
    isConnected: false,
    database: 'rtec_alumni',
    host: 'cluster0.4blztie.mongodb.net',
    error: null,
    checking: false
  });

  const bootstrapFromMongo = async () => {
    try {
      const res = await apiFetch('/api/bootstrap', {}, 2);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          const {
            students: dbStudents,
            alumni: dbAlumni,
            teachers: dbTeachers,
            events: dbEvents,
            jobs: dbJobs,
            news: dbNews,
            submissions: dbSubs,
            disputes: dbDisputes,
            forumPosts: dbForumPosts,
            memories: dbMemories,
            contacts: dbContacts,
            mentorshipRequests: dbMentorship,
            eventRegistrations: dbEventRegs,
            jobApplications: dbJobApps,
            collegeLogo: dbCollegeLogo,
            googleClientId: dbGoogleClientId
          } = json.data;

          if (Array.isArray(dbStudents) && dbStudents.length > 0) {
            const sortedStudents = [...dbStudents].sort((a, b) => {
              const slA = Number(a.serialNo) || 999999;
              const slB = Number(b.serialNo) || 999999;
              if (slA !== slB) return slA - slB;
              return String(a.regNo || '').localeCompare(String(b.regNo || ''));
            });
            setStudents(sortedStudents);
          }
          let cleanAlumni = [];
          if (Array.isArray(dbAlumni)) {
            cleanAlumni = dbAlumni.filter(a => !a.id?.startsWith('alm-1') && !a.name?.includes('Tanvir Ahmed'));
            setAlumni(cleanAlumni);
          }
          if (Array.isArray(dbTeachers) && dbTeachers.length > 0) {
            setTeachers(dbTeachers);
          }
          if (Array.isArray(dbEvents)) {
            setEvents(dbEvents);
          }
          if (Array.isArray(dbJobs)) {
            setJobs(dbJobs);
          }
          if (Array.isArray(dbNews)) {
            setNews(dbNews);
          }
          if (Array.isArray(dbSubs)) {
            setStudentSubmissions(dbSubs);
          }
          if (Array.isArray(dbDisputes)) {
            setDisputes(dbDisputes);
          }
          if (Array.isArray(dbForumPosts)) {
            setForumPosts(dbForumPosts);
          }
          if (Array.isArray(dbMemories)) {
            setMemories(dbMemories);
          }
          if (Array.isArray(dbContacts)) {
            setContactMessages(dbContacts);
          }
          if (Array.isArray(dbMentorship)) {
            setMentorshipRequests(dbMentorship);
          }
          if (Array.isArray(dbEventRegs)) {
            setAllEventRegistrations(dbEventRegs);
            setUser(currUser => {
              const curEmail = (currUser?.email || '').toLowerCase().trim();
              if (curEmail) {
                const mine = dbEventRegs.filter(r => (r.attendeeEmail || '').toLowerCase().trim() === curEmail);
                if (mine.length > 0) {
                  setRegisteredEvents(mine);
                }
              }
              return currUser;
            });
          }
          if (Array.isArray(dbJobApps)) {
            setJobApplications(dbJobApps);
          }
          if (typeof dbCollegeLogo === 'string' && dbCollegeLogo) {
            setCollegeLogo(dbCollegeLogo);
          }
          if (typeof dbGoogleClientId === 'string' && dbGoogleClientId) {
            setGoogleClientIdState(dbGoogleClientId);
            try { localStorage.setItem('rtec_google_client_id', dbGoogleClientId); } catch (e) {}
          }
          let latestAdmins = adminEmails;
          if (Array.isArray(json.data.adminEmails) && json.data.adminEmails.length > 0) {
            latestAdmins = Array.from(new Set([...SUPER_ADMIN_EMAILS, ...json.data.adminEmails.map(e => e.toLowerCase().trim())]));
            setAdminEmails(latestAdmins);
            localStorage.setItem('rtec_admin_emails', JSON.stringify(latestAdmins));
          }
          if (json.data.contact && typeof json.data.contact === 'object') {
            setFooterContact(prev => ({ ...prev, ...json.data.contact }));
            localStorage.setItem('rtec_footer_contact', JSON.stringify(json.data.contact));
          }

          // Reconcile current authenticated session against live MongoDB status
          setUser(prevUser => {
            if (!prevUser || prevUser.role === 'guest' || !prevUser.email) return prevUser;
            const curEmail = prevUser.email.toLowerCase().trim();
            const sub = Array.isArray(dbSubs) ? dbSubs.find(s => s.email && s.email.toLowerCase().trim() === curEmail) : null;
            const std = Array.isArray(dbStudents) ? dbStudents.find(s => s.email && s.email.toLowerCase().trim() === curEmail) : null;
            const alm = cleanAlumni.find(a => a.email && a.email.toLowerCase().trim() === curEmail);
            if (sub?.id) {
              setMySubmissionId(sub.id);
              try {
                localStorage.setItem('rtec_my_submission_id', sub.id);
                localStorage.setItem('rtec_my_submission_email', curEmail);
                if (sub.regNo) localStorage.setItem('rtec_my_submission_reg', sub.regNo);
              } catch (e) {}
            }
            const isAdmin = latestAdmins.includes(curEmail) && Boolean(prevUser.googleVerified || prevUser.role === 'admin');
            const nextRole = isAdmin ? 'admin' : (alm ? 'alumni' : (prevUser.role || 'student'));
            const nextVerified = isAdmin || Boolean(prevUser.googleVerified) || sub?.status === 'approved' || Boolean(std || alm);
            return {
              ...prevUser,
              role: nextRole,
              isVerified: nextVerified,
              batch: sub?.batch || std?.batch || alm?.batch || prevUser.batch,
              department: sub?.department || std?.department || alm?.department || prevUser.department,
              regNo: sub?.regNo || std?.regNo || alm?.regNo || prevUser.regNo,
              submissionId: sub?.id || prevUser.submissionId,
              submissionStatus: sub?.status || (std ? 'approved' : prevUser.submissionStatus || 'none')
            };
          });
        }
      }
    } catch (e) {
      // offline fallback
    }
  };

  const checkMongoHealth = async (overrideBaseUrl) => {
    try {
      setMongoStatus(prev => ({ ...prev, checking: true }));
      const healthUrl = overrideBaseUrl !== undefined
        ? `${String(overrideBaseUrl).replace(/\/+$/, '')}/api/health`
        : '/api/health';
      const res = await apiFetch(healthUrl, {}, 1);
      if (res.ok) {
        const data = await res.json();
        const connected = data.status === 'connected';
        setMongoStatus({
          isConnected: connected,
          database: data.database || 'rtec_alumni',
          host: data.host || 'cluster0.4blztie.mongodb.net',
          error: data.error,
          stats: data.stats,
          checking: false
        });
        if (connected) {
          bootstrapFromMongo();
        }
        return data;
      }
      setMongoStatus(prev => ({ ...prev, isConnected: false, checking: false, error: `HTTP ${res.status}` }));
    } catch (e) {
      setMongoStatus({
        isConnected: false,
        database: 'rtec_alumni',
        host: 'cluster0.4blztie.mongodb.net',
        error: 'Backend API server offline',
        checking: false
      });
    }
    return null;
  };

  useEffect(() => {
    checkMongoHealth();
  }, []);

  // One-time aggressive purge of legacy mock/dummy data (Jobs, News, Forum) from browser localStorage
  useEffect(() => {
    try {
      const purgeKey = 'rtec_dummy_purge_v3';
      if (!localStorage.getItem(purgeKey)) {
        // Clean forum
        const savedForum = localStorage.getItem('rtec_forum');
        if (savedForum) {
          try {
            const parsed = JSON.parse(savedForum);
            if (Array.isArray(parsed)) {
              const cleanForum = parsed.filter(p => !p.id?.startsWith('frm-') && Boolean(p.isUserCreated));
              localStorage.setItem('rtec_forum', JSON.stringify(cleanForum));
              setForumPosts(cleanForum);
            }
          } catch (e) {}
        }
        // Clean jobs
        const savedJobs = localStorage.getItem('rtec_jobs');
        if (savedJobs) {
          try {
            const parsed = JSON.parse(savedJobs);
            if (Array.isArray(parsed)) {
              const cleanJobs = parsed.filter(j => !j.id?.startsWith('job-') && Boolean(j.isUserCreated));
              localStorage.setItem('rtec_jobs', JSON.stringify(cleanJobs));
              setJobs(cleanJobs);
            }
          } catch (e) {}
        }
        // Clean news
        const savedNews = localStorage.getItem('rtec_news');
        if (savedNews) {
          try {
            const parsed = JSON.parse(savedNews);
            if (Array.isArray(parsed)) {
              const cleanNews = parsed.filter(n => !n.id?.startsWith('news-') && Boolean(n.isUserCreated));
              localStorage.setItem('rtec_news', JSON.stringify(cleanNews));
              setNews(cleanNews);
            }
          } catch (e) {}
        }
        localStorage.setItem(purgeKey, 'true');
      }
    } catch (e) {}
  }, []);

  const bulkImportStudents = async (newStudents) => {
    if (!Array.isArray(newStudents) || newStudents.length === 0) {
      return { success: false, error: lang === 'bn' ? 'কোনো শিক্ষার্থীর ডেটা পাওয়া যায়নি।' : 'No student records found.' };
    }

    let updatedCount = 0;
    let addedCount = 0;

    setStudents(prev => {
      const existingMap = new Map();
      prev.forEach(s => {
        if (s.regNo) existingMap.set(String(s.regNo).trim(), s);
      });

      newStudents.forEach(ns => {
        const key = String(ns.regNo).trim();
        if (existingMap.has(key)) {
          const old = existingMap.get(key);
          existingMap.set(key, { ...old, ...ns, id: old.id });
          updatedCount++;
        } else {
          existingMap.set(key, ns);
          addedCount++;
        }
      });

      return Array.from(existingMap.values());
    });

    let mongoSynced = false;
    let mongoError = null;

    try {
      const res = await apiFetch('/api/students/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ students: newStudents })
      }, 1);
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          mongoSynced = true;
          setMongoStatus(prev => ({ ...prev, isConnected: true, error: null }));
        } else {
          mongoError = json.error;
        }
      } else {
        const errJson = await res.json().catch(() => ({}));
        mongoError = errJson.error || `Server responded with ${res.status}`;
      }
    } catch (err) {
      mongoError = err.message;
    }

    confetti({ particleCount: 80, spread: 70 });

    return {
      success: true,
      totalImported: newStudents.length,
      added: addedCount,
      updated: updatedCount,
      mongoSynced,
      mongoError
    };
  };

  const syncStudentsToMongo = async () => {
    try {
      const res = await apiFetch('/api/students/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ students })
      }, 1);
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setMongoStatus(prev => ({ ...prev, isConnected: true, error: null }));
          confetti({ particleCount: 50, spread: 60 });
          return { success: true, count: students.length };
        }
        return { success: false, error: json.error };
      }
      return { success: false, error: `Server error: ${res.status}` };
    } catch (e) {
      return { success: false, error: e.message };
    }
  };

  // Live 2-way sync: Pulls latest students from server's Master Excel file
  const syncWithExcelFile = async () => {
    try {
      const res = await apiFetch('/api/students/excel/sync', { method: 'POST' }, 1);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.students)) {
          setStudents(data.students);
          localStorage.setItem('rtec_students', JSON.stringify(data.students));
          confetti({ particleCount: 75, spread: 65 });
          return { success: true, count: data.students.length };
        }
        return { success: false, error: data.error || 'Sync returned invalid response' };
      }
      return { success: false, error: `Server responded with ${res.status}` };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Direct download of the live Master Excel file
  const exportExcelFile = () => {
    const link = document.createElement('a');
    link.href = resolveApiUrl('/api/students/excel/export');
    link.download = 'RTEC_Students_Master.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ============================================
  // ALUMNI CRUD & VERIFICATION
  // ============================================
  const addAlumni = (alumniData) => {
    const newAlum = {
      id: `alm-${Date.now()}`,
      isVerified: true,
      avatar: sanitizeAvatar(alumniData?.avatar) || '',
      skills: ['Textile Engineering', 'Quality Assurance'],
      ...alumniData
    };
    setAlumni(prev => [newAlum, ...prev]);
    syncEntityToMongo('/api/alumni', 'POST', newAlum);
    confetti({ particleCount: 60, spread: 60 });
    return newAlum;
  };

  const updateAlumni = (id, updatedData) => {
    setAlumni(prev => prev.map(a => (a.id === id ? { ...a, ...updatedData } : a)));
    syncEntityToMongo('/api/alumni', 'POST', { id, ...updatedData });
  };

  const deleteAlumni = (id) => {
    setAlumni(prev => prev.filter(a => a.id !== id));
    syncEntityToMongo(`/api/alumni/${id}`, 'DELETE');
  };

  const toggleVerifyAlumni = (id) => {
    setAlumni(prev => {
      const updated = prev.map(a => {
        if (a.id === id) {
          const nextVal = !a.isVerified;
          syncEntityToMongo('/api/alumni', 'POST', { id, isVerified: nextVal });
          return { ...a, isVerified: nextVal };
        }
        return a;
      });
      return updated;
    });
  };

  const toggleMentorAlumni = (id) => {
    setAlumni(prev => {
      const updated = prev.map(a => {
        if (a.id === id) {
          const nextVal = !a.isMentor;
          syncEntityToMongo('/api/alumni', 'POST', { id, isMentor: nextVal });
          return { ...a, isMentor: nextVal };
        }
        return a;
      });
      return updated;
    });
  };

  // ============================================
  // EVENTS CRUD
  // ============================================
  const addEvent = (eventData) => {
    const newEvent = {
      id: `evt-${Date.now()}`,
      seatsRegistered: 0,
      image: '',
      ...eventData
    };
    setEvents(prev => [newEvent, ...prev]);
    syncEntityToMongo('/api/events', 'POST', newEvent);
    return newEvent;
  };

  const updateEvent = (id, updatedData) => {
    setEvents(prev => prev.map(e => (e.id === id ? { ...e, ...updatedData } : e)));
    syncEntityToMongo('/api/events', 'POST', { id, ...updatedData });
  };

  const deleteEvent = (id) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    syncEntityToMongo(`/api/events/${id}`, 'DELETE');
  };

  // 6.1 User Event Registrations (Persisted cleanly; starts completely empty until user registers)
  const [registeredEvents, setRegisteredEvents] = useState(() => {
    const saved = localStorage.getItem('rtec_registered_events');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('rtec_registered_events', JSON.stringify(registeredEvents));
  }, [registeredEvents]);

  const registerForEvent = (eventId, attendeeInfo = {}) => {
    const targetEvent = events.find(evt => evt.id === eventId);
    setEvents(prev =>
      prev.map(evt => {
        if (evt.id === eventId) {
          const updatedSeats = (evt.seatsRegistered || 0) + 1;
          syncEntityToMongo('/api/events', 'POST', { id: eventId, seatsRegistered: updatedSeats });
          return {
            ...evt,
            seatsRegistered: updatedSeats
          };
        }
        return evt;
      })
    );

    const attendeeEmail = (attendeeInfo?.email || (user?.role !== 'guest' ? user?.email : '') || '').trim().toLowerCase();
    const token = `RTEC-EVT-${String(Date.now()).slice(-6)}`;
    const registrationRecord = {
      id: `reg-${Date.now()}`,
      eventId,
      eventTitle: targetEvent?.title || 'RTEC Event',
      eventTitleBn: targetEvent?.titleBn || targetEvent?.title || 'আরটেক ইভেন্ট',
      date: targetEvent?.date || '',
      venue: targetEvent?.venue || targetEvent?.location || 'RTEC Campus',
      venueBn: targetEvent?.venueBn || targetEvent?.venue || 'আরটেক ক্যাম্পাস',
      token,
      attendeeEmail,
      attendeeName: attendeeInfo?.name || user?.name || 'RTEC Attendee',
      phone: attendeeInfo?.phone || user?.phone || '',
      batch: attendeeInfo?.batch || user?.batch || '',
      tshirt: attendeeInfo?.tshirt || 'L',
      guests: attendeeInfo?.guests || '0',
      registeredAt: new Date().toISOString()
    };

    setRegisteredEvents(prev => {
      const exists = prev.some(
        r => r.eventId === eventId && (!attendeeEmail || r.attendeeEmail === attendeeEmail)
      );
      if (exists) return prev;
      return [registrationRecord, ...prev];
    });
    setAllEventRegistrations(prev => [registrationRecord, ...prev]);
    syncEntityToMongo('/api/event-registrations', 'POST', registrationRecord);

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    return registrationRecord;
  };

  const deleteEventRegistration = (id) => {
    setAllEventRegistrations(prev => prev.filter(r => r.id !== id));
    setRegisteredEvents(prev => prev.filter(r => r.id !== id));
    syncEntityToMongo(`/api/event-registrations/${id}`, 'DELETE');
  };

  // ============================================
  // JOBS CRUD
  // ============================================
  const addJob = (jobData) => {
    const isMasterAdmin = user && user.role === 'admin';
    const newJob = {
      id: `job-${Date.now()}`,
      postedBy: user?.name ? `${user.name} (${user.batch || 'Alumni'})` : (jobData.postedBy || 'Alumni Member'),
      postedByEmail: user?.email || jobData.postedByEmail || '',
      postedByRole: user?.role || 'alumni',
      status: isMasterAdmin ? 'approved' : 'pending',
      isFeatured: false,
      postedAt: new Date().toISOString().split('T')[0],
      ...jobData
    };
    if (!isMasterAdmin && !jobData.status) {
      newJob.status = 'pending';
    }
    setJobs(prev => [newJob, ...prev]);
    syncEntityToMongo('/api/jobs', 'POST', newJob);
    confetti({ particleCount: 60, spread: 50 });
    return newJob;
  };

  const approveJob = (id) => {
    setJobs(prev => prev.map(j => (j.id === id ? { ...j, status: 'approved' } : j)));
    syncEntityToMongo('/api/jobs', 'POST', { id, status: 'approved' });
    confetti({ particleCount: 70, spread: 60 });
    return true;
  };

  const declineJob = (id) => {
    setJobs(prev => prev.map(j => (j.id === id ? { ...j, status: 'declined' } : j)));
    syncEntityToMongo('/api/jobs', 'POST', { id, status: 'declined' });
    return true;
  };

  const updateJob = (id, updatedData) => {
    setJobs(prev => prev.map(j => (j.id === id ? { ...j, ...updatedData } : j)));
    syncEntityToMongo('/api/jobs', 'POST', { id, ...updatedData });
  };

  const deleteJob = (id) => {
    setJobs(prev => prev.filter(j => j.id !== id));
    syncEntityToMongo(`/api/jobs/${id}`, 'DELETE');
  };

  // ============================================
  // NEWS CRUD
  // ============================================
  const addNews = (newsData) => {
    const newNotice = {
      id: `news-${Date.now()}`,
      date: new Date().toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' }),
      views: 1,
      image: '',
      ...newsData
    };
    setNews(prev => [newNotice, ...prev]);
    syncEntityToMongo('/api/news', 'POST', newNotice);
    return newNotice;
  };

  const updateNews = (id, updatedData) => {
    setNews(prev => prev.map(n => (n.id === id ? { ...n, ...updatedData } : n)));
    syncEntityToMongo('/api/news', 'POST', { id, ...updatedData });
  };

  const deleteNews = (id) => {
    setNews(prev => prev.filter(n => n.id !== id));
    syncEntityToMongo(`/api/news/${id}`, 'DELETE');
  };

  // ============================================
  // CAMPAIGNS CRUD & DONATE
  // ============================================
  const addCampaign = (campData) => {
    const newCamp = {
      id: `camp-${Date.now()}`,
      raised: 0,
      donorCount: 0,
      donors: [],
      image: '',
      ...campData
    };
    setCampaigns(prev => [newCamp, ...prev]);
    return newCamp;
  };

  const updateCampaign = (id, updatedData) => {
    setCampaigns(prev => prev.map(c => (c.id === id ? { ...c, ...updatedData } : c)));
  };

  const deleteCampaign = (id) => {
    setCampaigns(prev => prev.filter(c => c.id !== id));
  };

  const donateToCampaign = (campaignId, amount, donorName, method = 'bKash') => {
    setCampaigns(prev =>
      prev.map(camp => {
        if (camp.id === campaignId) {
          const numAmount = Number(amount);
          return {
            ...camp,
            raised: camp.raised + numAmount,
            donorCount: camp.donorCount + 1,
            donors: [
              {
                name: donorName || user.name,
                amount: numAmount,
                date: new Date().toISOString().split('T')[0],
                method
              },
              ...camp.donors
            ]
          };
        }
        return camp;
      })
    );
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.5 }
    });
  };

  // ============================================
  // FORUM & MEMORIES
  // ============================================
  const addForumPost = (title, body, category = 'Career Advice', tags = ['RTEC'], type = 'question', meta = {}) => {
    const nowLabel = lang === 'bn' ? 'এইমাত্র' : 'Just now';
    const autoApprove = isAdminEmail(user?.email);
    const newPost = {
      id: `frm-${Date.now()}`,
      title,
      titleBn: title,
      author: user?.name || 'RTEC Member',
      authorId: user?.id || `usr-${Date.now()}`,
      authorEmail: user?.email || '',
      avatar: sanitizeAvatar(user?.avatar) || '',
      authorRole: user?.role === 'alumni' ? 'Alumni Engineer' : (user?.role === 'admin' ? 'Administrator' : 'Student Engineer'),
      authorBatch: user?.batch || 'RTEC',
      type: type || 'question',
      status: autoApprove ? 'approved' : 'pending',
      reviewedAt: autoApprove ? nowLabel : '',
      category,
      categoryBn: category,
      date: nowLabel,
      upvotes: 1,
      repliesCount: 0,
      tags,
      body,
      content: body,
      targetAudience: meta.targetAudience || '',
      roleAndCompany: meta.roleAndCompany || '',
      keyTakeaways: meta.keyTakeaways || '',
      isEdited: false,
      replies: []
    };
    setForumPosts(prev => [newPost, ...prev]);
    syncEntityToMongo('/api/forum', 'POST', newPost);
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    return newPost;
  };

  const approveForumPost = (postId) => {
    const reviewedAt = new Date().toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US');
    setForumPosts(prev =>
      prev.map(p => (p.id === postId ? { ...p, status: 'approved', reviewedAt } : p))
    );
    syncEntityToMongo('/api/forum', 'POST', { id: postId, status: 'approved', reviewedAt });
    confetti({ particleCount: 60, spread: 60 });
    return true;
  };

  const declineForumPost = (postId) => {
    const reviewedAt = new Date().toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US');
    setForumPosts(prev =>
      prev.map(p => (p.id === postId ? { ...p, status: 'declined', reviewedAt } : p))
    );
    syncEntityToMongo('/api/forum', 'POST', { id: postId, status: 'declined', reviewedAt });
    return true;
  };

  const updateForumPost = (postId, updatedData) => {
    const editedLabel = lang === 'bn' ? 'আপডেটেড' : 'Updated';
    setForumPosts(prev =>
      prev.map(post => {
        if (post.id === postId) {
          const body = updatedData.body !== undefined ? updatedData.body : (updatedData.content !== undefined ? updatedData.content : (updatedData.description !== undefined ? updatedData.description : post.body));
          const updated = {
            ...post,
            ...updatedData,
            title: updatedData.title || post.title,
            titleBn: updatedData.titleBn || updatedData.title || post.titleBn,
            body,
            content: body,
            description: body,
            isEdited: true,
            updatedAt: editedLabel
          };
          syncEntityToMongo('/api/forum', 'POST', updated);
          return updated;
        }
        return post;
      })
    );
  };

  const deleteForumPost = (postId) => {
    setForumPosts(prev => prev.filter(post => post.id !== postId));
    syncEntityToMongo(`/api/forum/${postId}`, 'DELETE');
  };

  const addForumReply = (postId, replyText) => {
    const nowLabel = lang === 'bn' ? 'এইমাত্র' : 'Just now';
    const newReply = {
      id: `rpl-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      author: user?.name || 'RTEC Member',
      authorId: user?.id || `usr-${Date.now()}`,
      authorEmail: user?.email || '',
      role: user?.role === 'alumni' ? 'Alumni' : (user?.role === 'admin' ? 'Administrator' : 'Student'),
      avatar: sanitizeAvatar(user?.avatar) || '',
      date: nowLabel,
      content: replyText,
      isDeleted: false,
      isEdited: false
    };

    setForumPosts(prev =>
      prev.map(post => {
        if (post.id === postId) {
          const currentReplies = post.replies || [];
          const nextReplies = [...currentReplies, newReply];
          syncEntityToMongo('/api/forum', 'POST', {
            id: postId,
            repliesCount: nextReplies.length,
            replies: nextReplies
          });
          return {
            ...post,
            repliesCount: nextReplies.length,
            replies: nextReplies
          };
        }
        return post;
      })
    );
  };

  const updateForumReply = (postId, replyId, newContent) => {
    const editedLabel = lang === 'bn' ? 'আপডেটেড' : 'Updated';
    setForumPosts(prev =>
      prev.map(post => {
        if (post.id === postId) {
          const updatedReplies = (post.replies || []).map(reply => {
            if (reply.id === replyId) {
              return {
                ...reply,
                content: newContent,
                isEdited: true,
                updatedAt: editedLabel
              };
            }
            return reply;
          });
          syncEntityToMongo('/api/forum', 'POST', {
            id: postId,
            replies: updatedReplies
          });
          return {
            ...post,
            replies: updatedReplies
          };
        }
        return post;
      })
    );
  };

  const deleteForumReply = (postId, replyId) => {
    const nowLabel = lang === 'bn' ? 'এইমাত্র' : 'Just now';
    setForumPosts(prev =>
      prev.map(post => {
        if (post.id === postId) {
          const updatedReplies = (post.replies || []).map(reply => {
            if (reply.id === replyId) {
              return {
                ...reply,
                isDeleted: true,
                content: lang === 'bn' ? 'এই মন্তব্যটি মুছে ফেলা হয়েছে।' : 'This comment is deleted.',
                deletedAt: nowLabel
              };
            }
            return reply;
          });
          syncEntityToMongo('/api/forum', 'POST', {
            id: postId,
            replies: updatedReplies
          });
          return {
            ...post,
            replies: updatedReplies
          };
        }
        return post;
      })
    );
  };

  const upvoteForumPost = (postId) => {
    setForumPosts(prev =>
      prev.map(post => {
        if (post.id === postId) {
          const nextVotes = (post.upvotes || 0) + 1;
          syncEntityToMongo('/api/forum', 'POST', { id: postId, upvotes: nextVotes });
          return { ...post, upvotes: nextVotes };
        }
        return post;
      })
    );
  };

  const likeMemory = (id) => {
    setMemories(prev =>
      prev.map(mem => {
        if (mem.id === id) {
          const nextLikes = (mem.likes || 0) + 1;
          syncEntityToMongo('/api/memories', 'POST', { id, likes: nextLikes });
          return { ...mem, likes: nextLikes };
        }
        return mem;
      })
    );
  };

  const addMemory = (memoryData) => {
    const newMem = {
      id: `mem-${Date.now()}`,
      likes: 1,
      ...memoryData
    };
    setMemories([newMem, ...memories]);
    syncEntityToMongo('/api/memories', 'POST', newMem);
    confetti({ particleCount: 70, spread: 60 });
  };

  // ============================================
  // STUDENT SELF-INPUT SUBMISSIONS & ADMIN APPROVAL
  // ============================================
  const submitStudentProfile = (data) => {
    const formattedDate = new Date().toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    const formattedTime = new Date().toLocaleTimeString('bn-BD', {
      hour: '2-digit',
      minute: '2-digit'
    });

    const cleanEmail = (data.email || (user?.role !== 'guest' ? user?.email : '') || '').trim().toLowerCase();
    const cleanReg = (data.regNo || '').trim();
    const currentOwnerSubId = (data.id && (!user?.email || mySubmission?.id === data.id)) ? data.id : (mySubmission?.id || null);

    // 1. Strict guard: Block submission if this Registration No is already claimed/pending under a DIFFERENT email
    if (cleanReg) {
      const claimConflict = getRegNoClaimConflict(cleanReg, cleanEmail, currentOwnerSubId);
      if (claimConflict) {
        return { error: 'REGNO_CLAIMED', conflict: claimConflict };
      }
    }

    // 2. Strict guard: Block if email is already bound to a different Registration No
    if (cleanEmail) {
      const emailUsedInSub = studentSubmissions.some(
        s => s.id !== currentOwnerSubId &&
             s.status !== 'declined' &&
             s.email && s.email.trim().toLowerCase() === cleanEmail &&
             (!cleanReg || (s.regNo && s.regNo.trim().toLowerCase() !== cleanReg.toLowerCase()))
      );
      const emailUsedInDir = students.some(
        st => st.email && st.email.trim().toLowerCase() === cleanEmail &&
              (!cleanReg || !st.regNo || st.regNo.trim().toLowerCase() !== cleanReg.toLowerCase())
      );
      if (emailUsedInSub || emailUsedInDir) {
        return { error: 'EMAIL_TAKEN' };
      }
    }

    // 3. Only allow updating an existing submission if it belongs to THIS SAME email / user!
    const existingIndex = studentSubmissions.findIndex(
      s => (currentOwnerSubId && s.id === currentOwnerSubId && (!s.email || !cleanEmail || s.email.toLowerCase().trim() === cleanEmail)) ||
           (cleanEmail && s.email && s.email.toLowerCase().trim() === cleanEmail)
    );

    const composedJob =
      data.designation && data.company
        ? `${data.designation}, ${data.company}`
        : (data.currentJob || data.designation || data.company || '');
    const composedLocation = data.workLocation || data.currentLocation || '';

    let updatedOrNew;
    if (existingIndex >= 0) {
      const existing = studentSubmissions[existingIndex];
      updatedOrNew = {
        ...existing,
        ...data,
        currentJob: composedJob || existing.currentJob || '',
        currentLocation: composedLocation || existing.currentLocation || '',
        designation: data.designation !== undefined ? data.designation : (existing.designation || ''),
        company: data.company !== undefined ? data.company : (existing.company || ''),
        jobSector: data.jobSector !== undefined ? data.jobSector : (existing.jobSector || ''),
        workLocation: data.workLocation !== undefined ? data.workLocation : (existing.workLocation || ''),
        experienceYears: data.experienceYears !== undefined ? data.experienceYears : (existing.experienceYears || ''),
        linkedin: data.linkedin !== undefined ? data.linkedin : (existing.linkedin || ''),
        email: cleanEmail || existing.email || '',
        regNo: cleanReg || existing.regNo || '',
        id: existing.id,
        status: 'pending', // Re-enter pending verification on update
        submittedAt: `${formattedDate} ${formattedTime} ${lang === 'bn' ? '(আপডেটেড)' : '(Updated)'}`,
        reviewedAt: null,
        reviewNotes: ''
      };
      setStudentSubmissions(prev => {
        const next = [...prev];
        next[existingIndex] = updatedOrNew;
        return next;
      });
    } else {
      updatedOrNew = {
        id: `sub-${Date.now()}`,
        name: data.name || '',
        nameEn: data.nameEn || data.name || '',
        email: cleanEmail,
        phone: data.phone || '',
        regNo: cleanReg,
        batch: data.batch || '',
        department: data.department || '',
        deptBn: data.deptBn || '',
        currentJob: composedJob,
        designation: data.designation || '',
        company: data.company || '',
        jobSector: data.jobSector || '',
        workLocation: data.workLocation || '',
        experienceYears: data.experienceYears || '',
        linkedin: data.linkedin || '',
        currentLocation: composedLocation,
        bloodGroup: data.bloodGroup || '',
        avatar: sanitizeAvatar(data.avatar) || '',
        bio: data.bio || '',
        status: 'pending', // 'pending' | 'approved' | 'declined'
        submittedAt: `${formattedDate} ${formattedTime}`,
        reviewedAt: null,
        reviewNotes: ''
      };
      setStudentSubmissions(prev => [updatedOrNew, ...prev]);
    }

    // Persist ONLY this user's own tracking keys
    setMySubmissionId(updatedOrNew.id);
    localStorage.setItem('rtec_my_submission_id', updatedOrNew.id);
    if (updatedOrNew.email) localStorage.setItem('rtec_my_submission_email', updatedOrNew.email);
    if (updatedOrNew.regNo) localStorage.setItem('rtec_my_submission_reg', updatedOrNew.regNo);

    // If current user is not admin, update active user session metadata (NEVER overwrite public student directory until Admin approves!)
    if (user && user.role !== 'admin') {
      setUser(prev => ({
        ...prev,
        name: updatedOrNew.name || prev.name,
        nameBn: updatedOrNew.name || prev.nameBn,
        email: updatedOrNew.email || prev.email,
        regNo: updatedOrNew.regNo || prev.regNo,
        batch: updatedOrNew.batch || prev.batch,
        department: updatedOrNew.department || prev.department,
        submissionId: updatedOrNew.id,
        submissionStatus: 'pending'
      }));
    }

    confetti({ particleCount: 80, spread: 60 });
    syncEntityToMongo('/api/submissions', 'POST', updatedOrNew);
    return updatedOrNew;
  };

  const approveSubmission = (id, reviewNotes = '') => {
    const target = studentSubmissions.find(s => s.id === id);
    if (!target) return false;

    const defaultApproveNote = lang === 'bn' ? 'অ্যাডমিন কর্তৃক অনুমোদিত' : 'Approved by Admin';
    setStudentSubmissions(prev =>
      prev.map(s =>
        s.id === id
          ? {
              ...s,
              status: 'approved',
              reviewedAt: new Date().toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US'),
              reviewNotes: reviewNotes || defaultApproveNote
            }
          : s
      )
    );
    syncEntityToMongo('/api/submissions', 'POST', { id, status: 'approved', reviewNotes: reviewNotes || defaultApproveNote });

    // 2. Automatically promote/integrate into public directory
    const isAlumni =
      target.batch?.includes('1st') ||
      target.batch?.includes('2nd') ||
      target.batch?.includes('3rd') ||
      target.batch?.includes('4th') ||
      Boolean(target.company || target.designation) ||
      (target.currentJob && !target.currentJob.includes('শিক্ষার্থী') && !target.currentJob.includes('Student'));

    if (isAlumni) {
      const resolvedRole = target.designation || target.currentJob || 'Textile Engineer';
      const resolvedCompany = target.company || target.currentJob || 'Textile Sector';
      const resolvedLocation = target.workLocation || target.currentLocation || 'Bangladesh';
      const newAlum = {
        id: `alm-sub-${target.id}`,
        name: target.nameEn || target.name,
        nameBn: target.name,
        batch: target.batch,
        department: target.department,
        deptBn: target.deptBn,
        role: resolvedRole,
        designation: resolvedRole,
        company: resolvedCompany,
        jobSector: target.jobSector || '',
        workLocation: resolvedLocation,
        experienceYears: target.experienceYears || '',
        linkedin: target.linkedin || '',
        location: resolvedLocation,
        email: target.email,
        phone: target.phone,
        avatar: target.avatar,
        bio: target.bio,
        isVerified: true,
        regNo: target.regNo
      };
      setAlumni(prev => [newAlum, ...prev.filter(a => a.regNo !== target.regNo && a.email !== target.email)]);
      syncEntityToMongo('/api/alumni', 'POST', newAlum);

      // Keep student record in students directory & sync phone/email/bloodGroup
      setStudents(prev => prev.map(s => {
        if (s.regNo && target.regNo && s.regNo.trim().toLowerCase() === target.regNo.trim().toLowerCase()) {
          const updated = {
            ...s,
            phone: target.phone || s.phone,
            email: target.email || s.email,
            bloodGroup: target.bloodGroup || s.bloodGroup,
            avatar: target.avatar || s.avatar,
            address: target.address || s.address || target.currentLocation || '',
            currentJob: target.currentJob !== undefined ? target.currentJob : (s.currentJob || ''),
            currentLocation: target.currentLocation !== undefined ? target.currentLocation : (s.currentLocation || '')
          };
          syncEntityToMongo('/api/students', 'POST', updated);
          return updated;
        }
        return s;
      }));
    } else {
      const existingStd = students.find(
        s => s.regNo && target.regNo && s.regNo.trim().toLowerCase() === target.regNo.trim().toLowerCase()
      );
      if (existingStd) {
        const updatedStd = {
          ...existingStd,
          phone: target.phone || existingStd.phone,
          email: target.email || existingStd.email,
          bloodGroup: target.bloodGroup || existingStd.bloodGroup,
          avatar: target.avatar || existingStd.avatar,
          role: 'Verified Student Member',
          activities: target.bio || existingStd.activities || 'RTEC Student',
          address: target.address || existingStd.address || target.currentLocation || '',
          currentJob: target.currentJob !== undefined ? target.currentJob : (existingStd.currentJob || ''),
          currentLocation: target.currentLocation !== undefined ? target.currentLocation : (existingStd.currentLocation || '')
        };
        setStudents(prev =>
          prev.map(s =>
            s.regNo && target.regNo && s.regNo.trim().toLowerCase() === target.regNo.trim().toLowerCase()
              ? updatedStd
              : s
          )
        );
        syncEntityToMongo('/api/students', 'POST', updatedStd);
      } else {
        const newStd = {
          id: `std-sub-${target.id}`,
          serialNo: students.length + 1,
          name: target.nameEn || target.name,
          nameBn: target.name,
          regNo: target.regNo,
          batch: target.batch,
          department: target.department,
          deptBn: target.deptBn,
          studentType: 'Undergraduate',
          email: target.email,
          phone: target.phone,
          bloodGroup: target.bloodGroup || 'A+',
          avatar: target.avatar,
          role: 'Verified Student Member',
          activities: target.bio || 'RTEC Student',
          status: 'Regular',
          address: target.address || target.currentLocation || '',
          currentJob: target.currentJob,
          currentLocation: target.currentLocation
        };
        setStudents(prev => [...prev, newStd]);
        syncEntityToMongo('/api/students', 'POST', newStd);
      }
    }

    confetti({ particleCount: 90, spread: 70 });
    return true;
  };

  const declineSubmission = (id, reviewNotes = '') => {
    const defaultDeclineNote = lang === 'bn' ? 'তথ্য অসম্পূর্ণ বা যাচাইয়ে অমিল রয়েছে' : 'Incomplete information or verification mismatch';
    setStudentSubmissions(prev =>
      prev.map(s =>
        s.id === id
          ? {
              ...s,
              status: 'declined',
              reviewedAt: new Date().toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US'),
              reviewNotes: reviewNotes || defaultDeclineNote
            }
          : s
      )
    );
    syncEntityToMongo('/api/submissions', 'POST', { id, status: 'declined', reviewNotes: reviewNotes || defaultDeclineNote });
    return true;
  };

  const deleteSubmission = (id) => {
    setStudentSubmissions(prev => prev.filter(s => s.id !== id));
    syncEntityToMongo(`/api/submissions/${id}`, 'DELETE');
    if (mySubmissionId === id) {
      untrackSubmission();
    }
  };

  const trackSubmission = (idOrRegOrEmail, requesterEmail = '') => {
    if (!idOrRegOrEmail) return null;
    const query = idOrRegOrEmail.trim().toLowerCase();
    const matched = studentSubmissions.find(s =>
      s.id === query ||
      (s.regNo && s.regNo.trim().toLowerCase() === query) ||
      (s.email && s.email.trim().toLowerCase() === query) ||
      (s.phone && s.phone.trim() === query)
    );
    if (matched) {
      const cleanReqEmail = (requesterEmail || (user?.role !== 'guest' ? user?.email : '') || '').trim().toLowerCase();
      const matchedEmail = (matched.email || '').trim().toLowerCase();
      // Only attach tracking to this browser session if it belongs to the caller (never hijack another user's session!)
      if (!matchedEmail || (cleanReqEmail && matchedEmail === cleanReqEmail)) {
        setMySubmissionId(matched.id);
        localStorage.setItem('rtec_my_submission_id', matched.id);
        if (matched.email) localStorage.setItem('rtec_my_submission_email', matched.email);
        if (matched.regNo) localStorage.setItem('rtec_my_submission_reg', matched.regNo);
      }
      return matched;
    }
    return null;
  };

  const untrackSubmission = () => {
    setMySubmissionId('');
    localStorage.removeItem('rtec_my_submission_id');
    localStorage.removeItem('rtec_my_submission_email');
    localStorage.removeItem('rtec_my_submission_reg');
  };

  const loginWithGmail = (email, name = '', additional = {}) => {
    const userEmail = email.toLowerCase().trim();
    const isMasterAdmin = isAdminEmail(userEmail);
    if (isMasterAdmin && !additional.googleVerified) {
      return { error: 'ADMIN_GOOGLE_REQUIRED' };
    }

    // Always wipe any prior user's local submission tracking before binding the new Gmail
    untrackSubmission();

    const existingSub = studentSubmissions.find(s => s.email?.toLowerCase().trim() === userEmail);
    const verifiedStudent = students.find(s => s.email?.toLowerCase().trim() === userEmail);
    const verifiedAlumni = alumni.find(a => a.email?.toLowerCase().trim() === userEmail);
    if (existingSub) {
      setMySubmissionId(existingSub.id);
      localStorage.setItem('rtec_my_submission_id', existingSub.id);
      localStorage.setItem('rtec_my_submission_email', userEmail);
      if (existingSub.regNo) localStorage.setItem('rtec_my_submission_reg', existingSub.regNo);
    }

    const assignedRole = isMasterAdmin ? 'admin' : (verifiedAlumni ? 'alumni' : (additional.role || 'student'));

    const newUser = {
      id: `usr-${Date.now()}`,
      name: isMasterAdmin ? (name || 'RTEC Administrator') : (name || existingSub?.name || verifiedStudent?.name || verifiedAlumni?.name || 'RTEC Member'),
      nameBn: isMasterAdmin ? (name || 'সিস্টেম অ্যাডমিনিস্ট্রেটর') : (existingSub?.name || verifiedStudent?.nameBn || verifiedAlumni?.nameBn || name || 'আরটেক সদস্য'),
      role: assignedRole,
      email: userEmail,
      batch: existingSub?.batch || verifiedStudent?.batch || verifiedAlumni?.batch || additional.batch || '',
      department: existingSub?.department || verifiedStudent?.department || verifiedAlumni?.department || additional.department || '',
      company: isMasterAdmin ? 'College Administration' : (existingSub?.currentJob || verifiedAlumni?.company || 'Student at RTEC'),
      avatar: sanitizeAvatar(additional.avatar || existingSub?.avatar || verifiedStudent?.avatar || verifiedAlumni?.avatar) || '',
      isVerified: isMasterAdmin || Boolean(additional.googleVerified) || existingSub?.status === 'approved' || Boolean(verifiedStudent || verifiedAlumni),
      googleVerified: Boolean(additional.googleVerified),
      regNo: existingSub?.regNo || verifiedStudent?.regNo || verifiedAlumni?.regNo || '',
      phone: existingSub?.phone || verifiedStudent?.phone || verifiedAlumni?.phone || additional.phone || '',
      submissionStatus: existingSub?.status || (verifiedStudent ? 'approved' : 'none'),
      submissionId: existingSub?.id || null
    };
    setUser(newUser);
    syncUserToMongo(newUser);
    triggerAuthFeedback('login', newUser);
    return newUser;
  };

  // Update authenticated user's own profile (name, organization/role, phone, address, bio) across session & directory
  const updateOwnProfile = ({ name, company, phone, address, location, bio }) => {
    const cleanAddress = (address !== undefined ? address : location) || '';
    const cleanEmail = (user?.email || '').trim().toLowerCase();
    const cleanReg = (user?.regNo || mySubmission?.regNo || '').trim().toLowerCase();

    const updatedUser = {
      ...user,
      name: name !== undefined ? name : user?.name,
      company: company !== undefined ? company : user?.company,
      phone: phone !== undefined ? phone : user?.phone,
      address: cleanAddress,
      location: cleanAddress,
      bio: bio !== undefined ? bio : user?.bio
    };
    setUser(updatedUser);
    syncUserToMongo(updatedUser);

    if (cleanEmail) {
      setStudentSubmissions(prev => prev.map(s => {
        if (s.email && s.email.trim().toLowerCase() === cleanEmail) {
          const nextSub = {
            ...s,
            name: name || s.name,
            nameEn: name || s.nameEn,
            phone: phone !== undefined ? phone : s.phone,
            address: cleanAddress,
            currentLocation: cleanAddress || s.currentLocation,
            currentJob: company !== undefined ? company : s.currentJob,
            bio: bio !== undefined ? bio : s.bio
          };
          syncEntityToMongo('/api/submissions', 'POST', nextSub);
          return nextSub;
        }
        return s;
      }));

      setStudents(prev => prev.map(st => {
        const ownsByEmail = st.email && st.email.trim().toLowerCase() === cleanEmail;
        const ownsByReg = cleanReg && st.regNo && st.regNo.trim().toLowerCase() === cleanReg && (!st.email || st.email.trim().toLowerCase() === cleanEmail);
        if (ownsByEmail || ownsByReg) {
          const nextStd = {
            ...st,
            phone: phone !== undefined ? phone : st.phone,
            address: cleanAddress,
            currentLocation: cleanAddress || st.currentLocation,
            activities: bio !== undefined ? bio : st.activities
          };
          syncEntityToMongo('/api/students', 'POST', nextStd);
          return nextStd;
        }
        return st;
      }));

      setAlumni(prev => prev.map(al => {
        if (al.email && al.email.trim().toLowerCase() === cleanEmail) {
          const nextAl = {
            ...al,
            name: name || al.name,
            company: company !== undefined ? company : al.company,
            phone: phone !== undefined ? phone : al.phone,
            location: cleanAddress || al.location,
            address: cleanAddress,
            bio: bio !== undefined ? bio : al.bio
          };
          syncEntityToMongo('/api/alumni', 'POST', nextAl);
          return nextAl;
        }
        return al;
      }));
    }
  };

  // ============================================
  // ADMIN EMAILS AUTHORIZATION MANAGEMENT
  // ============================================
  const addAdminEmail = async (newEmail, note = 'Administrator') => {
    if (!newEmail || typeof newEmail !== 'string') {
      return { success: false, message: 'Please enter a valid Gmail address.' };
    }
    const clean = newEmail.toLowerCase().trim();
    if (!clean.includes('@')) {
      return { success: false, message: 'Invalid email address format.' };
    }
    if (adminEmails.some(e => e.toLowerCase().trim() === clean)) {
      return { success: false, message: 'This email is already an authorized admin.' };
    }
    const updated = [...adminEmails, clean];
    setAdminEmails(updated);
    localStorage.setItem('rtec_admin_emails', JSON.stringify(updated));
    syncEntityToMongo('/api/admin-emails', 'POST', {
      email: clean,
      addedBy: user?.email || 'megasonic298@gmail.com',
      note
    });
    return { success: true };
  };

  const removeAdminEmail = (emailToRemove) => {
    const clean = String(emailToRemove || '').toLowerCase().trim();
    if (SUPER_ADMIN_EMAILS.includes(clean)) {
      return false; // cannot delete primary super admins
    }
    const updated = adminEmails.filter(e => e.toLowerCase().trim() !== clean);
    setAdminEmails(updated);
    localStorage.setItem('rtec_admin_emails', JSON.stringify(updated));
    syncEntityToMongo(`/api/admin-emails/${encodeURIComponent(clean)}`, 'DELETE');
    return true;
  };

  // ============================================
  // ID DISPUTES & COMPLAINT SYSTEM
  // ============================================
  const submitDispute = (disputeData) => {
    const newDispute = {
      id: `disp-${Date.now()}`,
      regNo: String(disputeData.regNo || '').trim(),
      name: String(disputeData.name || '').trim(),
      email: String(disputeData.email || user?.email || '').trim().toLowerCase(),
      phone: String(disputeData.phone || '').trim(),
      description: String(disputeData.description || '').trim(),
      status: 'pending',
      actionTaken: '',
      createdAt: new Date().toISOString()
    };

    setDisputes(prev => [newDispute, ...prev]);
    syncEntityToMongo('/api/disputes', 'POST', newDispute);
    confetti({ particleCount: 60, spread: 60 });
    return newDispute;
  };

  const resolveDispute = (disputeId, actionNote = '') => {
    const defaultNote = lang === 'bn' ? 'অভিযোগ পর্যালোচনা করে সমাধান করা হয়েছে' : 'Reviewed and resolved by Administrator';
    const noteToUse = actionNote || defaultNote;
    setDisputes(prev =>
      prev.map(d =>
        d.id === disputeId
          ? { ...d, status: 'resolved', actionTaken: noteToUse, resolvedAt: new Date().toISOString() }
          : d
      )
    );
    syncEntityToMongo('/api/disputes', 'POST', {
      id: disputeId,
      status: 'resolved',
      actionTaken: noteToUse,
      resolvedAt: new Date()
    });
  };

  const deleteDispute = (disputeId) => {
    setDisputes(prev => prev.filter(d => d.id !== disputeId));
    syncEntityToMongo(`/api/disputes/${disputeId}`, 'DELETE');
  };

  const resetStudentClaim = async (regNo, disputeId = null) => {
    if (!regNo) return false;
    const cleanReg = String(regNo).trim();

    // 1. Remove from studentSubmissions
    setStudentSubmissions(prev =>
      prev.filter(s => String(s.regNo || '').trim().toLowerCase() !== cleanReg.toLowerCase())
    );

    // 2. Clear all user-claimed/edited fields from students record so it resets to Empty/Unclaimed/Unset
    setStudents(prev =>
      prev.map(s => {
        if (s.regNo && String(s.regNo).trim().toLowerCase() === cleanReg.toLowerCase()) {
          return {
            ...s,
            phone: '',
            email: '',
            avatar: '',
            bloodGroup: '',
            address: '',
            activities: '',
            currentJob: '',
            designation: '',
            company: '',
            jobSector: '',
            workLocation: '',
            experienceYears: '',
            linkedin: '',
            currentLocation: ''
          };
        }
        return s;
      })
    );

    // 3. Mark dispute resolved if disputeId given
    if (disputeId) {
      resolveDispute(
        disputeId,
        lang === 'bn'
          ? `রেজিস্ট্রেশন ${cleanReg}-এর ভুয়া ক্লেইম ও সাবমিশন সম্পূর্ণ মুছে দেওয়া হয়েছে`
          : `Disputed claim & submissions for Registration ${cleanReg} cleared and reset`
      );
    }

    // 4. Send request to server reset-reg endpoint
    syncEntityToMongo('/api/disputes/reset-reg', 'POST', { regNo: cleanReg, disputeId });

    return true;
  };

  // ============================================
  // CONTACT MESSAGES, MENTORSHIP REQUESTS, JOB APPLICATIONS
  // ============================================
  const submitContactMessage = (msgData) => {
    const item = {
      id: `cnt-${Date.now()}`,
      name: String(msgData.name || '').trim(),
      email: String(msgData.email || '').trim().toLowerCase(),
      phone: String(msgData.phone || '').trim(),
      subject: String(msgData.subject || 'General Inquiry').trim(),
      message: String(msgData.message || '').trim(),
      recipientName: msgData.recipientName || '',
      recipientId: msgData.recipientId || '',
      source: msgData.source || 'contact',
      status: 'unread',
      createdAt: new Date().toISOString()
    };
    setContactMessages(prev => [item, ...prev]);
    syncEntityToMongo('/api/contacts', 'POST', item);
    return item;
  };

  const updateContactStatus = (id, status = 'resolved') => {
    setContactMessages(prev => prev.map(m => (m.id === id ? { ...m, status } : m)));
    syncEntityToMongo('/api/contacts', 'POST', { id, status });
  };

  const deleteContactMessage = (id) => {
    setContactMessages(prev => prev.filter(m => m.id !== id));
    syncEntityToMongo(`/api/contacts/${id}`, 'DELETE');
  };

  const submitMentorshipRequest = (reqData) => {
    const item = {
      id: `mnt-${Date.now()}`,
      mentorId: reqData.mentorId || '',
      mentorName: reqData.mentorName || 'RTEC Mentor Desk',
      mentorEmail: reqData.mentorEmail || '',
      studentName: String(reqData.studentName || user?.name || '').trim(),
      studentEmail: String(reqData.studentEmail || user?.email || '').trim().toLowerCase(),
      studentBatch: reqData.studentBatch || user?.batch || '',
      topic: String(reqData.topic || '').trim(),
      details: String(reqData.details || '').trim(),
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    setMentorshipRequests(prev => [item, ...prev]);
    syncEntityToMongo('/api/mentorship', 'POST', item);
    confetti({ particleCount: 60, spread: 60 });
    return item;
  };

  const updateMentorshipRequestStatus = (id, status) => {
    setMentorshipRequests(prev => prev.map(m => (m.id === id ? { ...m, status } : m)));
    syncEntityToMongo('/api/mentorship', 'POST', { id, status });
  };

  const deleteMentorshipRequest = (id) => {
    setMentorshipRequests(prev => prev.filter(m => m.id !== id));
    syncEntityToMongo(`/api/mentorship/${id}`, 'DELETE');
  };

  const submitJobApplication = (appData) => {
    const item = {
      id: `app-${Date.now()}`,
      jobId: appData.jobId,
      jobTitle: appData.jobTitle || '',
      company: appData.company || '',
      applicantName: String(appData.applicantName || user?.name || '').trim(),
      applicantEmail: String(appData.applicantEmail || user?.email || '').trim().toLowerCase(),
      applicantBatch: String(appData.applicantBatch || '').trim(),
      cvLink: String(appData.cvLink || '').trim(),
      coverNote: String(appData.coverNote || '').trim(),
      status: 'submitted',
      appliedAt: new Date().toISOString()
    };
    setJobApplications(prev => [item, ...prev]);
    syncEntityToMongo('/api/job-applications', 'POST', item);
    confetti({ particleCount: 50, spread: 50 });
    return item;
  };

  const deleteJobApplication = (id) => {
    setJobApplications(prev => prev.filter(a => a.id !== id));
    syncEntityToMongo(`/api/job-applications/${id}`, 'DELETE');
  };

  // ============================================
  // RESET ALL SYSTEM DATA
  // ============================================
  const resetAllData = () => {
    localStorage.removeItem('rtec_teachers');
    localStorage.removeItem('rtec_students');
    localStorage.removeItem('rtec_alumni');
    localStorage.removeItem('rtec_events');
    localStorage.removeItem('rtec_jobs');
    localStorage.removeItem('rtec_campaigns');
    localStorage.removeItem('rtec_news');
    localStorage.removeItem('rtec_forum');
    localStorage.removeItem('rtec_memories');
    localStorage.removeItem('rtec_college_logo');
    localStorage.removeItem('rtec_student_submissions');
    localStorage.removeItem('rtec_my_submission_id');
    localStorage.removeItem('rtec_my_submission_email');
    localStorage.removeItem('rtec_my_submission_reg');

    setTeachers(INITIAL_TEACHERS);
    setStudents(INITIAL_STUDENTS);
    setAlumni(INITIAL_ALUMNI);
    setEvents(INITIAL_EVENTS);
    setJobs(INITIAL_JOBS);
    setCampaigns(INITIAL_CAMPAIGNS);
    setNews(INITIAL_NEWS);
    setForumPosts(INITIAL_FORUM_POSTS);
    setMemories(INITIAL_MEMORIES);
    setCollegeLogo('');
    setStudentSubmissions(INITIAL_STUDENT_SUBMISSIONS);
    setMySubmissionId('');
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        lang,
        setLang,
        // Theme
        theme,
        setTheme,
        toggleTheme,
        // College Logo & Branding
        collegeLogo,
        setCollegeLogo,
        updateCollegeLogo,
        resetCollegeLogo,
        // Footer & Official Contact Info (Admin Configurable)
        footerContact,
        setFooterContact,
        updateFooterContact,
        resetFooterContact,
        // Teachers
        teachers,
        setTeachers,
        addTeacher,
        updateTeacher,
        deleteTeacher,
        // Students
        students,
        setStudents,
        addStudent,
        updateStudent,
        deleteStudent,
        bulkImportStudents,
        syncStudentsToMongo,
        syncWithExcelFile,
        exportExcelFile,
        mongoStatus,
        checkMongoHealth,
        // Alumni
        alumni,
        setAlumni,
        addAlumni,
        updateAlumni,
        deleteAlumni,
        toggleVerifyAlumni,
        toggleMentorAlumni,
        // Events
        events,
        setEvents,
        addEvent,
        updateEvent,
        deleteEvent,
        registerForEvent,
        registeredEvents,
        allEventRegistrations,
        deleteEventRegistration,
        updateOwnProfile,
        // Jobs
        jobs,
        setJobs,
        addJob,
        approveJob,
        declineJob,
        updateJob,
        deleteJob,
        jobApplications,
        submitJobApplication,
        deleteJobApplication,
        // Campaigns
        campaigns,
        setCampaigns,
        addCampaign,
        updateCampaign,
        deleteCampaign,
        donateToCampaign,
        // News
        news,
        setNews,
        addNews,
        updateNews,
        deleteNews,
        // Forum & Memories
        forumPosts,
        setForumPosts,
        addForumPost,
        approveForumPost,
        declineForumPost,
        updateForumPost,
        deleteForumPost,
        addForumReply,
        updateForumReply,
        deleteForumReply,
        upvoteForumPost,
        memories,
        likeMemory,
        addMemory,
        // Student Submissions & Approvals
        studentSubmissions,
        setStudentSubmissions,
        mySubmissionId,
        setMySubmissionId,
        mySubmission,
        trackSubmission,
        untrackSubmission,
        submitStudentProfile,
        getRegNoClaimConflict,
        approveSubmission,
        declineSubmission,
        deleteSubmission,
        loginWithGmail,
        // ID Dispute & Complaint Management
        disputes,
        submitDispute,
        resolveDispute,
        deleteDispute,
        resetStudentClaim,
        // Inquiries & Mentorship
        contactMessages,
        submitContactMessage,
        updateContactStatus,
        deleteContactMessage,
        mentorshipRequests,
        submitMentorshipRequest,
        updateMentorshipRequestStatus,
        deleteMentorshipRequest,
        // Admin Authorization Management
        adminEmails,
        addAdminEmail,
        removeAdminEmail,
        isAdminEmail,
        googleClientId,
        updateGoogleClientId,
        apiBaseUrl,
        updateApiBaseUrl,
        bootstrapFromMongo,
        // Auth Popup Feedback
        authFeedback,
        dismissAuthFeedback,
        // System
        resetAllData
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
