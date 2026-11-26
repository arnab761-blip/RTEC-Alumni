import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true, trim: true },
    titleBn: { type: String, default: '' },
    company: { type: String, required: true },
    location: { type: String, default: 'Dhaka, Bangladesh' },
    department: { type: String, default: 'Yarn Engineering' },
    type: { type: String, default: 'Full-time' },
    experience: { type: String, default: 'Entry Level' },
    salary: { type: String, default: 'Negotiable' },
    deadline: { type: String, default: '' },
    description: { type: String, default: '' },
    descriptionBn: { type: String, default: '' },
    requirements: { type: [String], default: [] },
    link: { type: String, default: '' },
    applyLink: { type: String, default: '' },
    email: { type: String, default: '' },
    image: { type: String, default: '' },
    pdfUrl: { type: String, default: '' },
    isFeatured: { type: Boolean, default: false },
    isUserCreated: { type: Boolean, default: true },
    postedBy: { type: String, default: 'Admin' },
    postedByEmail: { type: String, default: '' },
    postedByRole: { type: String, default: 'alumni' },
    status: { type: String, default: 'approved' }, // 'approved', 'pending', 'declined'
    postedAt: { type: String, default: '' }
  },
  { timestamps: true }
);

export const Job = mongoose.model('Job', JobSchema);
