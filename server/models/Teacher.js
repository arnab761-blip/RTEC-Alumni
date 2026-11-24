import mongoose from 'mongoose';

const TeacherSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    order: { type: Number, default: 0 },
    name: { type: String, required: true, trim: true },
    nameBn: { type: String, default: '' },
    designation: { type: String, required: true },
    designationBn: { type: String, default: '' },
    department: { type: String, default: 'Administration & Textile Engineering' },
    deptBn: { type: String, default: '' },
    office: { type: String, default: 'রংপুর টেক্সটাইল ইঞ্জিনিয়ারিং কলেজ' },
    officeRoom: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    mobile: { type: String, default: '' },
    joiningDate: { type: String, default: '' },
    homeDistrict: { type: String, default: '' },
    bcsBatch: { type: String, default: '' },
    bloodGroup: { type: String, default: '' },
    photo: { type: String, default: '' },
    isHod: { type: Boolean, default: false },
    status: { type: String, default: 'Active' },
    education: { type: String, default: '' },
    research: { type: String, default: '' }
  },
  { timestamps: true }
);

export const Teacher = mongoose.model('Teacher', TeacherSchema);

