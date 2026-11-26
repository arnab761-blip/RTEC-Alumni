import mongoose from 'mongoose';

const MemorySchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, default: '' },
    titleBn: { type: String, default: '' },
    caption: { type: String, default: '' },
    category: { type: String, default: 'Campus Life' },
    batch: { type: String, default: '' },
    image: { type: String, required: true },
    uploadedBy: { type: String, default: '' },
    likes: { type: Number, default: 1 }
  },
  { timestamps: true }
);

export const Memory = mongoose.model('Memory', MemorySchema);
