import mongoose from 'mongoose';
import { Teacher } from '../server/models/Teacher.js';
import { INITIAL_TEACHERS } from '../src/data/teachersData.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://megasonic298_db_user:JiL9RSbbYUbUaxgP@cluster0.4blztie.mongodb.net/rtec_alumni?retryWrites=true&w=majority&appName=Cluster0';

async function seedTeachers() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
    console.log('Connected to MongoDB Atlas successfully.');

    console.log('Clearing old teachers collection...');
    const delRes = await Teacher.deleteMany({});
    console.log(`Deleted ${delRes.deletedCount} old teacher records.`);

    console.log(`Inserting ${INITIAL_TEACHERS.length} official RTEC teachers & officers...`);
    const insertRes = await Teacher.insertMany(INITIAL_TEACHERS);
    console.log(`Successfully inserted ${insertRes.length} official teachers!`);

    const teachersInDb = await Teacher.find({}).sort({ order: 1 }).lean();
    console.log('\n--- VERIFICATION OF SEEDED TEACHERS ---');
    teachersInDb.forEach((t, i) => {
      console.log(`${i + 1}. [Order: ${t.order}] ${t.nameBn} (${t.name}) - ${t.designationBn} - Phone: ${t.phone || t.mobile} - Office: ${t.officeRoom || t.office}`);
    });

    await mongoose.disconnect();
    console.log('MongoDB connection closed.');
  } catch (err) {
    console.error('Error seeding teachers to MongoDB:', err);
    process.exit(1);
  }
}

seedTeachers();
