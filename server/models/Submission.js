import mongoose from 'mongoose';

const SubmissionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    nameEn: { type: String, default: '' },
    regNo: { type: String, required: true },
    batch: { type: String, required: true },
    department: { type: String, default: 'Yarn Engineering' },
    deptBn: { type: String, default: '' },
    session: { type: String, default: '' },
    bloodGroup: { type: String, default: '' },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    currentJob: { type: String, default: '' },
    currentLocation: { type: String, default: '' },
    address: { type: String, default: '' },
    avatar: { type: String, default: '' },
    bio: { type: String, default: '' },
    studentType: { type: String, default: '' },
    status: { type: String, default: 'pending' }, // 'pending', 'approved', 'declined'
    declineReason: { type: String, default: '' },
    reviewNotes: { type: String, default: '' },
    reviewedAt: { type: String, default: '' },
    submittedAt: { type: String, default: '' }
  },
  { timestamps: true }
);

export const Submission = mongoose.model('Submission', SubmissionSchema);
