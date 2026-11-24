import mongoose from 'mongoose';
import { Student } from '../server/models/Student.js';

const uri = 'mongodb+srv://megasonic298_db_user:JiL9RSbbYUbUaxgP@cluster0.4blztie.mongodb.net/rtec_alumni?retryWrites=true&w=majority&appName=Cluster0';

async function verify() {
  await mongoose.connect(uri);
  const total = await Student.countDocuments();
  console.log(`Total Students in MongoDB: ${total}`);

  const batchCounts = await Student.aggregate([
    { $group: { _id: '$batch', count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ]);
  console.log('Batch Counts:', batchCounts);

  const deptCounts = await Student.aggregate([
    { $group: { _id: { batch: '$batch', dept: '$department' }, count: { $sum: 1 } } },
    { $sort: { '_id.batch': 1, '_id.dept': 1 } }
  ]);
  console.log('Batch & Department Counts:');
  console.table(deptCounts.map(d => ({ batch: d._id.batch, dept: d._id.dept, count: d.count })));

  const studentTypeCounts = await Student.aggregate([
    { $group: { _id: '$studentType', count: { $sum: 1 } } }
  ]);
  console.log('Student Type Counts:', studentTypeCounts);

  process.exit(0);
}

verify().catch(err => {
  console.error(err);
  process.exit(1);
});
