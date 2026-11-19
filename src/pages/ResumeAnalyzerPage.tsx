import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AlertCircle, CheckCircle2, FileText, Upload } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { resumeService } from '../services/resumeService';
import { ResumeAnalysisResult } from '../types';
import { formatDateShort } from '../utils/formatters';
import { extractPdfTextPreview, validatePdfFile } from '../utils/pdfExtractor';

export const ResumeAnalyzerPage: React.FC = () => {
  const { jobs, resumeHistory, addResumeAnalysis, backendConnected } = useApp();
  const location = useLocation();
  const navState = (location.state || {}) as {
    targetRole?: string;
    jobDescription?: string;
  };

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [targetRole, setTargetRole] = useState(
    navState.targetRole || 'Junior Java & Spring Boot Developer'
  );
  const [jobDescription, setJobDescription] = useState(
    navState.jobDescription ||
      'Looking for a fully remote developer in Sri Lanka skilled in Java 21, Spring Boot 3, MySQL, React, TypeScript, REST APIs, Git, and JUnit 5.'
  );
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<ResumeAnalysisResult | null>(
    resumeHistory[0] || null
  );

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError('');
    const file = e.target.files?.[0] || null;
    const validation = validatePdfFile(file);
    if (!validation.valid) {
      setSelectedFile(null);
      setFileError(validation.error || 'Invalid PDF file.');
      return;
    }
    setSelectedFile(file);
    if (file) {
      try {
        const extracted = await extractPdfTextPreview(file);
        setResumeText(extracted);
      } catch (err) {
        setFileError(
          err instanceof Error ? err.message : 'Unable to verify PDF file header.'
        );
        setSelectedFile(null);
      }
    }
  };

  const handlePickJob = (jobId: string) => {
    const found = jobs.find((j) => j.id === jobId);
    if (!found) return;
    setTargetRole(`${found.jobTitle} (${found.companyName})`);
    setJobDescription(
      `${found.description}\n\nRequirements:\n${found.requirements.join('\n')}\n\nRequired Skills: ${found.requiredSkills.join(', ')}`
    );
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setFileError('');
    if (!selectedFile && resumeText.trim().length < 40) {
      setFileError(
        'Please upload a valid PDF resume (up to 5 MB) or paste at least 40 characters of resume text.'
      );
      return;
    }
    if (jobDescription.trim().length < 20) {
      setFileError('Please provide a target job description to compare against.');
      return;
    }

    setAnalyzing(true);
    try {
      const analysis = await resumeService.analyzeResume({
        file: selectedFile,
        resumeText: resumeText.trim(),
        targetRole: targetRole.trim(),
        jobDescription: jobDescription.trim(),
      });
      setResult(analysis);
      addResumeAnalysis(analysis);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <DashboardLayout
      title="Resume Analyzer"
      breadcrumb="Career Tools / Resume Analyzer"
    >
      <div className="space-y-6">
        <div className="card-elevated border rounded-xl p-4 text-xs text-[#756B83] flex flex-wrap items-center justify-between gap-2">
          <span>
            {backendConnected
              ? 'Connected to Java Spring Boot + Google Gemini API for server-side PDF extraction and AI resume scoring.'
              : 'Demo Preview Mode: PDF files are validated in the browser. Connect the Java 21 Spring Boot backend to run live Google Gemini API analysis with Apache PDFBox.'}
          </span>
          <span className="font-mono text-[#7046A5]">Max PDF size: 5 MB</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Input Form */}
          <form
            onSubmit={handleAnalyze}
            className="lg:col-span-5 card-elevated border rounded-xl p-6 space-y-5 h-fit"
          >
            <div>
              <h2 className="text-base font-bold text-[#211638]">
                Upload PDF Resume &amp; Job Description
              </h2>
              <p className="text-xs text-[#756B83] mt-0.5">
                Gemini API keys remain strictly on the Java Spring Boot server.
              </p>
            </div>

            {fileError && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{fileError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#281C3B] mb-1.5">
                Resume File (PDF only, max 5 MB)
              </label>
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#E7E0EF] hover:border-[#7046A5] rounded-xl p-5 cursor-pointer bg-[#FAF8FF] transition-colors">
                <Upload className="w-5 h-5 text-[#7046A5] mb-2" />
                <span className="text-sm font-semibold text-[#211638]">
                  {selectedFile ? selectedFile.name : 'Choose a PDF resume'}
                </span>
                <span className="text-xs text-[#756B83] mt-0.5">
                  {selectedFile
                    ? `${(selectedFile.size / 1024).toFixed(1)} KB verified`
                    : 'Click to browse .pdf'}
                </span>
                <input
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#281C3B] mb-1.5">
                Extracted / Editable Resume Text
              </label>
              <textarea
                rows={5}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Upload a PDF above or paste your resume summary and skills (e.g. Java 21, Spring Boot, MySQL, React, TypeScript, Git)..."
                className="w-full px-3 py-2 text-xs border border-[#E7E0EF] rounded-lg text-[#281C3B] placeholder:text-[#756B83] focus:outline-none focus:ring-2 focus:ring-[#7046A5]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#281C3B] mb-1.5">
                Quick-Fill from Verified Sri Lanka Remote Jobs
              </label>
              <select
                defaultValue=""
                onChange={(e) => handlePickJob(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-[#E7E0EF] rounded-lg bg-white text-[#281C3B]"
              >
                <option value="" disabled>
                  Select a listed remote job...
                </option>
                {jobs.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.jobTitle} — {j.companyName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#281C3B] mb-1.5">
                Target Role Title
              </label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-[#E7E0EF] rounded-lg text-[#281C3B] focus:outline-none focus:ring-2 focus:ring-[#7046A5]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#281C3B] mb-1.5">
                Job Description *
              </label>
              <textarea
                rows={4}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs border border-[#E7E0EF] rounded-lg text-[#281C3B] focus:outline-none focus:ring-2 focus:ring-[#7046A5]"
              />
            </div>

            <button
              type="submit"
              disabled={analyzing}
              className="w-full py-2.5 px-4 text-sm font-semibold btn-purple-gradient rounded-lg disabled:opacity-60"
            >
              {analyzing ? 'Analyzing Resume...' : 'Analyze Resume Match'}
            </button>
          </form>

          {/* Analysis Results Panel */}
          <div className="lg:col-span-7 space-y-6">
            {!result ? (
              <div className="card-elevated border rounded-xl p-12 text-center space-y-3">
                <FileText className="w-8 h-8 text-[#A78BFA] mx-auto" />
                <h2 className="text-lg font-bold text-[#211638]">
                  Ready to Evaluate Your Resume
                </h2>
                <p className="text-sm text-[#756B83] max-w-md mx-auto">
                  Upload a PDF resume and select a Sri Lanka remote job description to see matched skills, missing competencies, and actionable improvements.
                </p>
              </div>
            ) : (
              <div className="card-elevated border rounded-xl p-6 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-[#E7E0EF]">
                  <div>
                    <p className="text-xs font-semibold text-[#7046A5]">
                      {result.analysisSource === 'GEMINI_BACKEND'
                        ? 'Live Google Gemini AI Analysis'
                        : 'Demo Preview Analysis (Connect Java Backend for Live Gemini AI)'}
                    </p>
                    <h2 className="text-xl font-bold text-[#211638] mt-0.5">
                      {result.targetRole}
                    </h2>
                    <p className="text-xs text-[#756B83] mt-0.5 tabular-nums">
                      File: {result.fileName} · Analyzed {formatDateShort(result.createdAt)}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs font-medium text-[#756B83]">Match Score</p>
                    <p className="text-4xl font-extrabold font-mono tabular-nums text-[#7046A5]">
                      {result.matchScore}%
                    </p>
                  </div>
                </div>

                {/* Matched vs Missing Skills */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h3 className="text-sm font-bold text-emerald-800">
                      Matched Skills ({result.matchedSkills.length})
                    </h3>
                    {result.matchedSkills.length === 0 ? (
                      <p className="text-xs text-[#756B83]">No direct keyword matches found.</p>
                    ) : (
                      <ul className="space-y-1 text-xs text-[#281C3B]">
                        {result.matchedSkills.map((skill) => (
                          <li key={skill} className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{skill}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-bold text-amber-800">
                      Missing Skills ({result.missingSkills.length})
                    </h3>
                    {result.missingSkills.length === 0 ? (
                      <p className="text-xs text-[#756B83]">All detected target skills matched.</p>
                    ) : (
                      <ul className="space-y-1 text-xs text-[#281C3B]">
                        {result.missingSkills.map((skill) => (
                          <li key={skill} className="flex items-center gap-2">
                            <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <span>{skill}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* Strengths */}
                <div className="space-y-2 pt-4 border-t border-[#E7E0EF]">
                  <h3 className="text-sm font-bold text-[#211638]">Resume Strengths</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-[#281C3B]">
                    {result.strengths.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>

                {/* Improvement Suggestions */}
                <div className="space-y-2 pt-4 border-t border-[#E7E0EF]">
                  <h3 className="text-sm font-bold text-[#211638]">
                    Improvement Suggestions
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-[#281C3B]">
                    {result.improvementSuggestions.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>

                {/* Recommended Learning Areas */}
                <div className="space-y-2 pt-4 border-t border-[#E7E0EF]">
                  <h3 className="text-sm font-bold text-[#211638]">
                    Recommended Learning Areas
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-[#281C3B]">
                    {result.recommendedLearningAreas.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Past Analyses History */}
            {resumeHistory.length > 1 && (
              <div className="card-elevated border rounded-xl p-5 space-y-3">
                <h3 className="text-sm font-bold text-[#211638]">Recent Analyses</h3>
                <div className="divide-y divide-[#E7E0EF]">
                  {resumeHistory.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setResult(item)}
                      className="w-full py-2.5 flex items-center justify-between text-left hover:bg-[#FAF8FF] px-2 rounded"
                    >
                      <div>
                        <p className="text-xs font-semibold text-[#211638]">
                          {item.targetRole}
                        </p>
                        <p className="text-[11px] text-[#756B83]">
                          {item.fileName} · {formatDateShort(item.createdAt)}
                        </p>
                      </div>
                      <span className="text-sm font-mono tabular-nums font-bold text-[#7046A5]">
                        {item.matchScore}%
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
