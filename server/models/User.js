import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    nameBn: { type: String, default: '' },
    role: { type: String, default: 'alumni' }, // 'admin', 'alumni', 'student', 'guest'
    batch: { type: String, default: '' },
    department: { type: String, default: 'Yarn Engineering' },
    company: { type: String, default: '' },
    phone: { type: String, default: '' },
    regNo: { type: String, default: '' },
    address: { type: String, default: '' },
    location: { type: String, default: '' },
    bio: { type: String, default: '' },
    studentType: { type: String, default: '' },
    submissionId: { type: String, default: '' },
    submissionStatus: { type: String, default: 'none' },
    avatar: { type: String, default: '' },
    isVerified: { type: Boolean, default: false },
    googleVerified: { type: Boolean, default: false },
    lastLoginAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

UserSchema.index({ email: 1 });

export const User = mongoose.model('User', UserSchema);
