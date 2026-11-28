import mongoose from 'mongoose';

const visitorLogSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, index: true },
  visitorId: { type: String, required: true, index: true },
  isLoggedIn: { type: Boolean, default: false, index: true },
  userId: { type: String, default: '' },
  userName: { type: String, default: 'Guest Visitor' },
  userEmail: { type: String, default: '' },
  userRole: { type: String, default: 'Guest' },
  page: { type: String, default: '/', index: true },
  pageTitle: { type: String, default: '' },
  device: { type: String, default: 'Desktop' },
  browser: { type: String, default: 'Browser' },
  referrer: { type: String, default: '' },
  durationSeconds: { type: Number, default: 0 },
  startTime: { type: Date, default: Date.now, index: true },
  lastActive: { type: Date, default: Date.now, index: true }
}, {
  timestamps: true
});

// TTL index to automatically keep DB clean and fast (auto-purge after 90 days)
visitorLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

export const VisitorLog = mongoose.models.VisitorLog || mongoose.model('VisitorLog', visitorLogSchema);
