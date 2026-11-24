import mongoose from 'mongoose';
import { Student } from '../server/models/Student.js';
import { readStudentsFromExcel, masterExcelPath } from '../server/excelSync.js';

const uri = 'mongodb+srv://megasonic298_db_user:JiL9RSbbYUbUaxgP@cluster0.4blztie.mongodb.net/rtec_alumni?retryWrites=true&w=majority&appName=Cluster0';

async function seed() {
  console.log('Connecting to Atlas...');
  await mongoose.connect(uri);
  console.log('Connected! Reading students from Master Excel...');
  const students = readStudentsFromExcel(masterExcelPath);
  console.log(`Found ${students.length} students in Master Excel. Seeding into MongoDB...`);

  const bulkOps = students.map((s) => ({
    updateOne: {
      filter: { regNo: s.regNo },
      update: { $set: s },
      upsert: true
    }
  }));

  const result = await Student.bulkWrite(bulkOps, { ordered: false });
  const totalInDb = await Student.countDocuments();
  console.log('Seeding successful! Total in MongoDB:', totalInDb);
  console.log('Upserted:', result.upsertedCount, 'Modified:', result.modifiedCount);
  process.exit(0);
}

seed().catch(err => {
  console.error('Seeding error:', err);
  process.exit(1);
});
