import mongoose from 'mongoose';

const ReplySchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    author: { type: String, required: true },
    authorId: { type: String, default: '' },
    authorEmail: { type: String, default: '' },
    role: { type: String, default: 'Member' },
    avatar: { type: String, default: '' },
    date: { type: String, default: '' },
    content: { type: String, default: '' },
    isDeleted: { type: Boolean, default: false },
    isEdited: { type: Boolean, default: false },
    updatedAt: { type: String, default: '' },
    deletedAt: { type: String, default: '' }
  },
  { _id: false }
);

const ForumPostSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true, trim: true },
    titleBn: { type: String, default: '' },
    author: { type: String, default: 'RTEC Member' },
    authorId: { type: String, default: '' },
    authorEmail: { type: String, default: '' },
    avatar: { type: String, default: '' },
    authorRole: { type: String, default: 'Student Engineer' },
    authorBatch: { type: String, default: 'RTEC' },
    type: { type: String, default: 'question' }, // 'question' | 'experience'
    category: { type: String, default: 'Career Advice' },
    categoryBn: { type: String, default: '' },
    date: { type: String, default: '' },
    upvotes: { type: Number, default: 1 },
    repliesCount: { type: Number, default: 0 },
    tags: { type: [String], default: [] },
    body: { type: String, default: '' },
    content: { type: String, default: '' },
    description: { type: String, default: '' },
    targetAudience: { type: String, default: '' },
    roleAndCompany: { type: String, default: '' },
    keyTakeaways: { type: String, default: '' },
    isEdited: { type: Boolean, default: false },
    updatedAt: { type: String, default: '' },
    replies: { type: [ReplySchema], default: [] }
  },
  { timestamps: true }
);

export const ForumPost = mongoose.model('ForumPost', ForumPostSchema);
