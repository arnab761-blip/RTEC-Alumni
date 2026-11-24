import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true },
    location: { type: String, default: 'Dhaka, Bangladesh' },
    type: { type: String, default: 'Full-time' }, // 'Full-time', 'Part-time', 'Internship'
    experience: { type: String, default: 'Entry Level' },
    salary: { type: String, default: 'Negotiable' },
    deadline: { type: String, default: '' },
    description: { type: String, default: '' },
    requirements: { type: [String], default: [] },
    link: { type: String, default: '' },
    postedBy: { type: String, default: 'Admin' },
    postedByEmail: { type: String, default: '' },
    postedByRole: { type: String, default: 'alumni' },
    status: { type: String, default: 'approved' }, // 'approved', 'pending', 'declined'
    postedAt: { type: String, default: '' }
  },
  { timestamps: true }
);

export const Job = mongoose.model('Job', JobSchema);
