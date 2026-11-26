import mongoose from 'mongoose';

const JobApplicationSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    jobId: { type: String, required: true, index: true },
    jobTitle: { type: String, default: '' },
    company: { type: String, default: '' },
    applicantName: { type: String, required: true, trim: true },
    applicantEmail: { type: String, default: '', lowercase: true, trim: true },
    applicantBatch: { type: String, default: '' },
    cvLink: { type: String, default: '' },
    coverNote: { type: String, default: '' },
    status: { type: String, default: 'submitted' }, // 'submitted' | 'reviewed'
    appliedAt: { type: String, default: '' }
  },
  { timestamps: true }
);

export const JobApplication = mongoose.model('JobApplication', JobApplicationSchema);
