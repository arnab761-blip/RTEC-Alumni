import React, { useState, useRef } from 'react';
import { 
  FileSpreadsheet, 
  Upload, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Database, 
  Users, 
  RefreshCw,
  Loader2,
  FileCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { parseExcelFile, downloadStudentTemplate } from '../utils/excelImport';

export default function ExcelImportModal({ isOpen, onClose }) {
  const { lang, bulkImportStudents, mongoStatus, checkMongoHealth, showToast } = useApp();
  
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [parseResult, setParseResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);

  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileSelect = async (selectedFile) => {
    if (!selectedFile) return;

    const validExtensions = ['.xlsx', '.xls', '.csv'];
    const hasValidExt = validExtensions.some(ext => selectedFile.name.toLowerCase().endsWith(ext));

    if (!hasValidExt) {
      setErrorMsg(lang === 'bn' ? 'দয়া করে একটি বৈধ এক্সেল (.xlsx, .xls) অথবা .csv ফাইল দিন।' : 'Please upload a valid .xlsx, .xls, or .csv file.');
      return;
    }

    setFile(selectedFile);
    setErrorMsg(null);
    setIsParsing(true);
    setSubmitResult(null);

    try {
      const result = await parseExcelFile(selectedFile);
      setParseResult(result);
    } catch (err) {
      setErrorMsg(err.message || (lang === 'bn' ? 'ফাইল পড়তে ব্যর্থ হয়েছে।' : 'Failed to parse file.'));
      setParseResult(null);
    } finally {
      setIsParsing(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleConfirmImport = async () => {
    if (!parseResult || !parseResult.students || parseResult.students.length === 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await bulkImportStudents(parseResult.students);
      setSubmitResult(res);
      showToast?.(lang === 'bn' 
        ? `✓ সফলভাবে ${res.totalImported} জন শিক্ষার্থীর ডেটা সংরক্ষিত হয়েছে!`
        : `✓ Successfully imported ${res.totalImported} students!`
      );
    } catch (err) {
      setErrorMsg(err.message || 'ইমপোর্ট করতে সমস্যা হয়েছে');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetState = () => {
    setFile(null);
    setParseResult(null);
    setErrorMsg(null);
    setSubmitResult(null);
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) {
          onClose();
        }
      }}
    >
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-[#181715] border border-[#C5A880]/30 rounded-3xl p-5 sm:p-7 shadow-2xl my-auto text-[#1C1917] dark:text-[#EDE8DF]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#F4EFE6] dark:bg-[#201E1A] text-[#57534E] dark:text-[#A89884] hover:text-black dark:hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-3.5 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-600/50 flex items-center justify-center text-emerald-700 dark:text-emerald-400 shrink-0 shadow-sm">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-[#0C0A09] dark:text-[#FDFBF7]">
              {lang === 'bn' ? 'এক্সেল / CSV দিয়ে বাল্ক শিক্ষার্থী ইনপুট' : 'Bulk Import Students via Excel / CSV'}
            </h3>
            <p className="text-xs text-[#57534E] dark:text-[#A89884] mt-0.5">
              {lang === 'bn'
                ? '১ম থেকে ৮ম ব্যাচের শত শত শিক্ষার্থীর নাম ও রেজিস্ট্রেশন এক ক্লিকে যুক্ত করুন।'
                : 'Upload hundreds of students from Excel/CSV directly to MongoDB in 1 click.'}
            </p>
          </div>
        </div>

        {/* MongoDB Atlas Status Banner */}
        <div className="p-3.5 rounded-2xl bg-[#FAF8F5] dark:bg-[#121110] border border-[#C5A880]/30 mb-5 flex flex-wrap items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="font-bold text-[#1C1917] dark:text-[#FDFBF7]">
              MongoDB Atlas:
            </span>
            <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/60 font-bold">
              rtec_alumni @ cluster0
            </span>
          </div>

          <button
            onClick={() => checkMongoHealth?.()}
            className="flex items-center gap-1 text-[11px] text-[#854D0E] dark:text-[#DFCA9E] hover:underline cursor-pointer"
            title="Refresh status"
          >
            <RefreshCw className={`w-3 h-3 ${mongoStatus?.checking ? 'animate-spin' : ''}`} />
            <span>{lang === 'bn' ? 'স্ট্যাটাস রিফ্রেশ' : 'Check status'}</span>
          </button>
        </div>

        {/* Step 1: Download Sample Excel Template */}
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-300/60 dark:border-amber-700/40 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-xs font-bold text-amber-950 dark:text-amber-200 flex items-center gap-1.5">
              <span>১. নমুনা এক্সেল ফাইল না থাকলে ডাউনলোড করুন:</span>
            </h4>
            <p className="text-[11px] text-amber-900/80 dark:text-amber-300/80 mt-0.5">
              কলামসমূহ: <code className="font-mono font-bold">Name, RegNo, Batch, Department, Session, BloodGroup</code>
            </p>
          </div>

          <button
            onClick={downloadStudentTemplate}
            className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition shrink-0 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{lang === 'bn' ? 'নমুনা টেমপ্লেট ডাউনলোড' : 'Download Template'}</span>
          </button>
        </div>

        {/* Step 2: Upload Area */}
        {!submitResult && (
          <div className="space-y-4">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-7 rounded-3xl border-2 border-dashed transition text-center cursor-pointer ${
                isDragging
                  ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 scale-[1.01]'
                  : 'border-[#C5A880]/40 hover:border-emerald-500 bg-[#FAF9F6] dark:bg-[#141311]'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx, .xls, .csv"
                onChange={(e) => handleFileSelect(e.target.files[0])}
                className="hidden"
              />

              <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3 shadow-sm">
                <Upload className="w-7 h-7" />
              </div>

              <h4 className="text-sm font-bold text-[#0C0A09] dark:text-[#FDFBF7]">
                {file ? file.name : (lang === 'bn' ? 'আপনার এক্সেল বা CSV ফাইলটি এখানে টেনে আনুন বা ক্লিক করুন' : 'Drag & drop Excel or CSV file here')}
              </h4>
              <p className="text-xs text-[#57534E] dark:text-[#A89884] mt-1">
                {lang === 'bn' ? 'সমর্থিত ফরম্যাট: .xlsx, .xls, .csv (সর্বোচ্চ ১০,০০০ শিক্ষার্থী একবারে)' : 'Supported: .xlsx, .xls, .csv (up to 10,000 rows)'}
              </p>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-100 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-700 text-rose-900 dark:text-rose-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Parsing Indicator */}
            {isParsing && (
              <div className="p-4 rounded-xl bg-sky-50 dark:bg-sky-950/30 border border-sky-300 text-sky-900 dark:text-sky-200 text-xs flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-sky-600" />
                <span>{lang === 'bn' ? 'এক্সেল ফাইলটি প্রসেস করা হচ্ছে...' : 'Parsing Excel file...'}</span>
              </div>
            )}

            {/* Parse Result Summary & Preview Table */}
            {parseResult && (
              <div className="space-y-3.5 p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#121110] border border-[#C5A880]/30 animate-in fade-in duration-200">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <span className="font-bold text-xs sm:text-sm text-[#0C0A09] dark:text-[#FDFBF7]">
                      {lang === 'bn' 
                        ? `মোট ${parseResult.validStudentsCount} জন শিক্ষার্থীর তথ্য পাওয়া গেছে`
                        : `Found ${parseResult.validStudentsCount} valid student records`}
                    </span>
                  </div>

                  <button
                    onClick={resetState}
                    className="text-xs text-rose-600 hover:underline"
                  >
                    {lang === 'bn' ? 'অন্য ফাইল দিন' : 'Change file'}
                  </button>
                </div>

                {/* First 5 Preview Table */}
                <div className="rounded-xl border border-[#C5A880]/25 overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-[#EBE3D6] dark:bg-[#201E1A] text-[#1C1917] dark:text-[#DCD3C1] font-bold text-[10px] uppercase">
                      <tr>
                        <th className="p-2">Reg No</th>
                        <th className="p-2">Name</th>
                        <th className="p-2">Batch</th>
                        <th className="p-2">Department</th>
                        <th className="p-2">Blood</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#C5A880]/15 text-[11px]">
                      {parseResult.students.slice(0, 5).map((s, idx) => (
                        <tr key={idx} className="hover:bg-white/60 dark:hover:bg-white/5">
                          <td className="p-2 font-mono font-bold text-teal-700 dark:text-teal-400">{s.regNo}</td>
                          <td className="p-2 font-bold">{s.name}</td>
                          <td className="p-2 text-[#57534E] dark:text-[#A89884]">{s.batch}</td>
                          <td className="p-2">{s.department}</td>
                          <td className="p-2 font-bold text-rose-700 dark:text-rose-400">{s.bloodGroup || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {parseResult.students.length > 5 && (
                    <div className="p-2 bg-[#F5F0E6] dark:bg-[#1A1916] text-center text-[10px] text-[#57534E] dark:text-[#A89884] italic">
                      ... এবং আরও {parseResult.students.length - 5} জন শিক্ষার্থী
                    </div>
                  )}
                </div>

                {/* Import CTA Button */}
                <button
                  onClick={handleConfirmImport}
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition active:scale-98 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{lang === 'bn' ? 'MongoDB-তে আপলোড করা হচ্ছে...' : 'Uploading to MongoDB...'}</span>
                    </>
                  ) : (
                    <>
                      <FileCheck className="w-5 h-5" />
                      <span>
                        {lang === 'bn' 
                          ? `এক ক্লিকে ${parseResult.students.length} জন শিক্ষার্থী ডেটাবেজে আপলোড করুন`
                          : `Confirm & Upload ${parseResult.students.length} Students to MongoDB`}
                      </span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Success Screen */}
        {submitResult && (
          <div className="text-center py-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border-2 border-emerald-400 shadow-lg">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h4 className="text-xl font-black text-[#0C0A09] dark:text-[#FDFBF7]">
                {lang === 'bn' ? '🎉 সফলভাবে সম্পন্ন হয়েছে!' : 'Import Successful!'}
              </h4>
              <p className="text-xs text-[#57534E] dark:text-[#A89884] mt-1 max-w-md mx-auto">
                {lang === 'bn'
                  ? `মোট ${submitResult.totalImported} জন শিক্ষার্থীর তথ্য আপনার ওয়েবসাইট ও ডেটাবেজে অন্তর্ভুক্ত করা হয়েছে।`
                  : `Successfully imported ${submitResult.totalImported} students into your system.`}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#FAF8F5] dark:bg-[#141311] border border-[#C5A880]/30 inline-block text-xs font-mono">
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                ✓ নতুন যুক্ত: {submitResult.added || submitResult.totalImported} জন
              </span>
              {submitResult.updated > 0 && (
                <span className="text-sky-600 dark:text-sky-400 font-bold ml-3">
                  • আপডেট: {submitResult.updated} জন
                </span>
              )}
            </div>

            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                onClick={resetState}
                className="px-4 py-2.5 rounded-xl bg-[#F4EFE6] dark:bg-[#201E1A] text-xs font-bold text-[#1C1917] dark:text-[#EDE8DF] hover:bg-[#EAE2D2] transition cursor-pointer"
              >
                {lang === 'bn' ? 'আরেকটি ফাইল আপলোড করুন' : 'Upload Another File'}
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition cursor-pointer"
              >
                {lang === 'bn' ? 'তালিকা দেখুন' : 'View Directory'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
