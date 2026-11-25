import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext.jsx';
import { useScrollLock } from '../utils/useScrollLock.js';
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
  const [replyTextMap, setReplyTextMap] = useState({});
  const [expandedReplies, setExpandedReplies] = useState({});
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  // Edit Post State
  const [editPostModalOpen, setEditPostModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editBody, setEditBody] = useState('');
  const [editCategory, setEditCategory] = useState('Career Advice');
  const [editTags, setEditTags] = useState('Career, Textile');
  const [editPostType, setEditPostType] = useState('question');

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

  // Authorization check for posting
  const isApprovedToShareExperience = Boolean(
    user?.role === 'admin' ||
    user?.role === 'alumni' ||
    user?.role === 'student' ||
    mySubmission?.status === 'approved' ||
    (user?.submissionStatus === 'approved') ||
    (user?.isVerified && user?.status === 'approved') ||
    (user?.email && alumni.some(a => a.email?.toLowerCase() === user.email?.toLowerCase() && a.isVerified)) ||
    (mySubmission?.email && alumni.some(a => a.email?.toLowerCase() === mySubmission.email?.toLowerCase() && a.isVerified)) ||
    (mySubmission?.regNo && students.some(s => s.regNo === mySubmission.regNo))
  );

  const handleOpenPostModal = () => {
    if (isApprovedToShareExperience) {
      setNewPostModalOpen(true);
    } else {
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
    setEditTitle(post.titleBn || post.title || '');
    setEditBody(post.body || post.content || '');
    setEditCategory(post.category || 'Career Advice');
    setEditTags(Array.isArray(post.tags) ? post.tags.join(', ') : (post.tags || ''));
    setEditPostType(post.type || 'question');
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
      categoryBn: editCategory,
      tags: tagArray,
      type: editPostType
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

  // New post form
  const [postType, setPostType] = useState('question'); // 'question' | 'experience'
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Career Advice');
  const [newBody, setNewBody] = useState('');
  const [newTags, setNewTags] = useState('Career, Textile');

  const categories = [
    { id: 'All', bn: 'সকল বিষয়', en: 'All Topics' },
    { id: 'Industry Experience', bn: 'ইন্ডাস্ট্রি ও মিল লাইফ', en: 'Industry & Plant Life' },
    { id: 'Job & Interviews', bn: 'জব ও ইন্টারভিউ', en: 'Job & Interviews' },
    { id: 'Higher Studies', bn: 'বিদেশে উচ্চশিক্ষা', en: 'Higher Studies Abroad' },
    { id: 'Career Advice', bn: 'ক্যারিয়ার পরামর্শ', en: 'Career Guidance' },
    { id: 'Merchandising', bn: 'মার্চেন্ডাইজিং', en: 'Merchandising' }
  ];

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newBody.trim()) return;
    const tagArray = newTags.split(',').map(t => t.trim()).filter(Boolean);
    addForumPost(newTitle, newBody, newCategory, tagArray, postType);
    setNewTitle('');
    setNewBody('');
    setNewPostModalOpen(false);
    showToast(lang === 'bn' ? 'আপনার পোস্টটি সফলভাবে প্রকাশ করা হয়েছে!' : 'Your post has been published!');
  };

  // Anyone can reply/comment without approval
  const handleReplySubmit = (e, postId) => {
    e.preventDefault();
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
    const matchCat = activeCategory === 'All' || p.category === activeCategory || p.categoryBn === activeCategory;
    const matchSearch =
      (p.title && p.title.toLowerCase().includes(search.toLowerCase())) ||
      (p.titleBn && p.titleBn.toLowerCase().includes(search.toLowerCase())) ||
      (p.body && p.body.toLowerCase().includes(search.toLowerCase())) ||
      (p.author && p.author.toLowerCase().includes(search.toLowerCase())) ||
      (p.tags && p.tags.some(t => t.toLowerCase().includes(search.toLowerCase())));
    return matchCat && matchSearch;
  }), [forumPosts, activeCategory, search]);

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
            <span className="text-[#BD452F] font-bold">ALUMNI KNOWLEDGE COMMONS • SECTION 05</span>
            <span>RTEC PIRGANJ • EXPERIENCE SHARE</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif-regal font-black text-[#0C0A09] dark:text-[#FDFBF7] tracking-tight">
                {lang === 'bn' ? 'সিনিয়র অ্যালামনাই অভিজ্ঞতা শেয়ার ও ক্যারিয়ার গল্প' : 'Senior Alumni Experience Share & Career Stories'}
              </h1>
              <p className="text-xs sm:text-sm text-[#44403C] dark:text-[#DCD3C1] mt-2 max-w-3xl font-sans leading-relaxed">
                {lang === 'bn'
                  ? 'টেক্সটাইল মিলের ফ্লোর ম্যানেজমেন্ট, আন্তর্জাতিক বায়িং হাউজে মার্চেন্ডাইজিং, ফ্রেশারদের জব ইন্টারভিউ এবং উচ্চশিক্ষায় স্কলারশিপ নিয়ে সিনিয়র প্রকৌশলীদের বাস্তব অভিজ্ঞতা ও দিকনির্দেশনা।'
                  : 'Real-world career stories, plant floor management wisdom, and higher studies guidance shared by senior RTEC alumni engineers.'}
              </p>
            </div>

            <button
              onClick={handleOpenPostModal}
              className="btn-agency btn-agency-terracotta px-5 py-3 rounded-xl text-xs font-sans uppercase tracking-wider shrink-0 flex items-center gap-2 shadow-md cursor-pointer text-white font-bold"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{lang === 'bn' ? 'অভিজ্ঞতা বা গল্প শেয়ার করুন' : 'Share Experience / Story'}</span>
            </button>
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
              TOTAL DISCUSSIONS: <strong className="text-[#854D0E] dark:text-[#DFCA9E] font-bold">{filteredPosts.length}</strong>
            </span>
          </div>

          {/* Topic Pills */}
          <div className="flex flex-wrap gap-2.5 pt-2 border-t border-[#C5A880]/15">
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
                    {/* Post Type Badge */}
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-mono-tech font-bold border ${
                      post.type === 'experience'
                        ? 'bg-[#BD452F]/15 text-[#BD452F] dark:text-[#DE644E] border-[#BD452F]/30'
                        : 'bg-[#C5A880]/15 text-[#854D0E] dark:text-[#DFCA9E] border-[#C5A880]/30'
                    }`}>
                      {post.type === 'experience'
                        ? (lang === 'bn' ? '⭐ অভিজ্ঞতা' : '⭐ Experience')
                        : (lang === 'bn' ? '💡 ক্যারিয়ার টিপস' : '💡 Career Insight')}
                    </span>

                    <span className="px-2.5 py-1 rounded-lg bg-[#F4EFE6] dark:bg-[#141311] text-[#854D0E] dark:text-[#DFCA9E] text-[10px] font-mono-tech font-bold border border-[#C5A880]/25">
                      {post.categoryBn || post.category}
                    </span>

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
                  <p className="text-xs sm:text-sm text-[#292524] dark:text-[#DCD3C1] font-sans leading-relaxed whitespace-pre-line">
                    {post.body}
                  </p>
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

                    {/* Inline Reply Form (Anyone can reply/comment!) */}
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
                  ? (lang === 'bn' ? 'অভিজ্ঞতা ফোরাম উন্মুক্ত — প্রথম আলোচনা শুরু করুন' : 'Senior Knowledge Commons is Live — Start the First Thread')
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
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-[10px] font-mono-tech uppercase font-bold tracking-wider">
              <Lock className="w-3 h-3 text-amber-500" />
              <span>{lang === 'bn' ? 'অনুমোদন যাচাইকরণ • VERIFICATION REQUIRED' : 'VERIFICATION REQUIRED'}</span>
            </div>

            {/* Modal Heading */}
            <div>
              <h3 className="font-serif-regal font-black text-xl sm:text-2xl text-[#0C0A09] dark:text-[#FDFBF7]">
                {lang === 'bn' ? 'অভিজ্ঞতা শেয়ার করার পূর্বশর্ত' : 'Eligibility to Share Experiences'}
              </h3>
              <p className="text-xs text-[#57534E] dark:text-[#A89884] mt-1 font-sans">
                {lang === 'bn'
                  ? 'আরটেক (RTEC) কমিউনিটি ফোরামে দায়িত্বশীল ও মানসম্মত আলোচনা বজায় রাখতে সিনিয়র অভিজ্ঞতা প্রকাশের জন্য অ্যাডমিন অনুমোদন প্রযোজ্য।'
                  : 'To ensure authentic and verified career advice, sharing new experiences requires an approved student profile.'}
              </p>
            </div>

            {/* State-Specific Status Notice Card */}
            {mySubmission?.status === 'pending' ? (
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-500/40 text-amber-950 dark:text-amber-100 space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 animate-pulse" />
                  <h4 className="font-bold text-xs sm:text-sm">
                    {lang === 'bn' ? '⏳ আপনার আবেদনটি পর্যালোচনায় রয়েছে (Pending)' : '⏳ Application Under Review (Pending)'}
                  </h4>
                </div>
                <p className="text-xs font-sans leading-relaxed text-amber-900 dark:text-amber-200">
                  {lang === 'bn'
                    ? `আপনি স্টুডেন্ট পোর্টালে তথ্য জমা দিয়েছেন (রেজিস্ট্রেশন: ${mySubmission.regNo || mySubmission.id})। কলেজ অ্যাডমিন কর্তৃক আপনার প্রোফাইলটি যাচাইপূর্বক অনুমোদন (Approve) দেওয়া মাত্রই আপনি সরাসরি অভিজ্ঞতা বা প্রশ্ন পোস্ট করতে পারবেন।`
                    : `Your profile submission (${mySubmission.regNo || mySubmission.id}) is currently pending administrative verification. Once approved, you can share stories.`}
                </p>
                <div className="pt-1">
                  <Link
                    to="/student-portal"
                    onClick={() => setApprovalGateModalOpen(false)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-300 hover:underline"
                  >
                    <span>{lang === 'bn' ? 'স্টুডেন্ট পোর্টালে স্ট্যাটাস দেখুন →' : 'View Status in Student Portal →'}</span>
                  </Link>
                </div>
              </div>
            ) : mySubmission?.status === 'declined' ? (
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-500/40 text-rose-950 dark:text-rose-100 space-y-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                  <h4 className="font-bold text-xs sm:text-sm">
                    {lang === 'bn' ? '✕ আবেদন সংশোধনের জন্য ফেরত দেওয়া হয়েছে (Declined)' : '✕ Application Requires Modification'}
                  </h4>
                </div>
                <p className="text-xs font-sans leading-relaxed text-rose-900 dark:text-rose-200">
                  {lang === 'bn'
                    ? `অ্যাডমিন পর্যবেক্ষণ: "${mySubmission.reviewNotes || 'কিছু তথ্যে অসম্পূর্ণতা রয়েছে'}।" স্টুডেন্ট পোর্টালে গিয়ে তথ্য আপডেট করে পুনরায় জমা দিন।`
                    : `Admin feedback: "${mySubmission.reviewNotes || 'Information requires correction'}." Please update your information.`}
                </p>
                <div className="pt-1">
                  <Link
                    to="/student-portal"
                    onClick={() => setApprovalGateModalOpen(false)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-800 dark:text-rose-300 hover:underline"
                  >
                    <span>{lang === 'bn' ? 'স্টুডেন্ট পোর্টালে তথ্য সংশোধন করুন →' : 'Update Details in Student Portal →'}</span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-[#F8F5EE] dark:bg-[#141311] border border-[#C5A880]/30 space-y-3">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-[#854D0E] dark:text-[#DFCA9E] shrink-0" />
                  <h4 className="font-bold text-xs sm:text-sm text-[#0C0A09] dark:text-[#FDFBF7]">
                    {lang === 'bn' ? 'স্টুডেন্ট পোর্টালে তথ্য জমা দিন' : 'Submit Details in Student Portal'}
                  </h4>
                </div>
                <p className="text-xs font-sans leading-relaxed text-[#44403C] dark:text-[#DCD3C1]">
                  {lang === 'bn'
                    ? 'আপনি এখনো শিক্ষার্থী তথ্য জমা দেননি। স্টুডেন্ট পোর্টাল থেকে আপনার নাম, রেজিস্ট্রেশন নম্বর ও জিমেইল দিয়ে তথ্য সাবমিট করুন। অ্যাডমিন অনুমোদন দিলেই আপনার আইডি থেকে ফোরামে পোস্ট করা যাবে।'
                    : 'You have not submitted your student details yet. Submit your name, registration number, and Gmail in the Student Portal to gain posting rights.'}
                </p>
                <div>
                  <Link
                    to="/student-portal"
                    onClick={() => setApprovalGateModalOpen(false)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs shadow-md hover:from-emerald-500 hover:to-teal-500 transition"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>{lang === 'bn' ? 'স্টুডেন্ট পোর্টালে তথ্য জমা দিন →' : 'Submit Details in Student Portal →'}</span>
                  </Link>
                </div>
              </div>
            )}

            {/* Crucial Reassurance Banner: Comments & Likes are completely open to everyone! */}
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-900 dark:text-emerald-200 text-xs font-sans flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <strong className="block font-bold">
                  {lang === 'bn' ? '💡 লাইক ও কমেন্ট সকলের জন্য সম্পূর্ণ উন্মুক্ত:' : '💡 Comments & Likes are Free for Everyone:'}
                </strong>
                <p className="text-[11px] leading-relaxed text-emerald-950 dark:text-emerald-100">
                  {lang === 'bn'
                    ? 'অনুমোদন না থাকলেও আপনি ওয়েবসাইটের প্রতিটি পোস্টে সরাসরি লাইক দিতে পারবেন এবং সিনিয়রদের উত্তরের নিচে কমেন্ট করে আলোচনা চালিয়ে যেতে পারবেন।'
                    : 'Even without profile approval, you can freely like any senior advice post and participate in discussions by commenting.'}
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
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <span className="text-[10px] font-mono-tech text-[#BD452F] uppercase tracking-wider block font-bold">
              POST TO ALUMNI COMMUNITY
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
                  onClick={() => setPostType('question')}
                  className={`flex-1 py-2.5 rounded-xl border transition text-center font-bold cursor-pointer ${
                    postType === 'question'
                      ? 'bg-[#C5A880] text-[#121110] border-[#C5A880] shadow'
                      : 'bg-[#F4EFE6] dark:bg-[#141311] text-[#44403C] dark:text-[#A89884] hover:text-[#0C0A09] dark:hover:text-[#EDE8DF] border-[#C5A880]/20'
                  }`}
                >
                  {lang === 'bn' ? '❓ প্রশ্ন জিজ্ঞাসা (Ask Question)' : '❓ Ask Question'}
                </button>
                <button
                  type="button"
                  onClick={() => setPostType('experience')}
                  className={`flex-1 py-2.5 rounded-xl border transition text-center font-bold cursor-pointer ${
                    postType === 'experience'
                      ? 'bg-[#BD452F] text-white border-[#BD452F] shadow'
                      : 'bg-[#F4EFE6] dark:bg-[#141311] text-[#44403C] dark:text-[#A89884] hover:text-[#0C0A09] dark:hover:text-[#EDE8DF] border-[#C5A880]/20'
                  }`}
                >
                  {lang === 'bn' ? '⭐ অভিজ্ঞতা শেয়ার (Share Story)' : '⭐ Share Experience'}
                </button>
              </div>

              <div>
                <label className="block text-xs font-mono-tech font-bold text-[#57534E] dark:text-[#A89884] mb-1.5">
                  {lang === 'bn' ? 'ক্যাটাগরি বা বিষয়' : 'CATEGORY'}
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] dark:bg-[#141311] border border-[#C5A880]/30 text-xs text-[#0C0A09] dark:text-[#FDFBF7] focus:outline-none focus:border-[#C5A880]"
                >
                  <option value="Industry Experience">ইন্ডাস্ট্রি ও মিল লাইফ (Industry Experience)</option>
                  <option value="Job & Interviews">জব ও ইন্টারভিউ (Job & Interviews)</option>
                  <option value="Higher Studies">বিদেশে উচ্চশিক্ষা (Higher Studies Abroad)</option>
                  <option value="Career Advice">ক্যারিয়ার পরামর্শ (Career Advice)</option>
                  <option value="Merchandising">মার্চেন্ডাইজিং (Merchandising)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono-tech font-bold text-[#57534E] dark:text-[#A89884] mb-1.5">
                  {lang === 'bn' ? 'শিরোনাম (Topic Title)' : 'TITLE'}
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder={lang === 'bn' ? 'যেমন: স্পিনিং মিলে শিফট ডিউটিতে কী কী চ্যালেঞ্জ আসে?' : 'e.g., What are the key skills needed for buying house merchandising?'}
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
                  value={newBody}
                  onChange={(e) => setNewBody(e.target.value)}
                  placeholder={lang === 'bn' ? 'আপনার অভিজ্ঞতা বা প্রশ্নের প্রেক্ষাপট বিস্তারিত লিখুন...' : 'Write the context of your question or detailed industry experience...'}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] dark:bg-[#141311] border border-[#C5A880]/30 text-xs text-[#0C0A09] dark:text-[#FDFBF7] focus:outline-none focus:border-[#C5A880]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono-tech font-bold text-[#57534E] dark:text-[#A89884] mb-1.5">
                  {lang === 'bn' ? 'ট্যাগসমূহ (কমা দিয়ে আলাদা করুন)' : 'TAGS (COMMA SEPARATED)'}
                </label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="Spinning, Interview, HigherStudies"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] dark:bg-[#141311] border border-[#C5A880]/30 text-xs text-[#0C0A09] dark:text-[#FDFBF7] focus:outline-none focus:border-[#C5A880]"
                />
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
                  {lang === 'bn' ? 'পোস্ট প্রকাশ করুন' : 'Publish Thread'}
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
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <span className="text-[10px] font-mono-tech text-[#BD452F] uppercase tracking-wider block font-bold">
              EDIT POST • DISCUSSION
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
                  {lang === 'bn' ? 'ক্যাটাগরি বা বিষয়' : 'CATEGORY'}
                </label>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] dark:bg-[#141311] border border-[#C5A880]/30 text-xs text-[#0C0A09] dark:text-[#FDFBF7] focus:outline-none focus:border-[#C5A880]"
                >
                  <option value="Industry Experience">ইন্ডাস্ট্রি ও মিল লাইফ (Industry Experience)</option>
                  <option value="Job & Interviews">জব ও ইন্টারভিউ (Job & Interviews)</option>
                  <option value="Higher Studies">বিদেশে উচ্চশিক্ষা (Higher Studies Abroad)</option>
                  <option value="Career Advice">ক্যারিয়ার পরামর্শ (Career Advice)</option>
                  <option value="Merchandising">মার্চেন্ডাইজিং (Merchandising)</option>
                </select>
              </div>

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

      {/* Floating Toast Feedback */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key="forum-toast"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 sm:bottom-24 left-1/2 -translate-x-1/2 z-[10000] px-4 py-2.5 rounded-xl bg-[#0C0A09] text-white text-xs font-sans font-bold shadow-2xl border border-[#C5A880]/40 flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
