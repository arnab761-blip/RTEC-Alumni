import mongoose from 'mongoose';

const AdminEmailSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    addedBy: { type: String, default: 'megasonic298@gmail.com' },
    note: { type: String, default: 'Administrator' }
  },
  { timestamps: true }
);

export const AdminEmail = mongoose.model('AdminEmail', AdminEmailSchema);
