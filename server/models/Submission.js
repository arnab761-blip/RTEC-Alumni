import mongoose from 'mongoose';

const SubmissionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    regNo: { type: String, required: true },
    batch: { type: String, required: true },
    department: { type: String, default: 'Yarn Engineering' },
    session: { type: String, default: '' },
    bloodGroup: { type: String, default: '' },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    status: { type: String, default: 'pending' }, // 'pending', 'approved', 'declined'
    declineReason: { type: String, default: '' },
    submittedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export const Submission = mongoose.model('Submission', SubmissionSchema);
