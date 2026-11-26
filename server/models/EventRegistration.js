import mongoose from 'mongoose';

const EventRegistrationSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    eventId: { type: String, required: true, index: true },
    eventTitle: { type: String, default: 'RTEC Event' },
    eventTitleBn: { type: String, default: 'আরটেক ইভেন্ট' },
    date: { type: String, default: '' },
    venue: { type: String, default: 'RTEC Campus' },
    venueBn: { type: String, default: 'আরটেক ক্যাম্পাস' },
    token: { type: String, required: true },
    attendeeName: { type: String, required: true, trim: true },
    attendeeEmail: { type: String, default: '', lowercase: true, trim: true },
    phone: { type: String, default: '' },
    batch: { type: String, default: '' },
    tshirt: { type: String, default: 'L' },
    guests: { type: String, default: '0' },
    registeredAt: { type: String, default: '' }
  },
  { timestamps: true }
);

export const EventRegistration = mongoose.model('EventRegistration', EventRegistrationSchema);
