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
import { ForumPost } from './models/ForumPost.js';
import { Memory } from './models/Memory.js';
import { ContactMessage } from './models/ContactMessage.js';
import { MentorshipRequest } from './models/MentorshipRequest.js';
import { EventRegistration } from './models/EventRegistration.js';
import { JobApplication } from './models/JobApplication.js';
import { VisitorLog } from './models/VisitorLog.js';
import fs from 'fs';
import crypto from 'crypto';
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

// Process-level resilience guards so transient async/file-system glitches don't crash the Node server
process.on('uncaughtException', (err) => {
  console.error('[Process] Uncaught Exception:', err?.message || err);
});
process.on('unhandledRejection', (reason) => {
  console.error('[Process] Unhandled Rejection:', reason);
});

app.use(cors({
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
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

    // Start 2-way Excel File Watcher in local dev (disabled on cloud containers unless explicitly enabled)
    if (process.env.NODE_ENV !== 'production' || process.env.ENABLE_EXCEL_WATCH === 'true') {
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
    }

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

// Root endpoint for Render & UptimeRobot ping
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'RTEC Alumni Backend API',
    database: isDbConnected ? 'connected' : 'connecting',
    uptimeSeconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

// ==========================================================
// 1. HEALTH CHECK & STATS
// ==========================================================
app.get('/api/health', async (req, res) => {
  const readyState = mongoose.connection.readyState;
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  
  let stats = {};
  if (isDbConnected) {
    try {
      const [studentsCount, alumniCount, teachersCount, eventsCount, jobsCount, usersCount, forumCount, contactsCount, mentorshipCount, eventRegsCount, jobAppsCount] = await Promise.all([
        Student.countDocuments(),
        Alumni.countDocuments(),
        Teacher.countDocuments(),
        Event.countDocuments(),
        Job.countDocuments(),
        User.countDocuments(),
        ForumPost.countDocuments(),
        ContactMessage.countDocuments(),
        MentorshipRequest.countDocuments(),
        EventRegistration.countDocuments(),
        JobApplication.countDocuments()
      ]);
      stats = {
        students: studentsCount,
        alumni: alumniCount,
        teachers: teachersCount,
        events: eventsCount,
        jobs: jobsCount,
        users: usersCount,
        forumPosts: forumCount,
        contacts: contactsCount,
        mentorshipRequests: mentorshipCount,
        eventRegistrations: eventRegsCount,
        jobApplications: jobAppsCount
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
    uptimeSeconds: Math.round(process.uptime()),
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

    const [students, alumni, teachers, events, jobs, news, submissions, disputes, adminEmailDocs, settingsDocs, forumPosts, memories, contacts, mentorshipRequests, eventRegistrations, jobApplications] = await Promise.all([
      Student.find({}).sort({ serialNo: 1, batch: 1, regNo: 1 }).lean(),
      Alumni.find({}).sort({ batch: 1, name: 1 }).lean(),
      Teacher.find({}).sort({ order: 1 }).lean(),
      Event.find({}).sort({ createdAt: -1 }).lean(),
      Job.find({}).sort({ createdAt: -1 }).lean(),
      News.find({}).sort({ isPinned: -1, createdAt: -1 }).lean(),
      Submission.find({}).sort({ createdAt: -1 }).lean(),
      Dispute.find({}).sort({ createdAt: -1 }).lean(),
      AdminEmail.find({}).lean(),
      SiteSetting.find({}).lean(),
      ForumPost.find({}).sort({ createdAt: -1 }).lean(),
      Memory.find({}).sort({ createdAt: -1 }).lean(),
      ContactMessage.find({}).sort({ createdAt: -1 }).lean(),
      MentorshipRequest.find({}).sort({ createdAt: -1 }).lean(),
      EventRegistration.find({}).sort({ createdAt: -1 }).lean(),
      JobApplication.find({}).sort({ createdAt: -1 }).lean()
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
        forumPosts,
        memories,
        contacts,
        mentorshipRequests,
        eventRegistrations,
        jobApplications,
        adminEmails,
        contact: settingsMap['footerContact'] || null,
        collegeLogo: settingsMap['collegeLogo'] || null,
        googleClientId: settingsMap['googleClientId'] || null,
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
// 9B. FORUM POSTS & EXPERIENCE SHARE
// ==========================================================
app.get('/api/forum', requireDb, async (req, res) => {
  try {
    const posts = await ForumPost.find({}).sort({ createdAt: -1 }).lean();
    res.json({ success: true, count: posts.length, forumPosts: posts });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/forum', requireDb, async (req, res) => {
  try {
    const data = req.body;
    const post = await ForumPost.findOneAndUpdate(
      { id: data.id || `frm-${Date.now()}` },
      { $set: data },
      { new: true, upsert: true }
    );
    res.json({ success: true, post });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/forum/:id', requireDb, async (req, res) => {
  try {
    await ForumPost.findOneAndDelete({ id: req.params.id });
    res.json({ success: true, message: 'Forum post removed' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================================
// 9C. GALLERY MEMORIES
// ==========================================================
app.get('/api/memories', requireDb, async (req, res) => {
  try {
    const list = await Memory.find({}).sort({ createdAt: -1 }).lean();
    res.json({ success: true, count: list.length, memories: list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/memories', requireDb, async (req, res) => {
  try {
    const data = req.body;
    const item = await Memory.findOneAndUpdate(
      { id: data.id || `mem-${Date.now()}` },
      { $set: data },
      { new: true, upsert: true }
    );
    res.json({ success: true, memory: item });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/memories/:id', requireDb, async (req, res) => {
  try {
    await Memory.findOneAndDelete({ id: req.params.id });
    res.json({ success: true, message: 'Memory removed' });
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
    const escapedReg = cleanReg.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regRegex = new RegExp(`^${escapedReg}$`, 'i');

    // 1. Remove all imposter/erroneous submissions for this regNo
    const delSubResult = await Submission.deleteMany({ regNo: regRegex });

    // 2. Clear all user-claimed/edited fields from Student record so it resets to Empty/Unclaimed/Unset
    await Student.updateMany(
      { regNo: regRegex },
      {
        $set: {
          phone: '',
          email: '',
          avatar: '',
          bloodGroup: '',
          activities: '',
          currentJob: '',
          designation: '',
          company: '',
          jobSector: '',
          workLocation: '',
          experienceYears: '',
          linkedin: '',
          currentLocation: '',
          address: ''
        }
      }
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

// Generic Key-Value Settings (collegeLogo, googleClientId, etc.)
app.post('/api/settings/kv', requireDb, async (req, res) => {
  try {
    const { key, value } = req.body || {};
    if (!key) return res.status(400).json({ success: false, error: 'Setting key is required' });
    const doc = await SiteSetting.findOneAndUpdate(
      { key: String(key) },
      { $set: { key: String(key), value } },
      { upsert: true, new: true }
    );
    res.json({ success: true, setting: doc });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================================
// 13. CONTACT INQUIRIES & ALUMNI MESSAGES
// ==========================================================
app.get('/api/contacts', requireDb, async (req, res) => {
  try {
    const contacts = await ContactMessage.find({}).sort({ createdAt: -1 }).lean();
    res.json({ success: true, count: contacts.length, contacts });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/contacts', requireDb, async (req, res) => {
  try {
    const data = req.body || {};
    if (!data.id && (!data.name || !data.message)) {
      return res.status(400).json({ success: false, error: 'Name and message are required' });
    }
    const item = await ContactMessage.findOneAndUpdate(
      { id: data.id || `cnt-${Date.now()}` },
      { $set: data },
      { new: true, upsert: true }
    );
    res.json({ success: true, contact: item });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/contacts/:id', requireDb, async (req, res) => {
  try {
    await ContactMessage.findOneAndDelete({ id: req.params.id });
    res.json({ success: true, message: 'Contact message removed' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================================
// 14. MENTORSHIP BOOKINGS & REQUESTS
// ==========================================================
app.get('/api/mentorship', requireDb, async (req, res) => {
  try {
    const requests = await MentorshipRequest.find({}).sort({ createdAt: -1 }).lean();
    res.json({ success: true, count: requests.length, mentorshipRequests: requests });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/mentorship', requireDb, async (req, res) => {
  try {
    const data = req.body || {};
    if (!data.id && (!data.studentName || !data.studentEmail)) {
      return res.status(400).json({ success: false, error: 'Student name and email are required' });
    }
    const item = await MentorshipRequest.findOneAndUpdate(
      { id: data.id || `mnt-${Date.now()}` },
      { $set: data },
      { new: true, upsert: true }
    );
    res.json({ success: true, mentorshipRequest: item });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/mentorship/:id', requireDb, async (req, res) => {
  try {
    await MentorshipRequest.findOneAndDelete({ id: req.params.id });
    res.json({ success: true, message: 'Mentorship request removed' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================================
// 15. EVENT PASS REGISTRATIONS
// ==========================================================
app.get('/api/event-registrations', requireDb, async (req, res) => {
  try {
    const registrations = await EventRegistration.find({}).sort({ createdAt: -1 }).lean();
    res.json({ success: true, count: registrations.length, eventRegistrations: registrations });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/event-registrations', requireDb, async (req, res) => {
  try {
    const data = req.body || {};
    if (!data.eventId || !data.attendeeName) {
      return res.status(400).json({ success: false, error: 'Event ID and attendee name are required' });
    }
    const item = await EventRegistration.findOneAndUpdate(
      { id: data.id || `reg-${Date.now()}` },
      { $set: data },
      { new: true, upsert: true }
    );
    res.json({ success: true, registration: item });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/event-registrations/:id', requireDb, async (req, res) => {
  try {
    await EventRegistration.findOneAndDelete({ id: req.params.id });
    res.json({ success: true, message: 'Event registration removed' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================================
// 16. JOB APPLICATIONS
// ==========================================================
app.get('/api/job-applications', requireDb, async (req, res) => {
  try {
    const applications = await JobApplication.find({}).sort({ createdAt: -1 }).lean();
    res.json({ success: true, count: applications.length, jobApplications: applications });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/job-applications', requireDb, async (req, res) => {
  try {
    const data = req.body || {};
    if (!data.jobId || !data.applicantName) {
      return res.status(400).json({ success: false, error: 'Job ID and applicant name are required' });
    }
    const item = await JobApplication.findOneAndUpdate(
      { id: data.id || `app-${Date.now()}` },
      { $set: data },
      { new: true, upsert: true }
    );
    res.json({ success: true, jobApplication: item });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/job-applications/:id', requireDb, async (req, res) => {
  try {
    await JobApplication.findOneAndDelete({ id: req.params.id });
    res.json({ success: true, message: 'Job application removed' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================================
// 17. CLOUDINARY SIGNED UPLOAD SIGNATURE
// ==========================================================
app.post('/api/cloudinary-signature', (req, res) => {
  const cloudName = (process.env.CLOUDINARY_CLOUD_NAME || '').trim();
  const apiKey = (process.env.CLOUDINARY_API_KEY || '').trim();
  const apiSecret = (process.env.CLOUDINARY_API_SECRET || '').trim();

  if (!cloudName || !apiKey || !apiSecret) {
    return res.status(503).json({
      success: false,
      error: 'Cloudinary credentials are not configured on the server.'
    });
  }

  const folder = String(req.body?.folder || 'rtec-alumni/students')
    .replace(/[^a-zA-Z0-9/_-]/g, '')
    .slice(0, 100) || 'rtec-alumni/students';
  const timestamp = Math.round(Date.now() / 1000);

  // Parameters must be signed in alphabetical order
  const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;
  const signature = crypto
    .createHash('sha1')
    .update(`${paramsToSign}${apiSecret}`)
    .digest('hex');

  res.json({
    success: true,
    cloudName,
    apiKey,
    timestamp,
    signature,
    folder
  });
});

// ==========================================
// 12. VISITOR ANALYTICS & ACTIVITY TRACKING
// ==========================================

// Lightweight non-blocking ping from frontend (navigator.sendBeacon / fetch)
app.post('/api/analytics/track', async (req, res) => {
  try {
    const {
      sessionId,
      visitorId,
      isLoggedIn,
      user,
      page,
      pageTitle,
      device,
      browser,
      referrer,
      durationSeconds
    } = req.body || {};

    if (!sessionId || !visitorId) {
      return res.status(200).json({ success: true, ignored: true });
    }

    const now = new Date();
    const update = {
      visitorId,
      page: String(page || '/').substring(0, 150),
      pageTitle: String(pageTitle || '').substring(0, 150),
      device: String(device || 'Desktop').substring(0, 30),
      browser: String(browser || 'Browser').substring(0, 40),
      referrer: String(referrer || '').substring(0, 200),
      lastActive: now
    };

    if (typeof durationSeconds === 'number' && durationSeconds >= 0) {
      update.durationSeconds = Math.min(Math.round(durationSeconds), 86400);
    }

    if (isLoggedIn && user && typeof user === 'object') {
      update.isLoggedIn = true;
      update.userId = String(user.id || user._id || '').substring(0, 60);
      update.userName = String(user.name || user.nameBn || user.email || 'Member').substring(0, 80);
      update.userEmail = String(user.email || '').toLowerCase().trim().substring(0, 100);
      update.userRole = String(user.role || 'Member').substring(0, 40);
    } else {
      update.isLoggedIn = false;
      update.userName = 'Guest Visitor';
      update.userRole = 'Guest';
    }

    if (mongoose.connection.readyState === 1) {
      await VisitorLog.findOneAndUpdate(
        { sessionId },
        { 
          $set: update,
          $setOnInsert: { startTime: now, createdAt: now }
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(200).json({ success: false, error: err.message });
  }
});

// Admin-only Analytics Stats & Visitor Activity Log
app.get('/api/analytics/stats', requireDb, async (req, res) => {
  try {
    const requesterEmail = String(req.headers['x-admin-email'] || req.query.adminEmail || '').toLowerCase().trim();
    
    // Check if requester is authorized admin
    const adminDocs = await AdminEmail.find({}).lean();
    const validEmails = new Set([
      'arnab.rts761@gmail.com',
      ...adminDocs.map(a => a.email.toLowerCase().trim())
    ]);

    if (!requesterEmail || !validEmails.has(requesterEmail)) {
      return res.status(403).json({ success: false, error: 'Unauthorized. Admin access required.' });
    }

    const now = new Date();
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    // Active Now (lastActive in last 5 mins)
    const activeNowCount = await VisitorLog.countDocuments({ lastActive: { $gte: fiveMinutesAgo } });

    // Today's total sessions
    const todayCount = await VisitorLog.countDocuments({ startTime: { $gte: twentyFourHoursAgo } });

    // 7 Days total sessions
    const weekCount = await VisitorLog.countDocuments({ startTime: { $gte: sevenDaysAgo } });

    // All time total
    const totalCount = await VisitorLog.countDocuments({});

    // Logged-in vs Guest breakdown (last 7 days or all time)
    const loggedInCount = await VisitorLog.countDocuments({ isLoggedIn: true, startTime: { $gte: sevenDaysAgo } });
    const guestCount = Math.max(0, weekCount - loggedInCount);

    // Average duration (sessions that stayed at least 2 seconds, up to 2 hours)
    const durationAgg = await VisitorLog.aggregate([
      { $match: { startTime: { $gte: sevenDaysAgo }, durationSeconds: { $gt: 2, $lt: 7200 } } },
      { $group: { _id: null, avgDuration: { $avg: '$durationSeconds' } } }
    ]);
    const avgDurationSeconds = Math.round(durationAgg[0]?.avgDuration || 0);

    // Top pages visited (last 7 days)
    const topPagesAgg = await VisitorLog.aggregate([
      { $match: { startTime: { $gte: sevenDaysAgo } } },
      { $group: { _id: '$page', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 }
    ]);
    const topPages = topPagesAgg.map(p => ({ page: p._id || '/', count: p.count }));

    // Device breakdown
    const devicesAgg = await VisitorLog.aggregate([
      { $match: { startTime: { $gte: sevenDaysAgo } } },
      { $group: { _id: '$device', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    const devices = devicesAgg.map(d => ({ device: d._id || 'Desktop', count: d.count }));

    // Recent 50 visitor activity logs
    const recentLogs = await VisitorLog.find({})
      .sort({ lastActive: -1 })
      .limit(50)
      .lean();

    res.json({
      success: true,
      stats: {
        activeNow: activeNowCount,
        todayCount,
        weekCount,
        totalCount,
        loggedInCount,
        guestCount,
        avgDurationSeconds,
        topPages,
        devices
      },
      recentLogs: recentLogs.map(l => ({
        id: l._id,
        sessionId: l.sessionId,
        isLoggedIn: l.isLoggedIn,
        userName: l.userName,
        userEmail: l.userEmail,
        userRole: l.userRole,
        page: l.page,
        pageTitle: l.pageTitle,
        device: l.device,
        browser: l.browser,
        durationSeconds: l.durationSeconds || 0,
        startTime: l.startTime,
        lastActive: l.lastActive,
        isLive: new Date(l.lastActive) >= fiveMinutesAgo
      }))
    });
  } catch (err) {
    console.error('[Analytics Error]:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[RTEC API Server] Running on port ${PORT}`);
});
