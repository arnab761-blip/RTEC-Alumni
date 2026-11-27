import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext.jsx';
import { useScrollLock } from '../utils/useScrollLock.js';
import { playSubmitSuccessSound } from '../utils/sound.js';
import GoogleSignInModal, { GoogleSignInButton } from '../components/GoogleSignInModal.jsx';
import {
  MessageSquare,
  MessageSquareQuote,
  ThumbsUp,
  MessageCircle,
  PlusCircle,
  Tag,
  Search,
  X,
  Send,
  User,
  Sparkles,
  Briefcase,
  GraduationCap,
  Building2,
  HelpCircle,
  Compass,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  Clock,
  CheckCircle2,
  AlertCircle,
  Lock,
  Award,
  Pencil,
  Trash2
} from 'lucide-react';
import UserAvatar from '../components/UserAvatar.jsx';

export default function Forum() {
  const {
    forumPosts,
    addForumPost,
    updateForumPost,
    deleteForumPost,
    addForumReply,
    updateForumReply,
    deleteForumReply,
    upvoteForumPost,
    user,
    lang,
    mySubmission,
    students = [],
    alumni = []
  } = useApp();

  const [selectedPost, setSelectedPost] = useState(null);
  const [newPostModalOpen, setNewPostModalOpen] = useState(false);
  const [approvalGateModalOpen, setApprovalGateModalOpen] = useState(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [pendingDesiredPostType, setPendingDesiredPostType] = useState('experience');
  const [replyTextMap, setReplyTextMap] = useState({});
  const [expandedReplies, setExpandedReplies] = useState({});
  const [activeCategory, setActiveCategory] = useState('All');
  const [typeFilter, setTypeFilter] = useState('all'); // 'all' | 'experience' | 'question'
  const [search, setSearch] = useState('');

  // Edit Post State
  const [editPostModalOpen, setEditPostModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editBody, setEditBody] = useState('');
  const [editCategory, setEditCategory] = useState('Career Advice');
  const [editTags, setEditTags] = useState('Career, Textile');
  const [editPostType, setEditPostType] = useState('question');
  const [editTargetAudience, setEditTargetAudience] = useState('Any Senior / Alumni');
  const [editRoleAndCompany, setEditRoleAndCompany] = useState('');
  const [editKeyTakeaways, setEditKeyTakeaways] = useState('');

  // Edit Reply State
  const [editingReplyId, setEditingReplyId] = useState(null);
  const [editingReplyText, setEditingReplyText] = useState('');

  // Toast feedback
  const [toast, setToast] = useState('');
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 4000);
  };

  // Lock body scroll when any modal is open
  useScrollLock(newPostModalOpen || approvalGateModalOpen || editPostModalOpen);

  // Listen for Escape key when modals are open
  useEffect(() => {
    if (!newPostModalOpen && !approvalGateModalOpen && !editPostModalOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setNewPostModalOpen(false);
        setApprovalGateModalOpen(false);
        setEditPostModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [newPostModalOpen, approvalGateModalOpen, editPostModalOpen]);

  // Strict gate: ONLY Admin, approved Students (Student Portal approved or in students list), or verified Alumni can post/reply.
  // Random Gmails without Student Portal approval, pending users, and guests can view only.
  const isPendingUser = Boolean(
    user?.submissionStatus === 'pending' ||
    mySubmission?.status === 'pending'
  );
  const userEmailLower = (user?.email || '').toLowerCase().trim();
  const hasApprovedRecord = Boolean(
    user?.role === 'admin' ||
    mySubmission?.status === 'approved' ||
    user?.submissionStatus === 'approved' ||
    (userEmailLower && students.some(s => s.email?.toLowerCase().trim() === userEmailLower)) ||
    (userEmailLower && alumni.some(a => a.email?.toLowerCase().trim() === userEmailLower && a.isVerified !== false)) ||
    (mySubmission?.email && alumni.some(a => a.email?.toLowerCase().trim() === mySubmission.email.toLowerCase().trim() && a.isVerified !== false))
  );
  const isApprovedToShareExperience = Boolean(
    user &&
    user.role &&
    user.role !== 'guest' &&
    !isPendingUser &&
    hasApprovedRecord
  );

  const handleOpenPostModal = (desiredType = 'experience') => {
    handleSwitchPostType(desiredType);
    if (isApprovedToShareExperience) {
      setNewPostModalOpen(true);
    } else {
      setPendingDesiredPostType(desiredType);
      setApprovalGateModalOpen(true);
    }
  };

  // Check author permissions
  const isPostAuthor = (post) => {
    if (!user || user.role === 'guest') return false;
    if (post.authorId && user.id && post.authorId === user.id) return true;
    if (post.authorEmail && user.email && post.authorEmail.toLowerCase() === user.email.toLowerCase()) return true;
    if (post.author && (post.author === user.name || post.author === user.nameBn)) return true;
    if (user.name && post.author && post.author.includes(user.name)) return true;
    return false;
  };

  const isReplyAuthor = (reply) => {
    if (!user || user.role === 'guest') return false;
    if (reply.authorId && user.id && reply.authorId === user.id) return true;
    if (reply.authorEmail && user.email && reply.authorEmail.toLowerCase() === user.email.toLowerCase()) return true;
    if (reply.author && (reply.author === user.name || reply.author === user.nameBn)) return true;
    if (user.name && reply.author && reply.author.includes(user.name)) return true;
    return false;
  };

  const isAdmin = user?.role === 'admin';

  // Post Actions
  const handleStartEditPost = (post) => {
    setEditingPost(post);
    setEditTitle(lang === 'bn' ? (post.titleBn || post.title || '') : (post.title || post.titleBn || ''));
    setEditBody(post.body || post.content || '');
    setEditCategory(post.category || 'Career Advice');
    setEditTags(Array.isArray(post.tags) ? post.tags.join(', ') : (post.tags || ''));
    setEditPostType(post.type || 'question');
    setEditTargetAudience(post.targetAudience || 'Any Senior / Alumni');
    setEditRoleAndCompany(post.roleAndCompany || '');
    setEditKeyTakeaways(post.keyTakeaways || '');
    setEditPostModalOpen(true);
  };

  const handleSaveEditPost = (e) => {
    e.preventDefault();
    if (!editingPost || !editTitle.trim() || !editBody.trim()) return;
    const tagArray = editTags.split(',').map(t => t.trim()).filter(Boolean);
    updateForumPost(editingPost.id, {
      title: editTitle,
      titleBn: editTitle,
      body: editBody,
      content: editBody,
      category: editCategory,
      categoryBn: getCategoryLabel(editCategory, 'bn'),
      tags: tagArray,
      type: editPostType,
      targetAudience: editPostType === 'question' ? editTargetAudience : '',
      roleAndCompany: editPostType === 'experience' ? editRoleAndCompany.trim() : '',
      keyTakeaways: editPostType === 'experience' ? editKeyTakeaways.trim() : ''
    });
    setEditPostModalOpen(false);
    setEditingPost(null);
    showToast(lang === 'bn' ? 'পোস্টটি সফলভাবে এডিট করা হয়েছে!' : 'Post updated successfully!');
  };

  const handleDeletePost = (postId) => {
    const confirmMsg = lang === 'bn'
      ? 'আপনি কি নিশ্চিত যে এই পোস্টটি মুছে ফেলতে চান? এটি স্থায়ীভাবে মুছে যাবে।'
      : 'Are you sure you want to delete this discussion thread? This cannot be undone.';
    if (window.confirm(confirmMsg)) {
      deleteForumPost(postId);
      showToast(lang === 'bn' ? 'পোস্টটি মুছে ফেলা হয়েছে।' : 'Post deleted successfully.');
    }
  };

  // Reply Actions
  const handleStartEditReply = (reply) => {
    setEditingReplyId(reply.id);
    setEditingReplyText(reply.content || '');
  };

  const handleSaveEditReply = (postId, replyId) => {
    if (!editingReplyText.trim()) return;
    updateForumReply(postId, replyId, editingReplyText);
    setEditingReplyId(null);
    setEditingReplyText('');
    showToast(lang === 'bn' ? 'মন্তব্যটি সফলভাবে এডিট করা হয়েছে!' : 'Comment updated successfully!');
  };

  const handleDeleteReply = (postId, replyId) => {
    const confirmMsg = lang === 'bn'
      ? 'এই মন্তব্যটি মুছে ফেলতে চান?'
      : 'Do you want to delete this comment?';
    if (window.confirm(confirmMsg)) {
      deleteForumReply(postId, replyId);
      showToast(lang === 'bn' ? 'মন্তব্যটি মুছে ফেলা হয়েছে (দিস কমেন্ট ইজ ডিলিটেড)।' : 'Comment marked as deleted.');
    }
  };

  // New post form (Tailored for Ask Question vs Share Experience)
  const [postType, setPostType] = useState('question'); // 'question' | 'experience'
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Career Advice');
  const [newBody, setNewBody] = useState('');
  const [newTags, setNewTags] = useState('Career, Textile');
  const [newTargetAudience, setNewTargetAudience] = useState('Any Senior / Alumni');
  const [newRoleAndCompany, setNewRoleAndCompany] = useState('');
  const [newKeyTakeaways, setNewKeyTakeaways] = useState('');

  const questionCategories = [
    { id: 'Career Advice', bn: 'ক্যারিয়ার পরামর্শ', en: 'Career Guidance' },
    { id: 'Academic & Lab', bn: 'একাডেমিক ও ল্যাব', en: 'Academic & Lab' },
    { id: 'Internship & Viva', bn: 'ইন্টার্নশিপ ও ভাইভা', en: 'Internship & Viva' },
    { id: 'Higher Studies', bn: 'বিদেশে উচ্চশিক্ষা', en: 'Higher Studies Abroad' },
    { id: 'Campus & Facilities', bn: 'ক্যাম্পাস ও সুযোগ-সুবিধা', en: 'Campus & Facilities' },
    { id: 'Others', bn: 'অন্যান্য (Others)', en: 'Others' }
  ];

  const experienceCategories = [
    { id: 'Industry Experience', bn: 'ইন্ডাস্ট্রি ও মিল লাইফ', en: 'Industry & Plant Life' },
    { id: 'Job & Interviews', bn: 'জব ও ইন্টারভিউ গল্প', en: 'Job & Interview Story' },
    { id: 'Higher Studies', bn: 'বিদেশে উচ্চশিক্ষা ও গবেষণা', en: 'Higher Studies & Research' },
    { id: 'Merchandising', bn: 'মার্চেন্ডাইজিং ও বায়িং হাউস', en: 'Merchandising & Buying House' },
    { id: 'Entrepreneurship', bn: 'উদ্যোক্তা ও স্টার্টআপ', en: 'Entrepreneurship & Startup' },
    { id: 'Others', bn: 'অন্যান্য (Others)', en: 'Others' }
  ];

  const audienceOptions = [
    { id: 'Any Senior / Alumni', bn: 'যেকোনো সিনিয়র / অ্যালামনাই', en: 'Any Senior / Alumni' },
    { id: '1st-3rd Batch Graduates', bn: '১ম–৩য় ব্যাচের গ্র্যাজুয়েটস', en: '1st–3rd Batch Graduates' },
    { id: 'Yarn Engineering Seniors', bn: 'ইয়ার্ন ইঞ্জিনিয়ারিং সিনিয়রস', en: 'Yarn Engineering Seniors' },
    { id: 'Fabric Engineering Seniors', bn: 'ফ্যাব্রিক ইঞ্জিনিয়ারিং সিনিয়রস', en: 'Fabric Engineering Seniors' },
    { id: 'Wet Process Seniors', bn: 'ওয়েট প্রসেস সিনিয়রস', en: 'Wet Process Seniors' },
    { id: 'Apparel Engineering Seniors', bn: 'অ্যাপারেল ইঞ্জিনিয়ারিং সিনিয়রস', en: 'Apparel Engineering Seniors' },
    { id: 'Others', bn: 'অন্যান্য (Others)', en: 'Others' }
  ];

  const categories = [
    { id: 'All', bn: 'সকল বিষয়', en: 'All Topics' },
    { id: 'Industry Experience', bn: 'ইন্ডাস্ট্রি ও মিল লাইফ', en: 'Industry & Plant Life' },
    { id: 'Job & Interviews', bn: 'জব ও ইন্টারভিউ', en: 'Job & Interviews' },
    { id: 'Higher Studies', bn: 'বিদেশে উচ্চশিক্ষা', en: 'Higher Studies Abroad' },
    { id: 'Career Advice', bn: 'ক্যারিয়ার পরামর্শ', en: 'Career Guidance' },
    { id: 'Academic & Lab', bn: 'একাডেমিক ও ল্যাব', en: 'Academic & Lab' },
    { id: 'Internship & Viva', bn: 'ইন্টার্নশিপ ও ভাইভা', en: 'Internship & Viva' },
    { id: 'Merchandising', bn: 'মার্চেন্ডাইজিং', en: 'Merchandising' },
    { id: 'Others', bn: 'অন্যান্য (Others)', en: 'Others' }
  ];

  const getCategoryLabel = (catId, targetLang = lang) => {
    const found = [...categories, ...questionCategories, ...experienceCategories].find(c => c.id === catId);
    if (found) return targetLang === 'bn' ? found.bn : found.en;
    return catId;
  };

  const getAudienceLabel = (audId) => {
    const found = audienceOptions.find(a => a.id === audId);
    if (found) return lang === 'bn' ? found.bn : found.en;
    return audId;
  };

  const handleSwitchPostType = (nextType) => {
    setPostType(nextType);
    if (nextType === 'question') {
      setNewCategory('Career Advice');
      setNewTags('Guidance, Internship, Career');
    } else {
      setNewCategory('Industry Experience');
      setNewTags('Industry, Journey, Advice');
    }
  };

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (!isApprovedToShareExperience) {
      setNewPostModalOpen(false);
      setApprovalGateModalOpen(true);
      return;
    }
    if (!newTitle.trim() || !newBody.trim()) return;
    const tagArray = newTags.split(',').map(t => t.trim()).filter(Boolean);
    const created = addForumPost(newTitle, newBody, newCategory, tagArray, postType, {
      targetAudience: postType === 'question' ? newTargetAudience : '',
      roleAndCompany: postType === 'experience' ? newRoleAndCompany.trim() : '',
      keyTakeaways: postType === 'experience' ? newKeyTakeaways.trim() : ''
    });
    setNewTitle('');
    setNewBody('');
    setNewRoleAndCompany('');
    setNewKeyTakeaways('');
    setNewPostModalOpen(false);
    playSubmitSuccessSound();
    if (created?.status === 'pending') {
      showToast(
        lang === 'bn'
          ? 'আপনার পোস্টটি জমা হয়েছে! অ্যাডমিনের অনুমোদনের (Approve) পর সবার সামনে প্রকাশিত হবে।'
          : 'Submitted! Your post is awaiting Admin approval before appearing in the public feed.'
      );
    } else {
      showToast(lang === 'bn' ? 'আপনার পোস্টটি সফলভাবে প্রকাশ করা হয়েছে!' : 'Your post has been published!');
    }
  };

  // Only approved Students, Alumni & Admin can reply/comment
  const handleReplySubmit = (e, postId) => {
    e.preventDefault();
    if (!isApprovedToShareExperience) {
      setApprovalGateModalOpen(true);
      return;
    }
    const text = replyTextMap[postId];
    if (!text || !text.trim()) return;
    addForumReply(postId, text);
    setReplyTextMap({ ...replyTextMap, [postId]: '' });
    showToast(lang === 'bn' ? 'আপনার উত্তর সফলভাবে যুক্ত হয়েছে!' : 'Reply added successfully!');
  };

  const toggleReplies = (postId) => {
    setExpandedReplies(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const filteredPosts = useMemo(() => forumPosts.filter(p => {
    if (!p) return false;
    const postStatus = p.status || 'approved';
    const canSee = postStatus === 'approved';
    if (!canSee) return false;
    const matchType = typeFilter === 'all' || (p.type || 'experience') === typeFilter;
    const matchCat = activeCategory === 'All' || p.category === activeCategory || p.categoryBn === activeCategory;
    const bodyText = p.body || p.content || p.description || '';
    const matchSearch =
      (p.title && p.title.toLowerCase().includes(search.toLowerCase())) ||
      (p.titleBn && p.titleBn.toLowerCase().includes(search.toLowerCase())) ||
      bodyText.toLowerCase().includes(search.toLowerCase()) ||
      (p.author && p.author.toLowerCase().includes(search.toLowerCase())) ||
      (p.tags && p.tags.some(t => t.toLowerCase().includes(search.toLowerCase())));
    return matchType && matchCat && matchSearch;
  }), [forumPosts, typeFilter, activeCategory, search, isAdmin, user?.email, user?.id]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-screen text-[#1C1917] dark:text-[#EDE8DF] py-8 sm:py-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Archival Header */}
        <div className="mb-8 pb-6 border-b border-[#C5A880]/20">
          <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono-tech text-[#57534E] dark:text-[#A89884] uppercase mb-2">
            <span className="text-[#BD452F] font-bold">
              {lang === 'bn' ? 'অভিজ্ঞতা ও প্রশ্নোত্তর' : 'ALUMNI INSIGHTS & Q&A'}
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif-regal font-black text-[#0C0A09] dark:text-[#FDFBF7] tracking-tight">
                {lang === 'bn' ? 'সিনিয়র অ্যালামনাইদের অভিজ্ঞতা ও ক্যারিয়ার গল্প' : 'Senior Alumni Insights & Experiences'}
              </h1>
              <p className="text-xs sm:text-sm text-[#44403C] dark:text-[#DCD3C1] mt-2 max-w-3xl font-sans leading-relaxed">
                {lang === 'bn'
                  ? 'টেক্সটাইল মিলের ফ্লোর ম্যানেজমেন্ট, আন্তর্জাতিক বায়িং হাউজে মার্চেন্ডাইজিং, ফ্রেশারদের জব ইন্টারভিউ এবং উচ্চশিক্ষায় স্কলারশিপ নিয়ে সিনিয়র প্রকৌশলীদের বাস্তব অভিজ্ঞতা ও দিকনির্দেশনা।'
                  : 'Real-world career stories, plant floor management wisdom, and higher studies guidance shared by senior RTEC alumni engineers.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                onClick={() => handleOpenPostModal('question')}
                className="btn-agency px-4 py-3 rounded-xl text-xs font-sans uppercase tracking-wider flex items-center gap-2 shadow-sm cursor-pointer font-bold"
              >
                <HelpCircle className="w-4 h-4 text-[#BD452F] dark:text-[#DFCA9E]" />
                <span>{lang === 'bn' ? 'প্রশ্ন করুন' : 'Ask Question'}</span>
              </button>
              <button
                onClick={() => handleOpenPostModal('experience')}
                className="btn-agency btn-agency-terracotta px-5 py-3 rounded-xl text-xs font-sans uppercase tracking-wider flex items-center gap-2 shadow-md cursor-pointer text-white font-bold"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{lang === 'bn' ? 'অভিজ্ঞতা শেয়ার করুন' : 'Share Experience'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Search & Topic Selector Bar */}
        <div className="plaque-elevated p-4 sm:p-6 rounded-2xl border border-[#C5A880]/30 mb-8 space-y-4 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A89884]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={lang === 'bn' ? 'টপিক, কোম্পানির নাম বা কীওয়ার্ড লিখুন...' : 'Search topics, companies or keywords...'}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FAF9F6] dark:bg-[#141311] border border-[#C5A880]/30 text-xs sm:text-sm text-[#0C0A09] dark:text-[#FDFBF7] placeholder-[#78716C] dark:placeholder-[#A89884]/60 focus:outline-none focus:border-[#C5A880] transition font-sans"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#78716C] dark:text-[#A89884] hover:text-[#0C0A09] dark:hover:text-[#EDE8DF]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <span className="text-xs font-mono-tech text-[#57534E] dark:text-[#A89884]">
              {lang === 'bn' ? 'মোট আলোচনা:' : 'TOTAL DISCUSSIONS:'}{' '}
              <strong className="text-[#854D0E] dark:text-[#DFCA9E] font-bold">{filteredPosts.length}</strong>
            </span>
          </div>

          {/* Post Type & Topic Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#C5A880]/15">
            {[
              { id: 'all', bn: 'সব পোস্ট', en: 'All' },
              { id: 'experience', bn: '⭐ অভিজ্ঞতা শেয়ার', en: '⭐ Experiences' },
              { id: 'question', bn: '❓ প্রশ্নোত্তর', en: '❓ Q&A' }
            ].map((tp) => (
              <button
                key={tp.id}
                onClick={() => setTypeFilter(tp.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono-tech transition cursor-pointer ${
                  typeFilter === tp.id
                    ? 'bg-[#BD452F] text-white font-bold shadow'
                    : 'bg-white dark:bg-[#181715] text-[#44403C] dark:text-[#A89884] border border-[#C5A880]/30 hover:border-[#BD452F]/50'
                }`}
              >
                {lang === 'bn' ? tp.bn : tp.en}
              </button>
            ))}
            <span className="text-[#C5A880]/40 mx-1 hidden sm:inline">|</span>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono-tech transition-all duration-200 hover:-translate-y-0.5 hover:scale-105 cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-[#C5A880] text-[#121110] font-bold shadow scale-110'
                    : 'bg-[#F4EFE6] dark:bg-[#141311] text-[#44403C] dark:text-[#A89884] hover:text-[#0C0A09] dark:hover:text-[#EDE8DF] border border-[#C5A880]/20'
                }`}
              >
                {lang === 'bn' ? cat.bn : cat.en}
              </button>
            ))}
          </div>
        </div>

        {/* Discussion / Senior Experience Feed */}
        <div className="space-y-6">
          {filteredPosts.map((post) => {
            const isRepliesOpen = expandedReplies[post.id];
            const replies = post.replies || [];

            return (
              <div
                key={post.id}
                className="plaque-elevated rounded-2xl p-6 sm:p-8 border border-[#C5A880]/30 hover:border-[#C5A880]/60 transition-all duration-200 hover:-translate-y-1 shadow-md space-y-4"
              >
                {/* Author Metadata Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#C5A880]/15 text-xs">
                  <div className="flex items-center gap-3">
                    <UserAvatar
                      src={post.avatar}
                      name={post.author}
                      role={post.authorRole?.toLowerCase()?.includes('alumni') ? 'alumni' : (post.authorRole?.toLowerCase()?.includes('admin') ? 'faculty' : 'student')}
                      className="w-10 h-10 rounded-xl border border-[#C5A880]/40 p-0.5 bg-[#FAF8F5] dark:bg-[#141311]"
                    />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-serif-regal font-bold text-sm text-[#0C0A09] dark:text-[#FDFBF7]">
                          {post.author}
                        </h4>
                        {post.isEdited && (
                          <span className="text-[10px] font-mono-tech text-[#854D0E] dark:text-[#DFCA9E] bg-[#F4EFE6] dark:bg-[#1A1916] px-1.5 py-0.5 rounded border border-[#C5A880]/20 font-bold">
                            {lang === 'bn' ? 'সম্পাদিত' : 'Edited'}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-[#854D0E] dark:text-[#DFCA9E] font-mono-tech font-bold">
                        {post.date}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Approval Status Indicator for Pending / Declined (visible to author or admin) */}
                    {post.status === 'pending' && (
                      <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-800 dark:text-amber-300 text-[10px] font-mono-tech font-bold border border-amber-500/40">
                        {lang === 'bn' ? '⏳ অ্যাডমিনের অনুমোদনের অপেক্ষায়' : '⏳ Pending Admin Approval'}
                      </span>
                    )}
                    {post.status === 'declined' && (
                      <span className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-700 dark:text-rose-300 text-[10px] font-mono-tech font-bold border border-rose-500/40">
                        {lang === 'bn' ? '✕ প্রত্যাখ্যাত' : '✕ Declined'}
                      </span>
                    )}

                    {/* Post Type Badge */}
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-mono-tech font-bold border ${
                      post.type === 'experience'
                        ? 'bg-[#BD452F]/15 text-[#BD452F] dark:text-[#DE644E] border-[#BD452F]/30'
                        : 'bg-[#C5A880]/15 text-[#854D0E] dark:text-[#DFCA9E] border-[#C5A880]/30'
                    }`}>
                      {post.type === 'experience'
                        ? (lang === 'bn' ? '⭐ অভিজ্ঞতা' : '⭐ Experience')
                        : (lang === 'bn' ? '❓ প্রশ্ন' : '❓ Question')}
                    </span>

                    <span className="px-2.5 py-1 rounded-lg bg-[#F4EFE6] dark:bg-[#141311] text-[#854D0E] dark:text-[#DFCA9E] text-[10px] font-mono-tech font-bold border border-[#C5A880]/25">
                      {getCategoryLabel(post.category)}
                    </span>

                    {post.type === 'question' && post.targetAudience && (
                      <span className="px-2.5 py-1 rounded-lg bg-sky-500/10 text-sky-700 dark:text-sky-300 text-[10px] font-mono-tech font-bold border border-sky-500/30">
                        {lang === 'bn' ? `উদ্দেশ্য: ${getAudienceLabel(post.targetAudience)}` : `For: ${getAudienceLabel(post.targetAudience)}`}
                      </span>
                    )}

                    {/* Author Edit & Delete buttons */}
                    {isPostAuthor(post) && (
                      <div className="flex items-center gap-1 ml-1">
                        <button
                          type="button"
                          onClick={() => handleStartEditPost(post)}
                          className="px-2 py-1 rounded-lg bg-[#F4EFE6] dark:bg-[#201E1A] hover:bg-[#EAE2D2] dark:hover:bg-[#2C2822] text-[#854D0E] dark:text-[#DFCA9E] border border-[#C5A880]/40 transition text-xs font-mono-tech font-bold flex items-center gap-1 shadow-sm cursor-pointer"
                          title={lang === 'bn' ? 'পোস্ট এডিট করুন' : 'Edit Post'}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          <span>{lang === 'bn' ? 'এডিট' : 'Edit'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeletePost(post.id)}
                          className="px-2 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-600 hover:text-white text-rose-600 dark:text-rose-400 border border-rose-300 dark:border-rose-800 transition text-xs font-mono-tech font-bold flex items-center gap-1 shadow-sm cursor-pointer"
                          title={lang === 'bn' ? 'পোস্ট ডিলিট করুন' : 'Delete Post'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>{lang === 'bn' ? 'ডিলিট' : 'Delete'}</span>
                        </button>
                      </div>
                    )}

                    {/* Admin Delete button (if not author) */}
                    {isAdmin && !isPostAuthor(post) && (
                      <button
                        type="button"
                        onClick={() => handleDeletePost(post.id)}
                        className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-600 hover:text-white text-rose-600 dark:text-rose-400 border border-rose-300 dark:border-rose-800 transition text-xs font-mono-tech font-bold flex items-center gap-1 shadow-sm cursor-pointer ml-1"
                        title={lang === 'bn' ? 'অ্যাডমিন কর্তৃক পোস্ট মুছে ফেলুন' : 'Admin Delete Post'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>{lang === 'bn' ? 'অ্যাডমিন ডিলিট' : 'Admin Delete'}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Title & Body */}
                <div className="space-y-2">
                  <h3 className="font-serif-regal font-bold text-lg sm:text-xl text-[#0C0A09] dark:text-[#FDFBF7] leading-snug">
                    {lang === 'bn' ? post.titleBn || post.title : post.title}
                  </h3>

                  {post.type === 'experience' && post.roleAndCompany && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold">
                      <Briefcase className="w-3.5 h-3.5 shrink-0" />
                      <span>{post.roleAndCompany}</span>
                    </div>
                  )}

                  <p className="text-xs sm:text-sm text-[#292524] dark:text-[#DCD3C1] font-sans leading-relaxed whitespace-pre-line">
                    {post.body || post.content || post.description}
                  </p>

                  {post.type === 'experience' && post.keyTakeaways && (
                    <div className="p-3 rounded-xl bg-amber-50 dark:bg-[#141311] border border-amber-300/60 dark:border-[#C5A880]/25 text-xs">
                      <span className="font-mono-tech font-bold text-[10px] uppercase text-amber-800 dark:text-[#DFCA9E] block mb-0.5">
                        {lang === 'bn' ? '★ মূল পরামর্শ ও শিক্ষা (Key Takeaways)' : '★ Key Takeaways for Juniors'}
                      </span>
                      <p className="text-[#1C1917] dark:text-[#EDE8DF] font-medium leading-relaxed">
                        {post.keyTakeaways}
                      </p>
                    </div>
                  )}
                </div>

                {/* Tags */}
                {post.tags && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {post.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2 py-0.5 rounded-md bg-[#F4EFE6] dark:bg-[#141311] text-[#57534E] dark:text-[#A89884] text-[10px] font-mono-tech font-medium border border-[#C5A880]/20"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Action Bar (Anyone can like and open replies) */}
                <div className="pt-3 border-t border-[#C5A880]/15 flex items-center justify-between text-xs font-mono-tech">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => upvoteForumPost(post.id)}
                      className="flex items-center gap-1.5 text-[#854D0E] dark:text-[#DFCA9E] hover:text-[#0C0A09] dark:hover:text-[#FDFBF7] transition font-bold cursor-pointer"
                      title={lang === 'bn' ? 'লাইক দিন' : 'Like'}
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span>{post.upvotes || 0}</span>
                    </button>

                    <button
                      onClick={() => toggleReplies(post.id)}
                      className="flex items-center gap-1.5 text-[#57534E] dark:text-[#A89884] hover:text-[#1C1917] dark:hover:text-[#EDE8DF] transition cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4 text-[#854D0E] dark:text-[#DFCA9E]" />
                      <span>
                        {replies.length} {lang === 'bn' ? 'পরামর্শ ও উত্তর' : 'Advice & Responses'}
                      </span>
                    </button>
                  </div>

                  <button
                    onClick={() => toggleReplies(post.id)}
                    className="text-[#854D0E] dark:text-[#DFCA9E] hover:underline flex items-center gap-1 text-[11px] font-bold cursor-pointer"
                  >
                    <span>{isRepliesOpen ? (lang === 'bn' ? 'উত্তর লুকান ▲' : 'Hide Answers ▲') : (lang === 'bn' ? 'উত্তর ও সিনিয়র পরামর্শ দেখুন ▼' : 'View Senior Advice ▼')}</span>
                  </button>
                </div>

                {/* Expanded Senior Answers Thread (Smooth 60fps Accordion) */}
                <AnimatePresence>
                  {isRepliesOpen && (
                    <motion.div
                      key={`replies-${post.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 border-t border-[#C5A880]/20 space-y-4">
                    <h5 className="text-[11px] font-mono-tech uppercase text-[#854D0E] dark:text-[#DFCA9E] tracking-wider font-bold">
                      {lang === 'bn' ? '— সিনিয়র প্রকৌশলীদের মূল্যবান পরামর্শ ও মন্তব্য' : '— SENIOR ALUMNI ADVICE & COMMENTS'}
                    </h5>

                    <div className="space-y-3">
                      {replies.map((reply, rIdx) => {
                        const isRepAuthor = isReplyAuthor(reply);

                        // 1. Deleted reply placeholder state
                        if (reply.isDeleted) {
                          return (
                            <div
                              key={reply.id || rIdx}
                              className="p-3.5 rounded-xl bg-[#F4EFE6] dark:bg-[#141311] border border-[#C5A880]/30 text-[#57534E] dark:text-[#A89884] italic text-xs flex items-center justify-between gap-3 shadow-sm"
                            >
                              <div className="flex items-center gap-2">
                                <Trash2 className="w-3.5 h-3.5 text-[#BD452F] shrink-0" />
                                <span className="font-sans font-medium text-[#78350F] dark:text-[#DFCA9E]">
                                  {lang === 'bn' ? 'দিস কমেন্ট ইজ ডিলিটেড (এই মন্তব্যটি মুছে ফেলা হয়েছে)' : 'This comment is deleted.'}
                                </span>
                              </div>
                              <span className="text-[10px] font-mono-tech not-italic text-[#78716C] dark:text-[#A89884]">
                                {reply.deletedAt || (lang === 'bn' ? 'মুছে ফেলা হয়েছে' : 'Deleted')}
                              </span>
                            </div>
                          );
                        }

                        // 2. Active reply in edit mode
                        if (editingReplyId === reply.id) {
                          return (
                            <div
                              key={reply.id || rIdx}
                              className="p-4 rounded-xl bg-white dark:bg-[#1A1916] border-2 border-[#C5A880] space-y-3 shadow-md"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-mono-tech font-bold text-[#854D0E] dark:text-[#DFCA9E]">
                                  {lang === 'bn' ? 'মন্তব্য সম্পাদনা করুন:' : 'Edit Your Comment:'}
                                </span>
                              </div>
                              <textarea
                                rows="2"
                                value={editingReplyText}
                                onChange={(e) => setEditingReplyText(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl bg-[#FAF9F6] dark:bg-[#141311] border border-[#C5A880]/40 text-xs text-[#0C0A09] dark:text-[#FDFBF7] focus:outline-none focus:border-[#C5A880]"
                              />
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingReplyId(null);
                                    setEditingReplyText('');
                                  }}
                                  className="px-3 py-1.5 rounded-lg bg-[#F4EFE6] dark:bg-[#1E1C18] border border-[#C5A880]/30 text-xs font-mono-tech font-bold text-[#57534E] dark:text-[#A89884] hover:text-[#0C0A09] dark:hover:text-[#EDE8DF] cursor-pointer"
                                >
                                  {lang === 'bn' ? 'বাতিল' : 'Cancel'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleSaveEditReply(post.id, reply.id)}
                                  className="px-3.5 py-1.5 rounded-lg bg-[#059669] hover:bg-[#047857] text-white text-xs font-mono-tech font-bold shadow cursor-pointer"
                                >
                                  {lang === 'bn' ? 'সংরক্ষণ করুন' : 'Save Changes'}
                                </button>
                              </div>
                            </div>
                          );
                        }

                        // 3. Normal active reply
                        return (
                          <div
                            key={reply.id || rIdx}
                            className="p-4 rounded-xl bg-[#F8F5EE] dark:bg-[#141311] border border-[#C5A880]/25 space-y-2 relative shadow-sm"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-center gap-2.5">
                                <UserAvatar
                                  src={reply.avatar}
                                  name={reply.author}
                                  role={reply.role?.toLowerCase()?.includes('alumni') ? 'alumni' : (reply.role?.toLowerCase()?.includes('admin') ? 'faculty' : 'student')}
                                  className="w-8 h-8 rounded-lg border border-[#C5A880]/30 p-0.5 bg-[#FAF8F5] dark:bg-[#121110]"
                                />
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <h6 className="font-serif-regal font-bold text-xs text-[#0C0A09] dark:text-[#FDFBF7]">
                                      {reply.author}
                                    </h6>
                                    {reply.isEdited && (
                                      <span className="text-[9px] font-mono-tech text-[#854D0E] dark:text-[#DFCA9E] font-bold">
                                        ({lang === 'bn' ? 'সম্পাদিত' : 'Edited'})
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[10px] text-[#854D0E] dark:text-[#DFCA9E] font-mono-tech font-bold">
                                    {reply.role}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className="text-[9px] font-mono-tech text-[#78716C] dark:text-[#A89884]">
                                  {reply.date}
                                </span>

                                {/* Reply Author Edit & Delete */}
                                {isRepAuthor && (
                                  <div className="flex items-center gap-1 ml-1">
                                    <button
                                      type="button"
                                      onClick={() => handleStartEditReply(reply)}
                                      className="p-1 rounded bg-white dark:bg-[#1E1C18] border border-[#C5A880]/30 text-[#854D0E] dark:text-[#DFCA9E] hover:text-[#0C0A09] dark:hover:text-white transition shadow-xs cursor-pointer"
                                      title={lang === 'bn' ? 'মন্তব্য এডিট করুন' : 'Edit Comment'}
                                    >
                                      <Pencil className="w-3 h-3" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteReply(post.id, reply.id)}
                                      className="p-1 rounded bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 hover:bg-rose-600 hover:text-white transition shadow-xs cursor-pointer"
                                      title={lang === 'bn' ? 'মন্তব্য ডিলিট করুন' : 'Delete Comment'}
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                )}

                                {/* Admin Delete on Reply (if not reply author) */}
                                {isAdmin && !isRepAuthor && (
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteReply(post.id, reply.id)}
                                    className="p-1 px-1.5 rounded bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 hover:bg-rose-600 hover:text-white transition text-[9px] font-mono-tech font-bold flex items-center gap-1 cursor-pointer ml-1"
                                    title={lang === 'bn' ? 'অ্যাডমিন কর্তৃক মন্তব্য মুছে ফেলুন' : 'Admin Delete Comment'}
                                  >
                                    <Trash2 className="w-3 h-3" />
                                    <span>{lang === 'bn' ? 'ডিলিট' : 'Delete'}</span>
                                  </button>
                                )}
                              </div>
                            </div>

                            <p className="text-xs text-[#1C1917] dark:text-[#DCD3C1] font-sans leading-relaxed pt-1 pl-10 whitespace-pre-line">
                              {reply.content}
                            </p>
                          </div>
                        );
                      })}
                    </div>

                    {/* Inline Reply Form (Only for approved Students, Alumni & Admin) */}
                    {isApprovedToShareExperience ? (
                      <form onSubmit={(e) => handleReplySubmit(e, post.id)} className="flex items-center gap-2 pt-2">
                        <input
                          type="text"
                          value={replyTextMap[post.id] || ''}
                          onChange={(e) => setReplyTextMap({ ...replyTextMap, [post.id]: e.target.value })}
                          placeholder={lang === 'bn' ? 'আপনার অভিজ্ঞতা বা পাল্টা প্রশ্ন লিখুন...' : 'Write your response or follow-up question...'}
                          className="flex-1 px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#141311] border border-[#C5A880]/30 text-xs text-[#0C0A09] dark:text-[#FDFBF7] placeholder-[#78716C] dark:placeholder-[#A89884]/60 focus:outline-none focus:border-[#C5A880] font-sans shadow-sm"
                        />
                        <button
                          type="submit"
                          className="btn-agency btn-agency-terracotta px-4 py-2.5 rounded-xl text-xs uppercase font-sans tracking-wider shrink-0 flex items-center gap-1.5 cursor-pointer text-white font-bold"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>{lang === 'bn' ? 'পাঠান' : 'Reply'}</span>
                        </button>
                      </form>
                    ) : (
                      <div className="pt-2 text-[11px] text-[#57534E] dark:text-[#A89884] italic flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                        <span>
                          {lang === 'bn'
                            ? 'শুধুমাত্র অনুমোদিত শিক্ষার্থী ও অ্যালামনাইরা উত্তর বা মন্তব্য করতে পারবেন। পেন্ডিং বা গেস্ট ইউজাররা কেবল পড়তে পারবেন।'
                            : 'Only approved Students & Alumni can reply. Pending or guest users can view only.'}
                        </span>
                      </div>
                    )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            );
          })}
        </div>

        {/* Empty state */}
        {filteredPosts.length === 0 && (
          <div className="plaque-elevated p-10 sm:p-14 rounded-3xl text-center max-w-lg mx-auto my-10 border border-[#C5A880]/30 shadow-md space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#BD452F]/10 text-[#BD452F] flex items-center justify-center mx-auto border border-[#BD452F]/20">
              <MessageSquareQuote className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-serif-regal font-bold text-lg text-[#0C0A09] dark:text-[#FDFBF7]">
                {forumPosts.length === 0
                  ? (lang === 'bn' ? 'অভিজ্ঞতা ফোরাম উন্মুক্ত — প্রথম আলোচনা শুরু করুন' : 'Alumni Forum is Live — Start the First Discussion')
                  : (lang === 'bn' ? 'কোনো প্রশ্নোত্তর বা গল্প পাওয়া যায়নি' : 'No Discussions Found')}
              </h3>
              <p className="text-xs text-[#57534E] dark:text-[#A89884] mt-2 font-sans max-w-md mx-auto leading-relaxed">
                {forumPosts.length === 0
                  ? (lang === 'bn'
                      ? 'ডামি আলোচনা ও ডেমো পোস্টসমূহ রিমুভ করা হয়েছে। সিনিয়র অ্যালামনাই ও বর্তমান শিক্ষার্থীরা তাদের টেক্সটাইল মিলের বাস্তব অভিজ্ঞতা, ইন্টারভিউ টিপস ও উচ্চশিক্ষার গল্প এখানে শেয়ার করতে পারেন।'
                      : 'All demo discussions have been cleared. Verified senior alumni and students are welcome to share genuine career insights, plant floor learnings, and higher studies experiences.')
                  : (lang === 'bn' ? 'অনুসন্ধান বা নির্বাচিত ক্যাটাগরি পরিবর্তন করে পুনরায় চেষ্টা করুন।' : 'Try searching different keywords or resetting categories.')}
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={handleOpenPostModal}
                className="btn-agency btn-agency-terracotta px-5 py-2.5 rounded-xl text-xs font-sans uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer text-white font-bold"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{lang === 'bn' ? 'প্রথম অভিজ্ঞতা বা গল্প শেয়ার করুন' : 'Share First Story / Question'}</span>
              </button>
            </div>
          </div>
        )}

      </div>

      {/* ========================================================
          APPROVAL GATE MODAL (When student clicks "অভিজ্ঞতা শেয়ার করুন" but is unapproved)
          ======================================================== */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {approvalGateModalOpen && (
            <motion.div
              key="forum-approval-gate-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto overscroll-contain"
              onClick={(e) => {
                if (e.target === e.currentTarget) setApprovalGateModalOpen(false);
              }}
            >
              <motion.div
                key="forum-approval-gate-card"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-lg rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1a1916] border border-[#C5A880]/40 relative shadow-2xl my-auto overscroll-contain text-[#1C1917] dark:text-[#EDE8DF] space-y-5"
                onClick={(e) => e.stopPropagation()}
              >
            <button
              onClick={() => setApprovalGateModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-[#F4EFE6] dark:bg-[#141311] border border-[#C5A880]/30 text-[#44403C] dark:text-[#A89884] hover:text-[#0C0A09] dark:hover:text-[#EDE8DF] transition cursor-pointer"
              aria-label={lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
            >
              <X className="w-4 h-4" />
            </button>

            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-[10px] font-mono-tech uppercase font-bold tracking-wider">
              <Lock className="w-3 h-3 text-amber-500" />
              <span>{lang === 'bn' ? 'অনুমোদন ও ভেরিফিকেশন প্রয়োজন' : 'VERIFICATION REQUIRED'}</span>
            </div>

            {/* Modal Heading */}
            <div>
              <h3 className="font-serif-regal font-black text-xl sm:text-2xl text-[#0C0A09] dark:text-[#FDFBF7]">
                {isPendingUser
                  ? (lang === 'bn' ? 'অ্যাকাউন্ট অনুমোদনের অপেক্ষায় রয়েছে' : 'Account Pending Admin Approval')
                  : (user && user.role !== 'guest'
                      ? (lang === 'bn' ? 'স্টুডেন্ট পোর্টালে আইডি ভেরিফাই করুন' : 'Verify ID in Student Portal')
                      : (lang === 'bn' ? 'প্রশ্ন বা অভিজ্ঞতা পোস্ট করতে লগইন করুন' : 'Sign In to Ask or Share'))}
              </h3>
              <p className="text-xs text-[#57534E] dark:text-[#A89884] mt-1 font-sans leading-relaxed">
                {isPendingUser
                  ? (lang === 'bn'
                      ? 'আপনার অ্যাকাউন্টটি এখনো অ্যাডমিন অনুমোদনের (Pending Approval) অপেক্ষায় আছে। অনুমোদন না পাওয়া পর্যন্ত আপনি কেবল সব পোস্ট দেখতে পারবেন; কোনো প্রশ্ন, অভিজ্ঞতা বা মন্তব্য পোস্ট করতে পারবেন না।'
                      : 'Your account is currently awaiting Admin approval. Until approved, you can view all posts and discussions, but cannot post questions, experiences, or replies.')
                  : (user && user.role !== 'guest'
                      ? (lang === 'bn'
                          ? 'আপনি লগইন করেছেন, তবে স্টুডেন্ট পোর্টাল থেকে ফর্ম পূরণ করে অ্যাডমিন অ্যাপ্রুভাল না পাওয়া পর্যন্ত পোস্ট করতে পারবেন না। অনুমোদনের আগে আপনি শুধু সবকিছু দেখতে পারবেন।'
                          : 'You are signed in, but you must submit your ID in the Student Portal and receive Admin approval before posting. You can view everything in the meantime.')
                      : (lang === 'bn'
                          ? 'লগইন ছাড়া বা পেন্ডিং ইউজাররা কোনো পোস্ট করতে পারবেন না—তারা শুধু সবকিছু দেখতে পারবেন। অনুমোদিত শিক্ষার্থী (Student) এবং অ্যালামনাইরাই কেবল প্রশ্ন ও অভিজ্ঞতা শেয়ার করতে পারবেন।'
                          : 'Guests and pending users can view everything, but only approved Students and Alumni can post questions, experiences, or replies.'))}
              </p>
            </div>

            {/* Guest: Show Google Sign-In | Logged-in Unverified/Pending: Show ONLY Student Portal link */}
            {(!user || user.role === 'guest') ? (
              <div className="p-4 rounded-2xl bg-[#F8F5EE] dark:bg-[#141311] border border-[#C5A880]/30 space-y-3">
                <GoogleSignInButton
                  onClick={() => setIsGoogleModalOpen(true)}
                  text={lang === 'bn' ? 'গুগল দিয়ে লগইন করুন' : 'Sign in with Google'}
                />
                <div className="text-center">
                  <Link
                    to="/student-portal"
                    onClick={() => setApprovalGateModalOpen(false)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#854D0E] dark:text-[#DFCA9E] hover:underline"
                  >
                    <span>{lang === 'bn' ? 'অথবা স্টুডেন্ট পোর্টালে প্রোফাইল জমা দিন →' : 'Or verify ID in Student Portal →'}</span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-[#F8F5EE] dark:bg-[#141311] border border-[#C5A880]/30 text-center">
                <Link
                  to="/student-portal"
                  onClick={() => setApprovalGateModalOpen(false)}
                  className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md transition"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>
                    {isPendingUser
                      ? (lang === 'bn' ? 'স্টুডেন্ট পোর্টালে স্ট্যাটাস দেখুন →' : 'Check Status in Student Portal →')
                      : (lang === 'bn' ? 'স্টুডেন্ট পোর্টালে আইডি ভেরিফাই করুন →' : 'Verify ID in Student Portal →')}
                  </span>
                </Link>
              </div>
            )}

            {/* Read-only Info Banner */}
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs font-sans flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <strong className="block font-bold">
                  {lang === 'bn' ? 'শুধুমাত্র অনুমোদিত সদস্যদের জন্য:' : 'Approved Students & Alumni Only:'}
                </strong>
                <p className="text-[11px] leading-relaxed text-amber-950 dark:text-amber-100">
                  {lang === 'bn'
                    ? 'স্টুডেন্ট পোর্টাল থেকে অ্যাডমিন অ্যাপ্রুভাল পাওয়া শিক্ষার্থী এবং ভেরিফায়েড অ্যালামনাইরাই প্রশ্ন পোস্ট ও অভিজ্ঞতা শেয়ার করতে পারবেন।'
                    : 'Only Admin-approved Students and verified Alumni can post questions, share experiences, or reply to discussions.'}
                </p>
              </div>
            </div>

            {/* Action Footer */}
            <div className="pt-2 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setApprovalGateModalOpen(false)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#F4EFE6] dark:bg-[#201E1A] hover:bg-[#EDE6DA] dark:hover:bg-[#2A2722] text-[#1C1917] dark:text-[#FDFBF7] text-xs font-mono-tech font-bold transition border border-[#C5A880]/30 cursor-pointer"
              >
                {lang === 'bn' ? 'বুঝেছি / ফোরামে থাকুন' : 'Got it / Back to Forum'}
              </button>
            </div>

              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* New Question / Share Experience Modal (Only for approved members) */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {newPostModalOpen && (
            <motion.div
              key="forum-newpost-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto overscroll-contain"
              onClick={(e) => {
                if (e.target === e.currentTarget) setNewPostModalOpen(false);
              }}
            >
              <motion.div
                key="forum-newpost-card"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-lg rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1a1916] border border-[#C5A880]/40 relative shadow-2xl my-auto overscroll-contain text-[#1C1917] dark:text-[#EDE8DF]"
                onClick={(e) => e.stopPropagation()}
              >
            <button
              onClick={() => setNewPostModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-[#F4EFE6] dark:bg-[#141311] border border-[#C5A880]/30 text-[#44403C] dark:text-[#A89884] hover:text-[#0C0A09] dark:hover:text-[#EDE8DF] transition cursor-pointer"
              aria-label={lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
            >
              <X className="w-4 h-4" />
            </button>

            <span className="text-[10px] font-mono-tech text-[#BD452F] uppercase tracking-wider block font-bold">
              {lang === 'bn' ? 'অ্যালামনাই কমিউনিটি পোস্ট' : 'POST TO ALUMNI COMMUNITY'}
            </span>
            <h3 className="font-serif-regal font-black text-lg sm:text-xl text-[#0C0A09] dark:text-[#FDFBF7] mt-1 mb-1.5">
              {lang === 'bn' ? 'প্রশ্ন জিজ্ঞাসা করুন অথবা অভিজ্ঞতা শেয়ার করুন' : 'Ask a Question or Share Experience'}
            </h3>
            <p className="text-xs text-[#57534E] dark:text-[#A89884] mb-5 font-sans">
              {lang === 'bn' ? 'আপনার পোস্টটি আরটেক কমিউনিটি বোর্ডে সিনিয়র এবং জুনিয়র প্রকৌশলীদের সামনে উন্মুক্ত হবে।' : 'Your thread will be posted on the RTEC community network for discussion.'}
            </p>

            <form onSubmit={handlePostSubmit} className="space-y-4 font-sans">
              {/* Type Switcher */}
              <div className="flex items-center gap-2 font-mono-tech text-xs">
                <button
                  type="button"
                  onClick={() => handleSwitchPostType('question')}
                  className={`flex-1 py-2.5 rounded-xl border transition text-center font-bold cursor-pointer ${
                    postType === 'question'
                      ? 'bg-[#C5A880] text-[#121110] border-[#C5A880] shadow'
                      : 'bg-[#F4EFE6] dark:bg-[#141311] text-[#44403C] dark:text-[#A89884] hover:text-[#0C0A09] dark:hover:text-[#EDE8DF] border-[#C5A880]/20'
                  }`}
                >
                  {lang === 'bn' ? '❓ প্রশ্ন করুন (শিক্ষার্থীদের জন্য)' : '❓ Ask Question (Students)'}
                </button>
                <button
                  type="button"
                  onClick={() => handleSwitchPostType('experience')}
                  className={`flex-1 py-2.5 rounded-xl border transition text-center font-bold cursor-pointer ${
                    postType === 'experience'
                      ? 'bg-[#BD452F] text-white border-[#BD452F] shadow'
                      : 'bg-[#F4EFE6] dark:bg-[#141311] text-[#44403C] dark:text-[#A89884] hover:text-[#0C0A09] dark:hover:text-[#EDE8DF] border-[#C5A880]/20'
                  }`}
                >
                  {lang === 'bn' ? '⭐ অভিজ্ঞতা শেয়ার (গ্র্যাজুয়েটস)' : '⭐ Share Experience (Graduates)'}
                </button>
              </div>

              <AnimatePresence mode="wait">
                {postType === 'question' ? (
                  <motion.div
                    key="form-ask-question"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18 }}
                    className="space-y-4"
                  >
                    <div className="p-3 rounded-xl bg-amber-50 dark:bg-[#141311] border border-amber-300/60 dark:border-[#C5A880]/25 text-[11px] text-[#44403C] dark:text-[#DCD3C1]">
                      {lang === 'bn'
                        ? '🎓 সাধারণ শিক্ষার্থীদের পড়াশোনা, ল্যাব, ইন্টার্নশিপ বা ক্যারিয়ার সংক্রান্ত যেকোনো প্রশ্ন সিনিয়রদের উদ্দেশ্যে লিখুন।'
                        : '🎓 Designed for current students seeking advice on academics, labs, internships, or career paths from seniors.'}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-mono-tech font-bold text-[#57534E] dark:text-[#A89884] mb-1.5">
                          {lang === 'bn' ? 'প্রশ্নের বিষয় / ক্যাটাগরি' : 'QUESTION TOPIC'}
                        </label>
                        <select
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] dark:bg-[#141311] border border-[#C5A880]/30 text-xs text-[#0C0A09] dark:text-[#FDFBF7] focus:outline-none focus:border-[#C5A880]"
                        >
                          {questionCategories.map(c => (
                            <option key={c.id} value={c.id}>{lang === 'bn' ? c.bn : c.en}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-mono-tech font-bold text-[#57534E] dark:text-[#A89884] mb-1.5">
                          {lang === 'bn' ? 'কাদের উদ্দেশ্যে প্রশ্ন' : 'TARGET AUDIENCE'}
                        </label>
                        <select
                          value={newTargetAudience}
                          onChange={(e) => setNewTargetAudience(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] dark:bg-[#141311] border border-[#C5A880]/30 text-xs text-[#0C0A09] dark:text-[#FDFBF7] focus:outline-none focus:border-[#C5A880]"
                        >
                          {audienceOptions.map(a => (
                            <option key={a.id} value={a.id}>{lang === 'bn' ? a.bn : a.en}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono-tech font-bold text-[#57534E] dark:text-[#A89884] mb-1.5">
                        {lang === 'bn' ? 'আপনার প্রশ্নটি কী?' : 'QUESTION HEADLINE'}
                      </label>
                      <input
                        type="text"
                        required
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder={lang === 'bn' ? 'যেমন: বায়িং হাউসে মার্চেন্ডাইজিং ইন্টারভিউয়ের জন্য কীভাবে প্রস্তুতি নেব?' : 'e.g., How should I prepare for buying house merchandising interviews?'}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] dark:bg-[#141311] border border-[#C5A880]/30 text-xs text-[#0C0A09] dark:text-[#FDFBF7] focus:outline-none focus:border-[#C5A880]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono-tech font-bold text-[#57534E] dark:text-[#A89884] mb-1.5">
                        {lang === 'bn' ? 'বিস্তারিত প্রশ্ন ও প্রেক্ষাপট' : 'YOUR QUESTION IN DETAIL'}
                      </label>
                      <textarea
                        rows="4"
                        required
                        value={newBody}
                        onChange={(e) => setNewBody(e.target.value)}
                        placeholder={lang === 'bn' ? 'আপনার ব্যাচ/বর্ষ, কী জানতে চাইছেন এবং কোথায় দ্বিধায় আছেন তা লিখুন...' : 'Describe what stage you are in and what specific guidance you need...'}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] dark:bg-[#141311] border border-[#C5A880]/30 text-xs text-[#0C0A09] dark:text-[#FDFBF7] focus:outline-none focus:border-[#C5A880]"
                      />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form-share-experience"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18 }}
                    className="space-y-4"
                  >
                    <div className="p-3 rounded-xl bg-rose-50 dark:bg-[#BD452F]/15 border border-rose-300/60 dark:border-[#BD452F]/30 text-[11px] text-[#44403C] dark:text-[#DCD3C1]">
                      {lang === 'bn'
                        ? '⭐ গ্র্যাজুয়েট ও সিনিয়রদের বাস্তব কর্মজীবন, মিল-ফ্যাক্টরি বা উচ্চশিক্ষার গল্প জুনিয়রদের অনুপ্রেরণার জন্য শেয়ার করুন।'
                        : '⭐ Designed for graduates & alumni to share career journeys, industry stories, and lessons learned with juniors.'}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-mono-tech font-bold text-[#57534E] dark:text-[#A89884] mb-1.5">
                          {lang === 'bn' ? 'অভিজ্ঞতার ক্ষেত্র' : 'STORY CATEGORY'}
                        </label>
                        <select
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] dark:bg-[#141311] border border-[#C5A880]/30 text-xs text-[#0C0A09] dark:text-[#FDFBF7] focus:outline-none focus:border-[#C5A880]"
                        >
                          {experienceCategories.map(c => (
                            <option key={c.id} value={c.id}>{lang === 'bn' ? c.bn : c.en}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-mono-tech font-bold text-[#57534E] dark:text-[#A89884] mb-1.5">
                          {lang === 'bn' ? 'বর্তমান পদবি ও প্রতিষ্ঠান' : 'CURRENT ROLE & COMPANY'}
                        </label>
                        <input
                          type="text"
                          value={newRoleAndCompany}
                          onChange={(e) => setNewRoleAndCompany(e.target.value)}
                          placeholder={lang === 'bn' ? 'যেমন: Senior Officer (Dyeing), DBL Group' : 'e.g., Senior Officer (Dyeing), DBL Group'}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] dark:bg-[#141311] border border-[#C5A880]/30 text-xs text-[#0C0A09] dark:text-[#FDFBF7] focus:outline-none focus:border-[#C5A880]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono-tech font-bold text-[#57534E] dark:text-[#A89884] mb-1.5">
                        {lang === 'bn' ? 'আপনার গল্পের শিরোনাম' : 'STORY HEADLINE'}
                      </label>
                      <input
                        type="text"
                        required
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder={lang === 'bn' ? 'যেমন: আরটেক ক্যাম্পাস থেকে টেক্সটাইল মিলে আমার প্রথম বছরের অভিজ্ঞতা' : 'e.g., My first year transitioning from RTEC Lab to a Knit Composite Plant'}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] dark:bg-[#141311] border border-[#C5A880]/30 text-xs text-[#0C0A09] dark:text-[#FDFBF7] focus:outline-none focus:border-[#C5A880]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono-tech font-bold text-[#57534E] dark:text-[#A89884] mb-1.5">
                        {lang === 'bn' ? 'আপনার পূর্ণ অভিজ্ঞতা ও গল্প' : 'YOUR FULL EXPERIENCE / JOURNEY'}
                      </label>
                      <textarea
                        rows="4"
                        required
                        value={newBody}
                        onChange={(e) => setNewBody(e.target.value)}
                        placeholder={lang === 'bn' ? 'কীভাবে শুরু করলেন, কী কী চ্যালেঞ্জ পার করলেন ও বাস্তব অভিজ্ঞতা শেয়ার করুন...' : 'Share how you started, challenges you navigated, and real workplace insights...'}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] dark:bg-[#141311] border border-[#C5A880]/30 text-xs text-[#0C0A09] dark:text-[#FDFBF7] focus:outline-none focus:border-[#C5A880]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono-tech font-bold text-[#57534E] dark:text-[#A89884] mb-1.5">
                        {lang === 'bn' ? 'জুনিয়রদের জন্য মূল পরামর্শ (Key Takeaways)' : 'KEY TAKEAWAYS FOR JUNIORS (OPTIONAL)'}
                      </label>
                      <input
                        type="text"
                        value={newKeyTakeaways}
                        onChange={(e) => setNewKeyTakeaways(e.target.value)}
                        placeholder={lang === 'bn' ? 'যেমন: ফ্যাব্রিক টেস্টিং ও ইংরেজি কমিউনিকেশন স্কিলে জোর দিন' : 'e.g., Master fabric quality metrics and build strong communication skills early'}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] dark:bg-[#141311] border border-[#C5A880]/30 text-xs text-[#0C0A09] dark:text-[#FDFBF7] focus:outline-none focus:border-[#C5A880]"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label className="block text-xs font-mono-tech font-bold text-[#57534E] dark:text-[#A89884] mb-1.5">
                  {lang === 'bn' ? 'ট্যাগসমূহ (কমা দিয়ে আলাদা করুন)' : 'TAGS (COMMA SEPARATED)'}
                </label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder={lang === 'bn' ? 'যেমন: স্পিনিং, ইন্টারভিউ, উচ্চশিক্ষা' : 'e.g., Spinning, Interview, HigherStudies'}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] dark:bg-[#141311] border border-[#C5A880]/30 text-xs text-[#0C0A09] dark:text-[#FDFBF7] focus:outline-none focus:border-[#C5A880]"
                />
              </div>

              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/35 border border-amber-300 dark:border-amber-500/35 text-[11px] text-amber-900 dark:text-amber-200 leading-relaxed">
                {lang === 'bn'
                  ? '🔒 আপনার পোস্টটি জমা দেওয়ার পর অ্যাডমিন প্যানেলে পর্যালোচনার জন্য যাবে। অ্যাডমিন অনুমোদন (Approve) করলে এটি সবার জন্য প্রকাশিত হবে।'
                  : '🔒 Submitted posts enter Admin review first and appear in the public feed once approved by an administrator.'}
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setNewPostModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-[#F4EFE6] dark:bg-[#141311] border border-[#C5A880]/30 text-xs font-mono-tech font-bold text-[#57534E] dark:text-[#A89884] hover:text-[#0C0A09] dark:hover:text-[#EDE8DF] transition cursor-pointer"
                >
                  {lang === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>

                <button
                  type="submit"
                  className="btn-agency btn-agency-terracotta flex-[2] py-2.5 rounded-xl text-xs font-sans uppercase tracking-wider text-white font-bold cursor-pointer"
                >
                  {postType === 'question'
                    ? (lang === 'bn' ? 'প্রশ্ন পোস্ট করুন' : 'Post Question')
                    : (lang === 'bn' ? 'অভিজ্ঞতা প্রকাশ করুন' : 'Publish Experience')}
                </button>
              </div>
            </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Edit Question / Experience Modal */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {editPostModalOpen && (
            <motion.div
              key="forum-editpost-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto overscroll-contain"
              onClick={(e) => {
                if (e.target === e.currentTarget) setEditPostModalOpen(false);
              }}
            >
              <motion.div
                key="forum-editpost-card"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-lg rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1a1916] border border-[#C5A880]/40 relative shadow-2xl my-auto overscroll-contain text-[#1C1917] dark:text-[#EDE8DF]"
                onClick={(e) => e.stopPropagation()}
              >
            <button
              onClick={() => setEditPostModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-[#F4EFE6] dark:bg-[#141311] border border-[#C5A880]/30 text-[#44403C] dark:text-[#A89884] hover:text-[#0C0A09] dark:hover:text-[#EDE8DF] transition cursor-pointer"
              aria-label={lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
            >
              <X className="w-4 h-4" />
            </button>

            <span className="text-[10px] font-mono-tech text-[#BD452F] uppercase tracking-wider block font-bold">
              {lang === 'bn' ? 'পোস্ট সম্পাদনা • আলোচনা' : 'EDIT POST • DISCUSSION'}
            </span>
            <h3 className="font-serif-regal font-black text-lg sm:text-xl text-[#0C0A09] dark:text-[#FDFBF7] mt-1 mb-1.5">
              {lang === 'bn' ? 'পোস্ট সম্পাদনা করুন' : 'Edit Your Post'}
            </h3>
            <p className="text-xs text-[#57534E] dark:text-[#A89884] mb-5 font-sans">
              {lang === 'bn' ? 'পোস্টের শিরোনাম, ক্যাটাগরি বা বিস্তারিত তথ্য সংশোধন করে আপডেট করুন।' : 'Modify topic details, title, or tags and save changes.'}
            </p>

            <form onSubmit={handleSaveEditPost} className="space-y-4 font-sans">
              {/* Type Switcher */}
              <div className="flex items-center gap-2 font-mono-tech text-xs">
                <button
                  type="button"
                  onClick={() => setEditPostType('question')}
                  className={`flex-1 py-2.5 rounded-xl border transition text-center font-bold cursor-pointer ${
                    editPostType === 'question'
                      ? 'bg-[#C5A880] text-[#121110] border-[#C5A880] shadow'
                      : 'bg-[#F4EFE6] dark:bg-[#141311] text-[#44403C] dark:text-[#A89884] hover:text-[#0C0A09] dark:hover:text-[#EDE8DF] border-[#C5A880]/20'
                  }`}
                >
                  {lang === 'bn' ? '❓ প্রশ্ন জিজ্ঞাসা' : '❓ Ask Question'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditPostType('experience')}
                  className={`flex-1 py-2.5 rounded-xl border transition text-center font-bold cursor-pointer ${
                    editPostType === 'experience'
                      ? 'bg-[#BD452F] text-white border-[#BD452F] shadow'
                      : 'bg-[#F4EFE6] dark:bg-[#141311] text-[#44403C] dark:text-[#A89884] hover:text-[#0C0A09] dark:hover:text-[#EDE8DF] border-[#C5A880]/20'
                  }`}
                >
                  {lang === 'bn' ? '⭐ অভিজ্ঞতা শেয়ার' : '⭐ Share Experience'}
                </button>
              </div>

              <div>
                <label className="block text-xs font-mono-tech font-bold text-[#57534E] dark:text-[#A89884] mb-1.5">
                  {editPostType === 'question'
                    ? (lang === 'bn' ? 'প্রশ্নের বিষয় / ক্যাটাগরি' : 'QUESTION TOPIC')
                    : (lang === 'bn' ? 'অভিজ্ঞতার ক্ষেত্র' : 'STORY CATEGORY')}
                </label>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] dark:bg-[#141311] border border-[#C5A880]/30 text-xs text-[#0C0A09] dark:text-[#FDFBF7] focus:outline-none focus:border-[#C5A880]"
                >
                  {(editPostType === 'question' ? questionCategories : experienceCategories).map(c => (
                    <option key={c.id} value={c.id}>{lang === 'bn' ? c.bn : c.en}</option>
                  ))}
                </select>
              </div>

              {editPostType === 'question' ? (
                <div>
                  <label className="block text-xs font-mono-tech font-bold text-[#57534E] dark:text-[#A89884] mb-1.5">
                    {lang === 'bn' ? 'কাদের উদ্দেশ্যে প্রশ্ন' : 'TARGET AUDIENCE'}
                  </label>
                  <select
                    value={editTargetAudience}
                    onChange={(e) => setEditTargetAudience(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] dark:bg-[#141311] border border-[#C5A880]/30 text-xs text-[#0C0A09] dark:text-[#FDFBF7] focus:outline-none focus:border-[#C5A880]"
                  >
                    {audienceOptions.map(a => (
                      <option key={a.id} value={a.id}>{lang === 'bn' ? a.bn : a.en}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-mono-tech font-bold text-[#57534E] dark:text-[#A89884] mb-1.5">
                      {lang === 'bn' ? 'বর্তমান পদবি ও প্রতিষ্ঠান' : 'CURRENT ROLE & COMPANY'}
                    </label>
                    <input
                      type="text"
                      value={editRoleAndCompany}
                      onChange={(e) => setEditRoleAndCompany(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] dark:bg-[#141311] border border-[#C5A880]/30 text-xs text-[#0C0A09] dark:text-[#FDFBF7] focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono-tech font-bold text-[#57534E] dark:text-[#A89884] mb-1.5">
                      {lang === 'bn' ? 'জুনিয়রদের জন্য মূল পরামর্শ' : 'KEY TAKEAWAYS FOR JUNIORS'}
                    </label>
                    <input
                      type="text"
                      value={editKeyTakeaways}
                      onChange={(e) => setEditKeyTakeaways(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] dark:bg-[#141311] border border-[#C5A880]/30 text-xs text-[#0C0A09] dark:text-[#FDFBF7] focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-mono-tech font-bold text-[#57534E] dark:text-[#A89884] mb-1.5">
                  {lang === 'bn' ? 'শিরোনাম (Topic Title)' : 'TITLE'}
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] dark:bg-[#141311] border border-[#C5A880]/30 text-xs text-[#0C0A09] dark:text-[#FDFBF7] focus:outline-none focus:border-[#C5A880]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono-tech font-bold text-[#57534E] dark:text-[#A89884] mb-1.5">
                  {lang === 'bn' ? 'বিস্তারিত বর্ণনা (Detailed Description)' : 'DETAILED DESCRIPTION'}
                </label>
                <textarea
                  rows="4"
                  required
                  value={editBody}
                  onChange={(e) => setEditBody(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] dark:bg-[#141311] border border-[#C5A880]/30 text-xs text-[#0C0A09] dark:text-[#FDFBF7] focus:outline-none focus:border-[#C5A880]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono-tech font-bold text-[#57534E] dark:text-[#A89884] mb-1.5">
                  {lang === 'bn' ? 'ট্যাগসমূহ (কমা দিয়ে আলাদা করুন)' : 'TAGS (COMMA SEPARATED)'}
                </label>
                <input
                  type="text"
                  value={editTags}
                  onChange={(e) => setEditTags(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] dark:bg-[#141311] border border-[#C5A880]/30 text-xs text-[#0C0A09] dark:text-[#FDFBF7] focus:outline-none focus:border-[#C5A880]"
                />
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setEditPostModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-[#F4EFE6] dark:bg-[#141311] border border-[#C5A880]/30 text-xs font-mono-tech font-bold text-[#57534E] dark:text-[#A89884] hover:text-[#0C0A09] dark:hover:text-[#EDE8DF] transition cursor-pointer"
                >
                  {lang === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>

                <button
                  type="submit"
                  className="btn-agency btn-agency-terracotta flex-[2] py-2.5 rounded-xl text-xs font-sans uppercase tracking-wider text-white font-bold cursor-pointer"
                >
                  {lang === 'bn' ? 'সংরক্ষণ করুন' : 'Save Changes'}
                </button>
              </div>
            </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Floating Toast Feedback (Portaled above header & high contrast in both modes) */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {toast && (
            <motion.div
              key="forum-toast"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="system-toast fixed top-36 sm:top-36 right-4 sm:right-8 z-[99999] px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold shadow-2xl flex items-center gap-2.5 max-w-md"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{toast}</span>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* 1-Click Google Sign-In Modal for community verification */}
      <GoogleSignInModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        onSuccess={(loggedUser) => {
          const loggedEmail = (loggedUser?.email || '').toLowerCase().trim();
          const verifiedNow = Boolean(
            loggedUser?.role === 'admin' ||
            loggedUser?.submissionStatus === 'approved' ||
            (loggedEmail && students.some(s => s.email?.toLowerCase().trim() === loggedEmail)) ||
            (loggedEmail && alumni.some(a => a.email?.toLowerCase().trim() === loggedEmail && a.isVerified !== false))
          );
          if (verifiedNow) {
            setApprovalGateModalOpen(false);
            handleSwitchPostType(pendingDesiredPostType);
            setNewPostModalOpen(true);
          } else {
            setApprovalGateModalOpen(true);
          }
        }}
      />

    </motion.div>
  );
}
