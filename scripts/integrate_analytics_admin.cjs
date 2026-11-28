const fs = require('fs');
const path = require('path');

const adminPath = path.join(__dirname, '..', 'src', 'pages', 'Admin.jsx');
let content = fs.readFileSync(adminPath, 'utf8');

// 1. Update lucide-react imports to add Activity, Laptop, Smartphone, Tablet, BarChart3
if (!content.includes('Activity,')) {
  content = content.replace(
    "  Database\n} from 'lucide-react';",
    "  Database,\n  Activity,\n  Laptop,\n  Smartphone,\n  Tablet,\n  BarChart3\n} from 'lucide-react';"
  );
  console.log('1. Lucide icons added!');
} else {
  console.log('1. Lucide icons already present.');
}

// 2. Destructure apiFetch from useApp() if not already
if (!content.includes('apiFetch,') && content.includes('apiBaseUrl = \'\',')) {
  content = content.replace(
    "    apiBaseUrl = '',\n    updateApiBaseUrl,",
    "    apiBaseUrl = '',\n    updateApiBaseUrl,\n    apiFetch,"
  );
  console.log('2. apiFetch destructured from useApp()!');
} else {
  console.log('2. apiFetch check passed.');
}

// 3. Add Analytics states and fetch logic right after setActiveTab('overview')
const stateAnchor = "  const [activeTab, setActiveTab] = useState('overview');";
const stateAdditions = `  const [activeTab, setActiveTab] = useState('overview');

  // Visitor Analytics State (100% Non-blocking, admin-only)
  const [analyticsData, setAnalyticsData] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsError, setAnalyticsError] = useState('');
  const [analyticsFilter, setAnalyticsFilter] = useState('all');
  const [analyticsSearch, setAnalyticsSearch] = useState('');
  const [analyticsAutoRefresh, setAnalyticsAutoRefresh] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    if (!user || user.role !== 'admin' || !apiFetch) return;
    setAnalyticsLoading(true);
    setAnalyticsError('');
    try {
      const res = await apiFetch('/api/analytics/stats', {
        headers: {
          'x-admin-email': user?.email || ''
        }
      });
      const data = await res.json();
      if (data && data.success) {
        setAnalyticsData(data);
      } else {
        setAnalyticsError(data?.error || 'Failed to load visitor analytics');
      }
    } catch (err) {
      setAnalyticsError(err.message || 'Error fetching visitor analytics');
    } finally {
      setAnalyticsLoading(false);
    }
  }, [user, apiFetch]);

  useEffect(() => {
    if (activeTab === 'analytics' || activeTab === 'overview') {
      fetchAnalytics();
    }
  }, [activeTab, fetchAnalytics]);

  useEffect(() => {
    if (activeTab !== 'analytics' || !analyticsAutoRefresh) return;
    const interval = setInterval(() => {
      fetchAnalytics();
    }, 25000);
    return () => clearInterval(interval);
  }, [activeTab, analyticsAutoRefresh, fetchAnalytics]);

  const formatDuration = (seconds = 0) => {
    if (!seconds || seconds <= 0) return lang === 'bn' ? 'কয়েক সেকেন্ড' : '< 1m';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    if (m === 0) return \`\${s}s\`;
    return \`\${m}m \${s}s\`;
  };`;

if (!content.includes('// Visitor Analytics State')) {
  content = content.replace(stateAnchor, stateAdditions);
  console.log('3. Analytics state and fetch logic added!');
} else {
  console.log('3. Analytics state already present.');
}

// 4. Add Tab Navigation Entry right before settings
const tabSettingsAnchor = "{ id: 'settings', labelBn: 'সিস্টেম সেটিংস', labelEn: 'Settings', icon: RotateCcw, count: null }";
const tabAnalyticsEntry = `{
              id: 'analytics',
              labelBn: 'ভিজিটর অ্যানালিটিক্স',
              labelEn: 'Visitor Analytics',
              icon: Activity,
              count: (analyticsData?.stats?.activeNow > 0) ? \`🟢 \${analyticsData.stats.activeNow} Live\` : (analyticsData?.stats?.todayCount ? \`\${analyticsData.stats.todayCount} Today\` : null),
              isLive: Boolean(analyticsData?.stats?.activeNow > 0)
            },
            { id: 'settings', labelBn: 'সিস্টেম সেটিংস', labelEn: 'Settings', icon: RotateCcw, count: null }`;

if (!content.includes("id: 'analytics',")) {
  content = content.replace(tabSettingsAnchor, tabAnalyticsEntry);
  console.log('4. Tab navigation entry added!');
} else {
  console.log('4. Tab navigation entry already present.');
}

// 5. Update tab button count rendering to support isLive
const tabCountOld = `{tab.count !== null && (
                  <span className={\`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold \${
                    tab.isPending
                      ? (isActive ? 'bg-amber-400 text-slate-950 shadow' : 'bg-amber-500 text-slate-950 animate-pulse')
                      : (isActive ? 'bg-white/20 text-white font-bold' : 'bg-stone-200 dark:bg-[#201E1A] text-stone-800 dark:text-[#A89884]')
                  }\`}>`;

const tabCountNew = `{tab.count !== null && (
                  <span className={\`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold \${
                    tab.isLive
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse'
                      : tab.isPending
                      ? (isActive ? 'bg-amber-400 text-slate-950 shadow' : 'bg-amber-500 text-slate-950 animate-pulse')
                      : (isActive ? 'bg-white/20 text-white font-bold' : 'bg-stone-200 dark:bg-[#201E1A] text-stone-800 dark:text-[#A89884]')
                  }\`}>`;

if (content.includes(tabCountOld)) {
  content = content.replace(tabCountOld, tabCountNew);
  console.log('5. Tab count style updated!');
}

// 6. In Overview tab: Add live visitor shortcut card to Quick Actions Shortcuts
const shortcutAnchor = `{/* Quick Actions Shortcuts */}`;
const overviewVisitorCard = `{/* Live Visitor Stat Card in Overview */}
            <div 
              onClick={() => setActiveTab('analytics')}
              className="cursor-pointer plaque-elevated p-5 rounded-2xl border border-emerald-500/40 bg-gradient-to-r from-emerald-950/30 via-[#181715] to-[#181715] hover:border-emerald-400 transition group flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg mb-6"
            >
              <div className="flex items-center gap-3.5">
                <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 group-hover:scale-110 transition-transform">
                  <Activity className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-emerald-400">
                      {lang === 'bn' ? 'রিয়েলটাইম ভিজিটর ট্র্যাকিং' : 'LIVE VISITOR ANALYTICS'}
                    </span>
                  </div>
                  <h4 className="text-base sm:text-lg font-bold text-[#FDFBF7] mt-0.5">
                    {lang === 'bn' ? 'ওয়েবসাইটে এখন কতজন আছেন এবং কে কে আসলো' : 'Real-time Visitors, Duration & Member Activity'}
                  </h4>
                  <p className="text-xs text-[#A89884] font-sans mt-0.5">
                    {lang === 'bn'
                      ? \`বর্তমানে লাইভ আছেন: \${analyticsData?.stats?.activeNow ?? 0} জন • আজকের মোট সেশন: \${analyticsData?.stats?.todayCount ?? 0} জন\`
                      : \`Active Now: \${analyticsData?.stats?.activeNow ?? 0} online • Today: \${analyticsData?.stats?.todayCount ?? 0} sessions\`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow transition">
                  <span>{lang === 'bn' ? 'অ্যানালিটিক্স দেখুন →' : 'View Analytics →'}</span>
                </span>
              </div>
            </div>

            {/* Quick Actions Shortcuts */}`;

if (!content.includes('LIVE VISITOR ANALYTICS')) {
  content = content.replace(shortcutAnchor, overviewVisitorCard);
  console.log('6. Overview Live Visitor card added!');
} else {
  console.log('6. Overview card already present.');
}

// 7. Add activeTab === 'analytics' block right before </AnimatePresence> that closes tabs (around line 3565)
const closingAnimateAnchor = "</AnimatePresence>\n\n      </div>\n\n      {/* CREATE & EDIT MODAL */}";

const analyticsBlock = `          {/* TAB: VISITOR & USER ANALYTICS */}
          {activeTab === 'analytics' && (
            <motion.div
              key="tab-analytics"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Header with Title & Action Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#C5A880]/20">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      <Activity className="w-5 h-5 animate-pulse" />
                    </span>
                    <div>
                      <h3 className="text-xl font-bold font-serif-regal text-[#0C0A09] dark:text-[#FDFBF7]">
                        {lang === 'bn' ? 'ওয়েবসাইট ভিজিটর ও ইউজার ট্র্যাকিং' : 'Website Visitor & User Analytics'}
                      </h3>
                      <p className="text-xs text-[#57534E] dark:text-[#A89884] font-sans mt-0.5">
                        {lang === 'bn'
                          ? 'রিয়েলটাইম ভিজিটর, অবস্থান সময়, লগইন/গেস্ট অনুপাত ও বিস্তারিত এক্টিভিটি লগ (১০০% নন-ব্লকিং ও লাইটওয়েট)'
                          : 'Real-time visitors, duration, logged-in vs guest ratios, and full activity logs'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  {/* Live Auto-Refresh Toggle */}
                  <button
                    type="button"
                    onClick={() => setAnalyticsAutoRefresh(!analyticsAutoRefresh)}
                    className={\`px-3 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer \${
                      analyticsAutoRefresh
                        ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 border-emerald-400/50'
                        : 'bg-stone-100 dark:bg-[#1E1C18] text-[#57534E] dark:text-[#A89884] border-[#C5A880]/30'
                    }\`}
                    title={lang === 'bn' ? 'স্বয়ংক্রিয় রিফ্রেশ (২৫ সেকেন্ড পরপর)' : 'Auto-refresh every 25s'}
                  >
                    <span className={\`w-2 h-2 rounded-full \${analyticsAutoRefresh ? 'bg-emerald-500 animate-ping' : 'bg-stone-400'}\`} />
                    <span>{lang === 'bn' ? (analyticsAutoRefresh ? 'লাইভ অটো: চালু' : 'অটো রিফ্রেশ: বন্ধ') : (analyticsAutoRefresh ? 'Live Auto: ON' : 'Live Auto: OFF')}</span>
                  </button>

                  {/* Manual Refresh Button */}
                  <button
                    type="button"
                    onClick={fetchAnalytics}
                    disabled={analyticsLoading}
                    className="p-2 rounded-xl bg-white dark:bg-[#1E1C18] border border-[#C5A880]/40 text-[#854D0E] dark:text-[#DFCA9E] hover:border-[#854D0E] transition cursor-pointer shadow-sm disabled:opacity-50"
                    title={lang === 'bn' ? 'এখনই রিফ্রেশ করুন' : 'Refresh Now'}
                  >
                    <RefreshCw className={\`w-4 h-4 \${analyticsLoading ? 'animate-spin' : ''}\`} />
                  </button>
                </div>
              </div>

              {analyticsError && (
                <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-300 dark:border-rose-700/50 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{analyticsError}</span>
                </div>
              )}

              {/* 4 Core Metric KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. Active Now */}
                <div className="plaque-elevated p-5 rounded-2xl border border-emerald-500/40 bg-gradient-to-br from-emerald-950/20 to-teal-950/10 shadow-lg relative overflow-hidden">
                  <div className="flex items-center justify-between mb-2">
                    <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                      <span>{lang === 'bn' ? 'বর্তমানে আছেন' : 'ACTIVE NOW'}</span>
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                      Live
                    </span>
                  </div>
                  <h3 className="text-3xl sm:text-4xl font-black text-[#0C0A09] dark:text-[#FDFBF7] font-mono">
                    {analyticsData?.stats?.activeNow ?? 0}
                  </h3>
                  <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300 mt-1">
                    {lang === 'bn' ? 'লাইভ ভিজিটর সংখ্যা' : 'Current Active Visitors'}
                  </p>
                  <p className="text-[10px] text-[#57534E] dark:text-[#A89884] mt-0.5">
                    {lang === 'bn' ? 'গত ৫ মিনিটে পেইজ ব্রাউজ করছেন' : 'Active within last 5 minutes'}
                  </p>
                </div>

                {/* 2. Today's Total Visits */}
                <div className="plaque-elevated p-5 rounded-2xl border border-[#C5A880]/30 shadow-md">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-[#854D0E] dark:text-[#DFCA9E]">
                      {lang === 'bn' ? 'আজকের ভিজিট' : "TODAY'S VISITS"}
                    </span>
                    <Users className="w-4 h-4 text-[#854D0E] dark:text-[#DFCA9E]" />
                  </div>
                  <h3 className="text-3xl sm:text-4xl font-black text-[#0C0A09] dark:text-[#FDFBF7] font-mono">
                    {analyticsData?.stats?.todayCount ?? 0}
                  </h3>
                  <p className="text-xs font-bold text-[#374151] dark:text-[#DCD3C1] mt-1">
                    {lang === 'bn' ? 'গত ২৪ ঘণ্টায় মোট সেশন' : 'Total Sessions (24h)'}
                  </p>
                  <p className="text-[10px] text-[#57534E] dark:text-[#A89884] mt-0.5">
                    {lang === 'bn'
                      ? \`গত ৭ দিনে মোট: \${analyticsData?.stats?.weekCount ?? 0} জন\`
                      : \`7-Day Total: \${analyticsData?.stats?.weekCount ?? 0}\`}
                  </p>
                </div>

                {/* 3. Average Time Spent */}
                <div className="plaque-elevated p-5 rounded-2xl border border-[#C5A880]/30 shadow-md">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                      {lang === 'bn' ? 'গড় অবস্থান সময়' : 'AVG TIME ON SITE'}
                    </span>
                    <Clock className="w-4 h-4 text-amber-500" />
                  </div>
                  <h3 className="text-3xl sm:text-4xl font-black text-[#0C0A09] dark:text-[#FDFBF7] font-mono">
                    {formatDuration(analyticsData?.stats?.avgDurationSeconds ?? 0)}
                  </h3>
                  <p className="text-xs font-bold text-[#374151] dark:text-[#DCD3C1] mt-1">
                    {lang === 'bn' ? 'ভিজিটরদের গড় সময়কাল' : 'Average Session Duration'}
                  </p>
                  <p className="text-[10px] text-[#57534E] dark:text-[#A89884] mt-0.5">
                    {lang === 'bn' ? 'কতক্ষণ পর ভিজিটর বের হচ্ছেন' : 'Time before visitor exits'}
                  </p>
                </div>

                {/* 4. Logged-in vs Guest Breakdown Ratio */}
                <div className="plaque-elevated p-5 rounded-2xl border border-[#C5A880]/30 shadow-md">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-sky-600 dark:text-sky-400">
                      {lang === 'bn' ? 'লগইন বনাম গেস্ট' : 'LOGGED IN VS GUEST'}
                    </span>
                    <UserCheck className="w-4 h-4 text-sky-500" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-2xl sm:text-3xl font-black text-sky-600 dark:text-sky-400 font-mono">
                      {analyticsData?.stats?.loggedInCount ?? 0}
                    </h3>
                    <span className="text-xs font-mono text-[#57534E] dark:text-[#A89884]">
                      / {analyticsData?.stats?.guestCount ?? 0} {lang === 'bn' ? 'গেস্ট' : 'guests'}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-[#374151] dark:text-[#DCD3C1] mt-1">
                    {lang === 'bn' ? 'লগইন করা মেম্বার অনুপাত' : 'Member vs Guest Ratio'}
                  </p>
                  <div className="w-full h-2 rounded-full bg-stone-200 dark:bg-stone-800 mt-1.5 overflow-hidden flex">
                    {(() => {
                      const total = (analyticsData?.stats?.loggedInCount || 0) + (analyticsData?.stats?.guestCount || 0);
                      const loggedPct = total > 0 ? Math.round(((analyticsData?.stats?.loggedInCount || 0) / total) * 100) : 0;
                      return (
                        <>
                          <div style={{ width: \`\${loggedPct}%\` }} className="bg-sky-500 h-full" title={\`Logged in: \${loggedPct}%\`} />
                          <div style={{ width: \`\${100 - loggedPct}%\` }} className="bg-stone-400 dark:bg-stone-600 h-full" title={\`Guests: \${100 - loggedPct}%\`} />
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>

              {/* 2 Analytical Detailed Panels (Popular Pages & Device Ratios) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Popular Pages Visited */}
                <div className="plaque-elevated p-5 rounded-2xl border border-[#C5A880]/25 space-y-3">
                  <h4 className="text-sm font-bold text-[#0C0A09] dark:text-[#FDFBF7] flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-amber-500" />
                      <span>{lang === 'bn' ? 'সবচেয়ে বেশি ভিজিট হওয়া পেজসমূহ' : 'Most Visited Pages'}</span>
                    </span>
                    <span className="text-[10px] font-mono text-[#57534E] dark:text-[#A89884]">
                      {lang === 'bn' ? 'গত ৭ দিন' : 'Last 7 Days'}
                    </span>
                  </h4>

                  {(!analyticsData?.stats?.topPages || analyticsData.stats.topPages.length === 0) ? (
                    <p className="text-xs text-[#57534E] dark:text-[#A89884] py-4 text-center">
                      {lang === 'bn' ? 'এখনো কোনো ভিজিট রেকর্ড নেই' : 'No page records yet'}
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {analyticsData.stats.topPages.map((item, idx) => {
                        const total = analyticsData.stats.weekCount || 1;
                        const pct = Math.min(100, Math.round((item.count / total) * 100));
                        return (
                          <div key={idx} className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-mono font-bold text-[#0C0A09] dark:text-[#FDFBF7] truncate max-w-[200px]">
                                {item.page === '/' ? 'Home (/) ' : item.page}
                              </span>
                              <span className="text-[11px] font-mono text-[#57534E] dark:text-[#A89884]">
                                {item.count} {lang === 'bn' ? 'ভিজিট' : 'visits'} ({pct}%)
                              </span>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-stone-200 dark:bg-stone-800 overflow-hidden">
                              <div style={{ width: \`\${pct}%\` }} className="h-full bg-amber-500 rounded-full" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Device & Platform Breakdown */}
                <div className="plaque-elevated p-5 rounded-2xl border border-[#C5A880]/25 space-y-3">
                  <h4 className="text-sm font-bold text-[#0C0A09] dark:text-[#FDFBF7] flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-teal-500" />
                      <span>{lang === 'bn' ? 'ডিভাইস ও ব্রাউজার বিশ্লেষণ' : 'Device & Platform Insights'}</span>
                    </span>
                    <span className="text-[10px] font-mono text-[#57534E] dark:text-[#A89884]">
                      {lang === 'bn' ? 'মোবাইল বনাম ডেস্কটপ' : 'Mobile vs Desktop'}
                    </span>
                  </h4>

                  <div className="grid grid-cols-3 gap-3 pt-2">
                    {['Mobile', 'Desktop', 'Tablet'].map((dev) => {
                      const count = analyticsData?.stats?.devices?.find(d => d.device?.toLowerCase() === dev.toLowerCase())?.count || 0;
                      const total = analyticsData?.stats?.weekCount || 1;
                      const pct = Math.min(100, Math.round((count / total) * 100));
                      const IconComp = dev === 'Mobile' ? Smartphone : dev === 'Tablet' ? Tablet : Laptop;
                      return (
                        <div key={dev} className="p-3.5 rounded-xl bg-stone-50 dark:bg-[#1E1C18] border border-[#C5A880]/20 text-center">
                          <IconComp className="w-5 h-5 mx-auto mb-1 text-[#854D0E] dark:text-[#DFCA9E]" />
                          <p className="text-xs font-bold text-[#0C0A09] dark:text-[#FDFBF7]">{dev}</p>
                          <p className="text-base font-black font-mono mt-0.5 text-[#854D0E] dark:text-[#DFCA9E]">{pct}%</p>
                          <span className="text-[10px] text-[#57534E] dark:text-[#A89884] block">{count} {lang === 'bn' ? 'বার' : 'sessions'}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-300 dark:border-emerald-800/40 text-[11px] text-emerald-900 dark:text-emerald-200">
                    💡 <strong>{lang === 'bn' ? 'পারফরম্যান্স গ্যারান্টি:' : 'Performance Guarantee:'}</strong> {lang === 'bn' ? 'এই ট্র্যাকারটি কোনো বহিরাগত স্ক্রিপ্ট ছাড়াই ব্রাউজারের ব্যাকগ্রাউন্ড আইডল মোডে চলে। তাই ওয়েবসাইটের স্পিড ১০০% সর্বোচ্চ থাকে।' : 'Zero main-thread blocking; pings run asynchronously in background idle mode with no performance impact.'}
                  </div>
                </div>
              </div>

              {/* Detailed Realtime Visitor Activity Feed / Log */}
              <div className="plaque-elevated p-5 sm:p-6 rounded-2xl border border-[#C5A880]/25 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#C5A880]/20">
                  <div>
                    <h4 className="text-base font-bold font-serif-regal text-[#0C0A09] dark:text-[#FDFBF7]">
                      {lang === 'bn' ? 'কে কে আসলো-গেল: বিস্তারিত ভিজিটর হিস্টোরি' : 'Recent Visitor Activity Logs'}
                    </h4>
                    <p className="text-xs text-[#57534E] dark:text-[#A89884] mt-0.5 font-sans">
                      {lang === 'bn' ? 'সরাসরি দেখুন কে কোন পেইজ ভিজিট করেছেন এবং কতক্ষণ ছিলেন' : 'Live stream of visitor sessions, stay duration, and viewed pages'}
                    </p>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {[
                      { id: 'all', labelBn: 'সকল', labelEn: 'All' },
                      { id: 'live', labelBn: '🟢 লাইভ আছেন', labelEn: '🟢 Live Now' },
                      { id: 'loggedin', labelBn: 'লগইন সদস্য', labelEn: 'Logged In' },
                      { id: 'guest', labelBn: 'গেস্ট ভিজিটর', labelEn: 'Guests' }
                    ].map(f => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setAnalyticsFilter(f.id)}
                        className={\`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer \${
                          analyticsFilter === f.id
                            ? 'bg-[#854D0E] text-white dark:bg-[#C5A880] dark:text-[#121110] shadow'
                            : 'bg-white dark:bg-[#1E1C18] text-[#57534E] dark:text-[#A89884] border border-[#C5A880]/30 hover:border-[#854D0E]'
                        }\`}
                      >
                        {lang === 'bn' ? f.labelBn : f.labelEn}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Search Bar inside Activity Log */}
                <div className="relative">
                  <Search className="w-4 h-4 text-[#57534E] dark:text-[#A89884] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={analyticsSearch}
                    onChange={(e) => setAnalyticsSearch(e.target.value)}
                    placeholder={lang === 'bn' ? 'ভিজিটরের নাম, ইমেইল বা পেজ দিয়ে ফিল্টার করুন...' : 'Search visitor logs by name, email or page...'}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-[#1E1C18] border border-[#C5A880]/30 text-xs text-[#0C0A09] dark:text-[#FDFBF7] focus:outline-none focus:border-[#854D0E]"
                  />
                </div>

                {/* Visitors Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-[#C5A880]/20 text-[#57534E] dark:text-[#A89884] font-mono uppercase text-[10px]">
                        <th className="py-2.5 px-3">{lang === 'bn' ? 'ভিজিটর / ব্যবহারকারী' : 'Visitor / Member'}</th>
                        <th className="py-2.5 px-3">{lang === 'bn' ? 'ভিজিট করা পেজ' : 'Page Viewed'}</th>
                        <th className="py-2.5 px-3">{lang === 'bn' ? 'ডিভাইস ও ব্রাউজার' : 'Device & Browser'}</th>
                        <th className="py-2.5 px-3">{lang === 'bn' ? 'আগমনের সময়' : 'Start Time'}</th>
                        <th className="py-2.5 px-3">{lang === 'bn' ? 'অবস্থান সময়' : 'Duration'}</th>
                        <th className="py-2.5 px-3 text-right">{lang === 'bn' ? 'অবস্থা' : 'Status'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#C5A880]/15">
                      {(() => {
                        let filtered = analyticsData?.recentLogs || [];
                        if (analyticsFilter === 'live') {
                          filtered = filtered.filter(l => l.isLive);
                        } else if (analyticsFilter === 'loggedin') {
                          filtered = filtered.filter(l => l.isLoggedIn);
                        } else if (analyticsFilter === 'guest') {
                          filtered = filtered.filter(l => !l.isLoggedIn);
                        }

                        if (analyticsSearch.trim()) {
                          const q = analyticsSearch.toLowerCase();
                          filtered = filtered.filter(l =>
                            (l.userName && l.userName.toLowerCase().includes(q)) ||
                            (l.userEmail && l.userEmail.toLowerCase().includes(q)) ||
                            (l.page && l.page.toLowerCase().includes(q)) ||
                            (l.device && l.device.toLowerCase().includes(q))
                          );
                        }

                        if (filtered.length === 0) {
                          return (
                            <tr>
                              <td colSpan="6" className="py-8 text-center text-[#57534E] dark:text-[#A89884] text-xs">
                                {lang === 'bn' ? 'কোনো ভিজিটর রেকর্ড পাওয়া যায়নি' : 'No visitor activity records found.'}
                              </td>
                            </tr>
                          );
                        }

                        return filtered.map((log) => {
                          const isLive = log.isLive;
                          return (
                            <tr key={log.id || log.sessionId} className="hover:bg-stone-50/50 dark:hover:bg-[#1E1C18]/50 transition">
                              {/* Visitor info */}
                              <td className="py-3 px-3">
                                <div className="flex items-center gap-2.5">
                                  {log.isLoggedIn ? (
                                    <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold text-xs shrink-0 border border-amber-500/40">
                                      {log.userName ? log.userName.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                  ) : (
                                    <div className="w-8 h-8 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400 flex items-center justify-center text-xs shrink-0">
                                      👤
                                    </div>
                                  )}
                                  <div className="min-w-0">
                                    <p className="font-bold text-[#0C0A09] dark:text-[#FDFBF7] truncate max-w-[150px]">
                                      {log.userName || (lang === 'bn' ? 'গেস্ট ভিজিটর' : 'Guest Visitor')}
                                    </p>
                                    <p className="text-[10px] text-[#57534E] dark:text-[#A89884] font-mono truncate max-w-[150px]">
                                      {log.userEmail || \`ID: \${String(log.sessionId).slice(0, 8)}...\`}
                                    </p>
                                    {log.isLoggedIn && (
                                      <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded text-[9px] font-mono uppercase font-bold bg-amber-100 dark:bg-amber-950/50 text-amber-900 dark:text-amber-300">
                                        {log.userRole || 'Member'}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </td>

                              {/* Page viewed */}
                              <td className="py-3 px-3">
                                <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-stone-100 dark:bg-[#1E1C18] border border-[#C5A880]/30 text-[#0C0A09] dark:text-[#FDFBF7]">
                                  {log.page === '/' ? 'Home (/)' : log.page}
                                </span>
                              </td>

                              {/* Device & Browser */}
                              <td className="py-3 px-3">
                                <div className="flex items-center gap-1.5 text-xs text-[#374151] dark:text-[#DCD3C1]">
                                  {log.device === 'Mobile' ? (
                                    <Smartphone className="w-3.5 h-3.5 text-teal-500" />
                                  ) : log.device === 'Tablet' ? (
                                    <Tablet className="w-3.5 h-3.5 text-amber-500" />
                                  ) : (
                                    <Laptop className="w-3.5 h-3.5 text-sky-500" />
                                  )}
                                  <span className="font-medium">{log.device} • {log.browser}</span>
                                </div>
                              </td>

                              {/* Start Time */}
                              <td className="py-3 px-3 font-mono text-[11px] text-[#57534E] dark:text-[#A89884]">
                                {log.startTime ? new Date(log.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '—'}
                              </td>

                              {/* Duration Spent */}
                              <td className="py-3 px-3 font-mono font-bold text-xs text-[#0C0A09] dark:text-[#FDFBF7]">
                                {formatDuration(log.durationSeconds)}
                              </td>

                              {/* Status */}
                              <td className="py-3 px-3 text-right">
                                {isLive ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-400">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                                    <span>{lang === 'bn' ? 'অনলাইন' : 'Live'}</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono text-stone-600 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700">
                                    <span>{lang === 'bn' ? 'বের হয়েছেন' : 'Exited'}</span>
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        });
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

      </div>

      {/* CREATE & EDIT MODAL */}`;

if (!content.includes("key=\"tab-analytics\"")) {
  content = content.replace(closingAnimateAnchor, analyticsBlock);
  console.log('7. Tab analytics block added!');
} else {
  console.log('7. Tab analytics block already present.');
}

fs.writeFileSync(adminPath, content, 'utf8');
console.log('Admin.jsx successfully updated!');
