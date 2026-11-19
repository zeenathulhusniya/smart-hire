import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Bookmark,
  CheckCircle2,
  ExternalLink,
  FileSearch,
  PlusCircle,
} from 'lucide-react';
import { ApplicationModal } from '../components/ApplicationModal';
import { useApp } from '../context/AppContext';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { jobService } from '../services/jobService';
import { JobApplication, RemoteJob } from '../types';
import { formatDateShort, formatSalaryRange } from '../utils/formatters';

export const JobDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { savedJobIds, toggleSaveJob, addApplication } = useApp();

  const [job, setJob] = useState<RemoteJob | null>(null);
  const [loading, setLoading] = useState(true);
  const [trackOpen, setTrackOpen] = useState(false);
  const [trackedNotice, setTrackedNotice] = useState('');

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      const found = id ? await jobService.fetchJobById(id) : null;
      if (active) {
        setJob(found);
        setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [id]);

  const handleSaveTrackedApp = async (
    data: Omit<JobApplication, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ) => {
    await addApplication(data);
    setTrackedNotice('Added to your Job Application Tracker.');
  };

  if (loading) {
    return (
      <DashboardLayout title="Job Details" breadcrumb="Remote Jobs / Loading">
        <div className="bg-white border border-[#E7E0EF] rounded-xl p-8 h-72 animate-pulse" />
      </DashboardLayout>
    );
  }

  if (!job) {
    return (
      <DashboardLayout title="Job Not Available" breadcrumb="Remote Jobs / Unavailable">
        <div className="card-elevated border rounded-xl p-10 text-center space-y-4">
          <h2 className="text-xl font-bold text-[#211638]">
            This job is unavailable or does not meet Sri Lanka remote verification
          </h2>
          <p className="text-sm text-[#756B83] max-w-md mx-auto">
            Smart Hire excludes expired listings, onsite/hybrid roles, and postings unavailable to Sri Lankan residents.
          </p>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold btn-purple-gradient rounded-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Verified Remote Jobs</span>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const isSaved = savedJobIds.includes(job.id);

  return (
    <DashboardLayout
      title={job.jobTitle}
      breadcrumb={`Remote Jobs / ${job.companyName}`}
      actionButton={
        <Link
          to="/jobs"
          className="px-3.5 py-2 text-sm font-medium text-[#281C3B] bg-white border border-[#E7E0EF] hover:bg-[#FAF8FF] rounded-lg inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Jobs</span>
        </Link>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Job Details */}
        <div className="lg:col-span-8 space-y-6">
          {trackedNotice && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-800 flex items-center justify-between">
              <span>{trackedNotice}</span>
              <Link to="/applications" className="font-semibold underline">
                View in Tracker
              </Link>
            </div>
          )}

          <div className="card-elevated border rounded-xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div
                  className="w-14 h-14 rounded-xl bg-hero-gradient text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-sm"
                >
                  {job.companyLogoText}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#211638]">{job.jobTitle}</h2>
                  <p className="text-sm text-[#756B83] mt-1">
                    {job.companyName} · {job.category}
                    {job.isDemoSample ? ' · Sample Demo Listing' : ''}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => toggleSaveJob(job.id)}
                className={`px-3.5 py-2 rounded-lg border text-sm font-semibold inline-flex items-center gap-2 ${
                  isSaved
                    ? 'bg-[#E9DDFB] border-[#A78BFA] text-[#7046A5]'
                    : 'bg-white border-[#E7E0EF] text-[#281C3B] hover:bg-[#FAF8FF]'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-[#7046A5]' : ''}`} />
                <span>{isSaved ? 'Saved' : 'Save Job'}</span>
              </button>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-bold text-emerald-900">
                🇱🇰 Available to applicants in Sri Lanka
              </span>
              <span className="text-xs font-semibold text-emerald-800">
                100% Fully Remote / Work From Home
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-[#E7E0EF] text-sm">
              <div>
                <p className="text-xs text-[#756B83]">Compensation</p>
                <p className="font-semibold text-[#211638] tabular-nums mt-0.5">
                  {formatSalaryRange(job.salaryMin, job.salaryMax, job.currency)}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#756B83]">Employment Type</p>
                <p className="font-semibold text-[#211638] mt-0.5">{job.employmentType}</p>
              </div>
              <div>
                <p className="text-xs text-[#756B83]">Experience</p>
                <p className="font-semibold text-[#211638] mt-0.5">{job.experienceLevel}</p>
              </div>
              <div>
                <p className="text-xs text-[#756B83]">Deadline</p>
                <p className="font-semibold text-[#211638] tabular-nums mt-0.5">
                  {formatDateShort(job.expiryDate)}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-bold text-[#211638]">Role Overview</h3>
              <p className="text-sm text-[#281C3B] leading-relaxed">{job.description}</p>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-bold text-[#211638]">Key Responsibilities</h3>
              <ul className="list-disc pl-5 space-y-1.5 text-sm text-[#281C3B]">
                {job.responsibilities.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-bold text-[#211638]">Requirements</h3>
              <ul className="list-disc pl-5 space-y-1.5 text-sm text-[#281C3B]">
                {job.requirements.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-bold text-[#211638]">Required Skills</h3>
              <p className="text-sm text-[#281C3B]">{job.requiredSkills.join(' · ')}</p>
            </div>
          </div>
        </div>

        {/* Right Verification & Action Sidebar */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="card-elevated border rounded-xl p-6 space-y-4">
            <h3 className="text-base font-bold text-[#211638]">Application Actions</h3>
            <a
              href={job.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 text-sm font-semibold btn-purple-gradient rounded-lg inline-flex items-center justify-center gap-2"
            >
              <span>Apply on Employer Site</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <button
              type="button"
              onClick={() => setTrackOpen(true)}
              className="w-full py-2.5 px-4 text-sm font-semibold text-[#211638] bg-[#FAF8FF] border border-[#E7E0EF] hover:bg-[#E9DDFB]/60 rounded-lg inline-flex items-center justify-center gap-2 transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Track Application</span>
            </button>

            <button
              type="button"
              onClick={() =>
                navigate('/resume-analyzer', {
                  state: {
                    targetRole: `${job.jobTitle} at ${job.companyName}`,
                    jobDescription: `${job.description}\n\nRequirements:\n${job.requirements.join('\n')}\n\nRequired Skills: ${job.requiredSkills.join(', ')}`,
                  },
                })
              }
              className="w-full py-2.5 px-4 text-sm font-semibold text-[#7046A5] bg-[#E9DDFB] hover:bg-[#DCD0F6] rounded-lg inline-flex items-center justify-center gap-2 transition-colors"
            >
              <FileSearch className="w-4 h-4" />
              <span>Check Resume Match</span>
            </button>
          </div>

          <div className="card-elevated border rounded-xl p-6 space-y-3 text-xs">
            <h3 className="text-sm font-bold text-[#211638]">Verification Audit</h3>
            <div className="space-y-2 text-[#756B83]">
              <div className="flex items-center gap-2 text-emerald-700 font-medium">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Fully remote work arrangement confirmed</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-700 font-medium">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Sri Lankan residency eligibility confirmed</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-700 font-medium">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Active posting (not expired)</span>
              </div>
            </div>
            <div className="pt-3 border-t border-[#E7E0EF] space-y-1.5 text-[#756B83] tabular-nums">
              <p>
                <strong className="text-[#281C3B]">Original Source:</strong> {job.jobSource}
              </p>
              <p>
                <strong className="text-[#281C3B]">Posted Date:</strong>{' '}
                {formatDateShort(job.postedDate)}
              </p>
              <p>
                <strong className="text-[#281C3B]">Last Verified:</strong>{' '}
                {formatDateShort(job.lastVerifiedAt)}
              </p>
              <p>
                <strong className="text-[#281C3B]">Eligible Regions:</strong>{' '}
                {job.eligibleCountries.join(', ')}
              </p>
            </div>
          </div>
        </aside>
      </div>

      <ApplicationModal
        open={trackOpen}
        initialData={{
          companyName: job.companyName,
          jobTitle: job.jobTitle,
          location: 'Fully Remote (Sri Lanka)',
          salary: formatSalaryRange(job.salaryMin, job.salaryMax, job.currency),
          jobUrl: job.originalUrl,
          jobDescription: job.description,
          status: 'Applied',
        }}
        onClose={() => setTrackOpen(false)}
        onSave={handleSaveTrackedApp}
      />
    </DashboardLayout>
  );
};
