import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  id: { type: String, unique: true, sparse: true },
  name: { type: String, required: true, trim: true },
  nameBn: { type: String, default: '' },
  regNo: { type: String, required: true, trim: true, index: true },
  studentId: { type: String, default: '' },
  batch: { type: String, required: true, trim: true },
  department: { type: String, default: 'Yarn Engineering', trim: true },
  deptBn: { type: String, default: '' },
  session: { type: String, default: '' },
  year: { type: String, default: '' },
  bloodGroup: { type: String, default: '' },
  phone: { type: String, default: '' },
  email: { type: String, default: '' },
  avatar: { type: String, default: '' },
  role: { type: String, default: 'Student Member' },
  status: { type: String, default: 'Regular' },
  result: { type: String, default: '' },
  activities: { type: String, default: '' },
  serialNo: { type: Number, default: 0 },
  batchSlNo: { type: Number, default: 0 },
  deptSlNo: { type: Number, default: 0 },
  merit: { type: String, default: '' },
  studentType: { type: String, default: 'Graduate' },
  currentJob: { type: String, default: '' },
  currentLocation: { type: String, default: '' },
  address: { type: String, default: '' },
  remarks: { type: String, default: '' }
}, {
  timestamps: true
});

export const Student = mongoose.models.Student || mongoose.model('Student', studentSchema);
