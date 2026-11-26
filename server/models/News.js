import mongoose from 'mongoose';

const NewsSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true, trim: true },
    titleBn: { type: String, default: '' },
    summary: { type: String, default: '' },
    summaryBn: { type: String, default: '' },
    content: { type: String, default: '' },
    contentBn: { type: String, default: '' },
    description: { type: String, default: '' },
    date: { type: String, default: '' },
    category: { type: String, default: 'Notice' }, // 'Notice', 'Event', 'Academic', 'Alumni'
    image: { type: String, default: '' },
    fileUrl: { type: String, default: '' },
    pdfUrl: { type: String, default: '' },
    views: { type: Number, default: 1 },
    isPinned: { type: Boolean, default: false },
    isUserCreated: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const News = mongoose.model('News', NewsSchema);
