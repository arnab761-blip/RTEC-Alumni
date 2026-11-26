import mongoose from 'mongoose';

const ContactMessageSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, default: '', lowercase: true, trim: true },
    phone: { type: String, default: '', trim: true },
    subject: { type: String, default: 'General Inquiry', trim: true },
    message: { type: String, required: true },
    recipientName: { type: String, default: '' },
    recipientId: { type: String, default: '' },
    source: { type: String, default: 'contact' }, // 'contact' | 'alumni-directory'
    status: { type: String, default: 'unread' }, // 'unread' | 'resolved'
    adminNote: { type: String, default: '' }
  },
  { timestamps: true }
);

export const ContactMessage = mongoose.model('ContactMessage', ContactMessageSchema);
