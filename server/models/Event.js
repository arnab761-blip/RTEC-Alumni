import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true, trim: true },
    titleBn: { type: String, default: '' },
    description: { type: String, default: '' },
    descriptionBn: { type: String, default: '' },
    date: { type: String, default: '' },
    time: { type: String, default: '' },
    location: { type: String, default: 'Campus Auditorium, RTEC' },
    locationBn: { type: String, default: 'ক্যাম্পাস অডিটোরিয়াম, আরটিইসি' },
    category: { type: String, default: 'General' },
    image: { type: String, default: '' },
    seatsTotal: { type: Number, default: 200 },
    seatsRegistered: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const Event = mongoose.model('Event', EventSchema);
