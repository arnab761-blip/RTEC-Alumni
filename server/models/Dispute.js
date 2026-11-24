import mongoose from 'mongoose';

const DisputeSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    regNo: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, default: '', lowercase: true, trim: true },
    phone: { type: String, default: '', trim: true },
    description: { type: String, required: true },
    status: { type: String, default: 'pending' }, // 'pending' | 'resolved' | 'dismissed'
    actionTaken: { type: String, default: '' },
    resolvedAt: { type: Date }
  },
  { timestamps: true }
);

DisputeSchema.index({ regNo: 1 });

export const Dispute = mongoose.model('Dispute', DisputeSchema);
