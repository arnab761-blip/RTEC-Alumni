import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { Student } from './models/Student.js';
import { User } from './models/User.js';
import { Alumni } from './models/Alumni.js';
import { Teacher } from './models/Teacher.js';
import { Event } from './models/Event.js';
import { Job } from './models/Job.js';
import { News } from './models/News.js';
import { Submission } from './models/Submission.js';
import { Dispute } from './models/Dispute.js';
import { AdminEmail } from './models/AdminEmail.js';
import { SiteSetting } from './models/SiteSetting.js';
import fs from 'fs';
import {
  masterExcelPath,
  publicExcelPath,
  readStudentsFromExcel,
  writeStudentsToExcel,
  startExcelWatcher
} from './excelSync.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://megasonic298_db_user:JiL9RSbbYUbUaxgP@cluster0.4blztie.mongodb.net/rtec_alumni?retryWrites=true&w=majority&appName=Cluster0';

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

let isDbConnected = false;
let dbConnectionError = null;
let isWritingExcel = false;

// Helper: Syncs current MongoDB students to master Excel file on disk
const syncDbStudentsToExcel = async () => {
  try {
    const allStudents = await Student.find({}).sort({ serialNo: 1, regNo: 1 }).lean();
    if (allStudents.length > 0) {
      isWritingExcel = true;
      writeStudentsToExcel(allStudents);
      console.log(`[Excel Sync] ✓ Auto-synced ${allStudents.length} students to Master Excel file.`);
      setTimeout(() => { isWritingExcel = false; }, 2500);
    }
  } catch (err) {
    console.error('[Excel Sync] Error syncing to Excel:', err.message);
  }
};

const connectToMongoDB = async () => {
  try {
    console.log('[MongoDB] Connecting to MongoDB Atlas Cluster...');
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    isDbConnected = true;
    dbConnectionError = null;
    console.log(`[MongoDB] ✓ Connected to database: "${mongoose.connection.name}" at host: ${mongoose.connection.host}`);

    // Auto-seed from master Excel if collection is empty
    const studentsCount = await Student.countDocuments();
    if (studentsCount === 0 && fs.existsSync(masterExcelPath)) {
      console.log('[Bootstrap] Database has 0 students. Seeding 109 students from Master Excel...');
      const initialStudents = readStudentsFromExcel(masterExcelPath);
      const bulkOps = initialStudents.map(s => ({
        updateOne: {
          filter: { regNo: s.regNo },
          update: { $set: s },
          upsert: true
        }
      }));
      await Student.bulkWrite(bulkOps, { ordered: false });
      console.log(`[Bootstrap] ✓ Successfully seeded ${initialStudents.length} 1st-batch students into MongoDB!`);
    } else if (studentsCount > 0) {
      await syncDbStudentsToExcel();
    }

    // Start 2-way Excel File Watcher
    startExcelWatcher(async (updatedList) => {
      if (isWritingExcel) return;
      console.log(`[Excel 2-Way Sync] Detected external change in Excel! Syncing ${updatedList.length} students to MongoDB...`);
      const bulkOps = updatedList.map(s => ({
        updateOne: {
          filter: { regNo: s.regNo },
          update: { $set: s },
          upsert: true
        }
      }));
      if (bulkOps.length > 0) {
        await Student.bulkWrite(bulkOps, { ordered: false });
        console.log(`[Excel 2-Way Sync] ✓ Database updated successfully from Excel file.`);
      }
    });

  } catch (err) {
    isDbConnected = false;
    dbConnectionError = err.message;
    console.error('[MongoDB] ✗ Connection error:', err.message);
  }
};

connectToMongoDB();

mongoose.connection.on('disconnected', () => {
  isDbConnected = false;
  console.log('[MongoDB] Disconnected from Atlas.');
});

mongoose.connection.on('reconnected', () => {
  isDbConnected = true;
  dbConnectionError = null;
  console.log('[MongoDB] Reconnected to Atlas.');
});

// Middleware helper
const requireDb = (req, res, next) => {
  if (!isDbConnected) {
    return res.status(503).json({
      success: false,
      error: 'MongoDB Atlas is currently disconnected.',
      details: dbConnectionError
    });
  }
  next();
};

// ==========================================================
// 1. HEALTH CHECK & STATS
// ==========================================================
app.get('/api/health', async (req, res) => {
  const readyState = mongoose.connection.readyState;
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  
  let stats = {};
  if (isDbConnected) {
    try {
      const [studentsCount, alumniCount, teachersCount, eventsCount, jobsCount, usersCount] = await Promise.all([
        Student.countDocuments(),
        Alumni.countDocuments(),
        Teacher.countDocuments(),
        Event.countDocuments(),
        Job.countDocuments(),
        User.countDocuments()
      ]);
      stats = {
        students: studentsCount,
        alumni: alumniCount,
        teachers: teachersCount,
        events: eventsCount,
        jobs: jobsCount,
        users: usersCount
      };
    } catch (e) {}
  }

  res.json({
    status: isDbConnected ? 'connected' : 'disconnected',
    readyState: states[readyState] || 'unknown',
    database: isDbConnected ? mongoose.connection.name : null,
    host: isDbConnected ? mongoose.connection.host : null,
    error: dbConnectionError,
    stats,
    timestamp: new Date().toISOString()
  });
});

app.post('/api/retry-connection', async (req, res) => {
  await connectToMongoDB();
  res.json({
    status: isDbConnected ? 'connected' : 'disconnected',
    error: dbConnectionError
  });
});

const SUPER_ADMIN_EMAILS = ['megasonic298@gmail.com', 'arnab.rts761@gmail.com'];

// ==========================================================
// 2. BOOTSTRAP ENDPOINT: Sync all live collections on load
// ==========================================================
app.get('/api/bootstrap', requireDb, async (req, res) => {
  try {
    // Ensure both primary super admins exist
    for (const superEmail of SUPER_ADMIN_EMAILS) {
      await AdminEmail.findOneAndUpdate(
        { email: superEmail },
        { $setOnInsert: { email: superEmail, addedBy: 'system', note: 'Super Administrator' } },
        { upsert: true }
      );
    }

    const [students, alumni, teachers, events, jobs, news, submissions, disputes, adminEmailDocs, settingsDocs] = await Promise.all([
      Student.find({}).sort({ batch: 1, regNo: 1 }).lean(),
      Alumni.find({}).sort({ batch: 1, name: 1 }).lean(),
      Teacher.find({}).sort({ order: 1 }).lean(),
      Event.find({}).sort({ createdAt: -1 }).lean(),
      Job.find({}).sort({ createdAt: -1 }).lean(),
      News.find({}).sort({ isPinned: -1, createdAt: -1 }).lean(),
      Submission.find({}).sort({ createdAt: -1 }).lean(),
      Dispute.find({}).sort({ createdAt: -1 }).lean(),
      AdminEmail.find({}).lean(),
      SiteSetting.find({}).lean()
    ]);

    const settingsMap = {};
    (settingsDocs || []).forEach(s => { settingsMap[s.key] = s.value; });

    const adminEmails = Array.from(new Set([
      ...SUPER_ADMIN_EMAILS,
      ...adminEmailDocs.map(a => a.email.toLowerCase().trim())
    ]));

    res.json({
      success: true,
      data: {
        students,
        alumni,
        teachers,
        events,
        jobs,
        news,
        submissions,
        disputes,
        adminEmails,
        contact: settingsMap['footerContact'] || null,
        settings: settingsMap
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================================
// 3. AUTH & USER MANAGEMENT
// ==========================================================
app.post('/api/auth/sync', requireDb, async (req, res) => {
  try {
    const userData = req.body;
    if (!userData.email) {
      return res.status(400).json({ success: false, error: 'Email is required' });
    }
    const user = await User.findOneAndUpdate(
      { email: userData.email.toLowerCase().trim() },
      { 
        $set: {
          ...userData,
          id: userData.id || `usr-${Date.now()}`,
          lastLoginAt: new Date()
        } 
      },
      { new: true, upsert: true }
    );
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/users', requireDb, async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 }).lean();
    res.json({ success: true, count: users.length, users });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================================
// 4. STUDENTS CRUD & 1-CLICK BULK IMPORT (WITH LIVE 2-WAY EXCEL SYNC)
// ==========================================================
app.get('/api/students', requireDb, async (req, res) => {
  try {
    const students = await Student.find({}).sort({ serialNo: 1, batch: 1, regNo: 1 }).lean();
    res.json({ success: true, count: students.length, students });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Download latest Master Excel file
app.get('/api/students/excel/export', async (req, res) => {
  try {
    if (isDbConnected) {
      await syncDbStudentsToExcel();
    }
    if (!fs.existsSync(masterExcelPath)) {
      return res.status(404).json({ success: false, error: 'Excel file not found on server.' });
    }
    res.download(masterExcelPath, 'RTEC_Students_Master.xlsx');
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Force sync from Excel file to MongoDB
app.post('/api/students/excel/sync', requireDb, async (req, res) => {
  try {
    if (!fs.existsSync(masterExcelPath)) {
      return res.status(404).json({ success: false, error: 'Master Excel file not found on server.' });
    }
    const studentsFromExcel = readStudentsFromExcel(masterExcelPath);
    const bulkOps = studentsFromExcel.map((s, idx) => ({
      updateOne: {
        filter: { regNo: s.regNo },
        update: { $set: s },
        upsert: true
      }
    }));
    const result = await Student.bulkWrite(bulkOps, { ordered: false });
    const allStudents = await Student.find({}).sort({ serialNo: 1, batch: 1, regNo: 1 }).lean();
    res.json({
      success: true,
      message: `Successfully synchronized ${studentsFromExcel.length} students from Excel file!`,
      upserted: result.upsertedCount,
      modified: result.modifiedCount,
      totalStudents: allStudents.length,
      students: allStudents
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/students', requireDb, async (req, res) => {
  try {
    const data = req.body;
    if (!data.name || !data.regNo || !data.batch) {
      return res.status(400).json({ success: false, error: 'Name, RegNo, and Batch are required.' });
    }
    const student = await Student.findOneAndUpdate(
      { regNo: String(data.regNo).trim() },
      { $set: data },
      { new: true, upsert: true }
    );

    // Auto-sync database changes to Excel file
    await syncDbStudentsToExcel();

    res.json({ success: true, student });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/students/bulk', requireDb, async (req, res) => {
  try {
    const { students } = req.body;
    if (!Array.isArray(students) || students.length === 0) {
      return res.status(400).json({ success: false, error: 'An array of students is required.' });
    }

    console.log(`[Bulk Import] Processing ${students.length} students from uploaded Excel...`);

    const bulkOps = students.map((s, idx) => {
      const regNo = String(s.regNo || '').trim();
      const studentId = s.id || `std-${Date.now()}-${idx}`;
      return {
        updateOne: {
          filter: { regNo },
          update: {
            $set: {
              id: studentId,
              serialNo: s.serialNo || idx + 1,
              deptSlNo: s.deptSlNo || 0,
              name: String(s.name || '').trim(),
              nameBn: String(s.nameBn || s.name || '').trim(),
              regNo,
              batch: String(s.batch || '').trim(),
              department: String(s.department || 'Yarn Engineering').trim(),
              deptBn: String(s.deptBn || '').trim(),
              session: String(s.session || '').trim(),
              year: String(s.year || '').trim(),
              bloodGroup: String(s.bloodGroup || '').trim().toUpperCase(),
              phone: String(s.phone || '').trim(),
              email: String(s.email || '').trim(),
              avatar: s.avatar || '',
              role: s.role || 'Student Member',
              status: s.status || s.result || 'Regular',
              result: s.result || 'Passed',
              remarks: s.remarks || '',
              activities: s.activities || ''
            }
          },
          upsert: true
        }
      };
    }).filter(op => op.updateOne.filter.regNo);

    const result = await Student.bulkWrite(bulkOps, { ordered: false });
    const totalCount = await Student.countDocuments();

    // Auto-sync database changes to Excel file
    await syncDbStudentsToExcel();

    res.json({
      success: true,
      message: `Successfully imported ${bulkOps.length} students into MongoDB!`,
      upserted: result.upsertedCount,
      modified: result.modifiedCount,
      totalStudentsInDb: totalCount
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/students/:id', requireDb, async (req, res) => {
  try {
    const { id } = req.params;
    await Student.findOneAndDelete({ $or: [{ id }, { regNo: id }, { _id: id }] });
    
    // Auto-sync database changes to Excel file
    await syncDbStudentsToExcel();

    res.json({ success: true, message: 'Student removed from database' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================================
// 5. ALUMNI CRUD
// ==========================================================
app.get('/api/alumni', requireDb, async (req, res) => {
  try {
    const alumni = await Alumni.find({}).sort({ batch: 1, name: 1 }).lean();
    res.json({ success: true, count: alumni.length, alumni });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/alumni', requireDb, async (req, res) => {
  try {
    const data = req.body;
    const alum = await Alumni.findOneAndUpdate(
      { id: data.id || `alm-${Date.now()}` },
      { $set: data },
      { new: true, upsert: true }
    );
    res.json({ success: true, alumni: alum });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/alumni/:id', requireDb, async (req, res) => {
  try {
    await Alumni.findOneAndDelete({ id: req.params.id });
    res.json({ success: true, message: 'Alumni removed' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================================
// 6. TEACHERS CRUD
// ==========================================================
app.get('/api/teachers', requireDb, async (req, res) => {
  try {
    const teachers = await Teacher.find({}).sort({ order: 1 }).lean();
    res.json({ success: true, count: teachers.length, teachers });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/teachers', requireDb, async (req, res) => {
  try {
    const data = req.body;
    const teacher = await Teacher.findOneAndUpdate(
      { id: data.id || `tch-${Date.now()}` },
      { $set: data },
      { new: true, upsert: true }
    );
    res.json({ success: true, teacher });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/teachers/:id', requireDb, async (req, res) => {
  try {
    await Teacher.findOneAndDelete({ id: req.params.id });
    res.json({ success: true, message: 'Teacher removed' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================================
// 7. EVENTS CRUD
// ==========================================================
app.get('/api/events', requireDb, async (req, res) => {
  try {
    const events = await Event.find({}).sort({ createdAt: -1 }).lean();
    res.json({ success: true, count: events.length, events });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/events', requireDb, async (req, res) => {
  try {
    const data = req.body;
    const event = await Event.findOneAndUpdate(
      { id: data.id || `evt-${Date.now()}` },
      { $set: data },
      { new: true, upsert: true }
    );
    res.json({ success: true, event });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/events/:id', requireDb, async (req, res) => {
  try {
    await Event.findOneAndDelete({ id: req.params.id });
    res.json({ success: true, message: 'Event removed' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================================
// 8. JOBS CRUD
// ==========================================================
app.get('/api/jobs', requireDb, async (req, res) => {
  try {
    const jobs = await Job.find({}).sort({ createdAt: -1 }).lean();
    res.json({ success: true, count: jobs.length, jobs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/jobs', requireDb, async (req, res) => {
  try {
    const data = req.body;
    const job = await Job.findOneAndUpdate(
      { id: data.id || `job-${Date.now()}` },
      { $set: data },
      { new: true, upsert: true }
    );
    res.json({ success: true, job });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/jobs/:id', requireDb, async (req, res) => {
  try {
    await Job.findOneAndDelete({ id: req.params.id });
    res.json({ success: true, message: 'Job removed' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================================
// 9. NEWS & NOTICES CRUD
// ==========================================================
app.get('/api/news', requireDb, async (req, res) => {
  try {
    const news = await News.find({}).sort({ isPinned: -1, createdAt: -1 }).lean();
    res.json({ success: true, count: news.length, news });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/news', requireDb, async (req, res) => {
  try {
    const data = req.body;
    const item = await News.findOneAndUpdate(
      { id: data.id || `news-${Date.now()}` },
      { $set: data },
      { new: true, upsert: true }
    );
    res.json({ success: true, news: item });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/news/:id', requireDb, async (req, res) => {
  try {
    await News.findOneAndDelete({ id: req.params.id });
    res.json({ success: true, message: 'News removed' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================================
// 10. STUDENT SUBMISSIONS & APPLICATIONS
// ==========================================================
app.get('/api/submissions', requireDb, async (req, res) => {
  try {
    const subs = await Submission.find({}).sort({ createdAt: -1 }).lean();
    res.json({ success: true, count: subs.length, submissions: subs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/submissions', requireDb, async (req, res) => {
  try {
    const data = req.body || {};
    const subId = data.id || `sub-${Date.now()}`;
    const cleanReg = data.regNo ? String(data.regNo).trim() : '';
    const cleanEmail = data.email ? String(data.email).trim().toLowerCase() : '';

    // Enforce "One Registration Number = One Verified Gmail" on submission creation/updates
    if (cleanReg) {
      const escapedReg = cleanReg.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regRegex = new RegExp(`^${escapedReg}$`, 'i');

      const claimedStudent = await Student.findOne({ regNo: regRegex }).lean();
      if (claimedStudent && claimedStudent.email && claimedStudent.email.trim() !== '') {
        const ownerEmail = claimedStudent.email.trim().toLowerCase();
        if (!cleanEmail || ownerEmail !== cleanEmail) {
          return res.status(409).json({
            success: false,
            error: 'Registration number is already claimed by another verified account.'
          });
        }
      }

      const existingSub = await Submission.findOne({
        regNo: regRegex,
        id: { $ne: subId },
        status: { $ne: 'declined' }
      }).lean();
      if (existingSub && existingSub.email && existingSub.email.trim() !== '') {
        const subOwner = existingSub.email.trim().toLowerCase();
        if (!cleanEmail || subOwner !== cleanEmail) {
          return res.status(409).json({
            success: false,
            error: 'Registration number already has an active submission under another email.'
          });
        }
      }
    }

    const sub = await Submission.findOneAndUpdate(
      { id: subId },
      { $set: data },
      { new: true, upsert: true }
    );
    res.json({ success: true, submission: sub });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/submissions/:id', requireDb, async (req, res) => {
  try {
    await Submission.findOneAndDelete({ id: req.params.id });
    res.json({ success: true, message: 'Submission removed' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================================
// 11. ID DISPUTES & COMPLAINTS
// ==========================================================
app.get('/api/disputes', requireDb, async (req, res) => {
  try {
    const disputes = await Dispute.find({}).sort({ createdAt: -1 }).lean();
    res.json({ success: true, count: disputes.length, disputes });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/disputes', requireDb, async (req, res) => {
  try {
    const data = req.body;
    if (!data.regNo || !data.description) {
      return res.status(400).json({ success: false, error: 'Registration number and description are required.' });
    }
    const item = await Dispute.findOneAndUpdate(
      { id: data.id || `disp-${Date.now()}` },
      { $set: data },
      { new: true, upsert: true }
    );
    res.json({ success: true, dispute: item });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/disputes/:id', requireDb, async (req, res) => {
  try {
    await Dispute.findOneAndDelete({ id: req.params.id });
    res.json({ success: true, message: 'Dispute removed' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 1-Click Reset Registration: Admin clears imposter submission and frees the regNo
app.post('/api/disputes/reset-reg', requireDb, async (req, res) => {
  try {
    const { regNo, disputeId } = req.body;
    if (!regNo) {
      return res.status(400).json({ success: false, error: 'Registration number is required.' });
    }

    const cleanReg = String(regNo).trim();

    // 1. Remove all imposter submissions for this regNo
    const delSubResult = await Submission.deleteMany({ regNo: cleanReg });

    // 2. Clear phone, email, avatar from Student record so the real student can claim it cleanly
    await Student.updateMany(
      { regNo: cleanReg },
      { $set: { phone: '', email: '', avatar: '', activities: '' } }
    );

    // Auto-sync cleared data to Excel
    await syncDbStudentsToExcel();

    // 3. Mark dispute as resolved
    if (disputeId) {
      await Dispute.findOneAndUpdate(
        { id: disputeId },
        { $set: { status: 'resolved', resolvedAt: new Date(), actionTaken: 'Registration freed and imposter data wiped' } }
      );
    }

    res.json({
      success: true,
      message: `Registration ${cleanReg} successfully reset. Submissions deleted: ${delSubResult.deletedCount}`
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================================
// 12. ADMIN EMAILS MANAGEMENT
// ==========================================================
app.get('/api/admin-emails', requireDb, async (req, res) => {
  try {
    const docs = await AdminEmail.find({}).sort({ createdAt: 1 }).lean();
    const emails = Array.from(new Set([
      ...SUPER_ADMIN_EMAILS,
      ...docs.map(d => d.email.toLowerCase().trim())
    ]));
    res.json({ success: true, adminEmails: emails, list: docs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/admin-emails', requireDb, async (req, res) => {
  try {
    const { email, addedBy, note } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: 'Email is required' });
    }
    const cleanEmail = email.toLowerCase().trim();
    const doc = await AdminEmail.findOneAndUpdate(
      { email: cleanEmail },
      { $set: { email: cleanEmail, addedBy: addedBy || 'megasonic298@gmail.com', note: note || 'Administrator' } },
      { upsert: true, new: true }
    );
    res.json({ success: true, adminEmail: doc });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/admin-emails/:email', requireDb, async (req, res) => {
  try {
    const emailToDelete = req.params.email.toLowerCase().trim();
    if (SUPER_ADMIN_EMAILS.includes(emailToDelete)) {
      return res.status(403).json({ success: false, error: 'Cannot remove super admin email' });
    }
    await AdminEmail.findOneAndDelete({ email: emailToDelete });
    res.json({ success: true, message: `Removed ${emailToDelete} from admin emails` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================================
// 12. SITE SETTINGS & FOOTER CONTACT MANAGEMENT
// ==========================================================
app.get('/api/settings/contact', requireDb, async (req, res) => {
  try {
    const doc = await SiteSetting.findOne({ key: 'footerContact' }).lean();
    res.json({ success: true, contact: doc?.value || null });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/settings/contact', requireDb, async (req, res) => {
  try {
    const contactData = req.body;
    const doc = await SiteSetting.findOneAndUpdate(
      { key: 'footerContact' },
      { $set: { key: 'footerContact', value: contactData } },
      { upsert: true, new: true }
    );
    res.json({ success: true, contact: doc.value });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`[RTEC API Server] Running on http://localhost:${PORT}`);
});
