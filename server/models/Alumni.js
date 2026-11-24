import mongoose from 'mongoose';

const AlumniSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    nameBn: { type: String, default: '' },
    batch: { type: String, required: true },
    department: { type: String, default: 'Yarn Engineering' },
    deptBn: { type: String, default: '' },
    company: { type: String, default: '' },
    designation: { type: String, default: '' },
    location: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    bloodGroup: { type: String, default: '' },
    avatar: { type: String, default: '' },
    isVerified: { type: Boolean, default: true },
    skills: { type: [String], default: [] },
    bio: { type: String, default: '' },
    linkedin: { type: String, default: '' }
  },
  { timestamps: true }
);

AlumniSchema.index({ batch: 1 });

export const Alumni = mongoose.model('Alumni', AlumniSchema);
