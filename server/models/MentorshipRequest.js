import mongoose from 'mongoose';

const MentorshipRequestSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    mentorId: { type: String, default: '' },
    mentorName: { type: String, default: 'RTEC Mentor Desk' },
    mentorEmail: { type: String, default: '' },
    studentName: { type: String, required: true, trim: true },
    studentEmail: { type: String, required: true, lowercase: true, trim: true },
    studentBatch: { type: String, default: '' },
    topic: { type: String, default: '' },
    details: { type: String, default: '' },
    status: { type: String, default: 'pending' }, // 'pending' | 'approved' | 'completed' | 'declined'
    adminNote: { type: String, default: '' }
  },
  { timestamps: true }
);

export const MentorshipRequest = mongoose.model('MentorshipRequest', MentorshipRequestSchema);
