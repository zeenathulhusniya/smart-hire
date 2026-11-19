import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, ExternalLink, PlusCircle } from 'lucide-react';
import { RemoteJob } from '../types';
import { formatDateShort, formatSalaryRange } from '../utils/formatters';

interface JobCardProps {
  job: RemoteJob;
  isSaved: boolean;
  onToggleSave: (jobId: string) => void;
  onTrackApplication?: (job: RemoteJob) => void;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  isSaved,
  onToggleSave,
  onTrackApplication,
}) => {
  return (
    <article className="card-elevated card-elevated-hover border rounded-xl p-6 flex flex-col justify-between gap-5">
      <div className="space-y-4">
        {/* Top Row: Company Mark + Title + Save */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3.5 min-w-0">
            <div
              className="w-11 h-11 rounded-lg text-white flex items-center justify-center font-bold text-sm shrink-0 bg-hero-gradient shadow-sm"
            >
              {job.companyLogoText}
            </div>
            <div className="min-w-0">
              <Link
                to={`/jobs/${job.id}`}
                className="text-lg font-bold text-[#211638] hover:text-[#7046A5] transition-colors block truncate"
              >
                {job.jobTitle}
              </Link>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[#756B83] mt-0.5">
                <span className="font-medium text-[#281C3B]">{job.companyName}</span>
                <span aria-hidden="true">·</span>
                <span>{job.category}</span>
                {job.isDemoSample && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="text-xs font-medium text-[#7046A5]">
                      Sample Demo Listing
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onToggleSave(job.id)}
            aria-label={isSaved ? 'Remove from saved jobs' : 'Save job'}
            className={`p-2 rounded-lg border transition-colors shrink-0 min-h-[40px] min-w-[40px] flex items-center justify-center ${
              isSaved
                ? 'bg-[#E9DDFB] border-[#A78BFA] text-[#7046A5]'
                : 'bg-white border-[#E7E0EF] text-[#756B83] hover:text-[#211638] hover:bg-[#FAF8FF]'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-[#7046A5]' : ''}`} />
          </button>
        </div>

        {/* Mandatory Sri Lanka Eligibility + Fully Remote Notice */}
        <div className="text-sm font-semibold text-emerald-800 bg-emerald-50/70 border border-emerald-200/80 rounded-lg px-3.5 py-2 flex flex-wrap items-center justify-between gap-2">
          <span>🇱🇰 Available to applicants in Sri Lanka</span>
          <span className="text-xs font-medium text-emerald-700">
            Fully Remote / Work From Home
          </span>
        </div>

        {/* Unboxed metadata row with tabular numerals */}
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-[#756B83] tabular-nums">
          <span className="font-semibold text-[#281C3B]">
            {formatSalaryRange(job.salaryMin, job.salaryMax, job.currency)}
          </span>
          <span aria-hidden="true">·</span>
          <span>{job.employmentType}</span>
          <span aria-hidden="true">·</span>
          <span>{job.experienceLevel}</span>
          <span aria-hidden="true">·</span>
          <span>Posted {formatDateShort(job.postedDate)}</span>
          <span aria-hidden="true">·</span>
          <span>Closes {formatDateShort(job.expiryDate)}</span>
        </div>

        <p className="text-sm text-[#756B83] line-clamp-2 leading-relaxed">
          {job.description}
        </p>

        {/* Clean inline skills list without capsule bloat */}
        <div className="text-xs text-[#756B83] leading-relaxed">
          <span className="font-medium text-[#281C3B]">Skills: </span>
          {job.requiredSkills.join(' · ')}
        </div>
      </div>

      {/* Verification footer & action controls */}
      <div className="pt-4 border-t border-[#E7E0EF] flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs text-[#756B83] tabular-nums">
          <span>Source: {job.jobSource}</span>
          <span className="mx-1.5" aria-hidden="true">·</span>
          <span>Verified {formatDateShort(job.lastVerifiedAt)}</span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onTrackApplication && (
            <button
              type="button"
              onClick={() => onTrackApplication(job)}
              className="px-3 py-2 text-xs font-semibold text-[#281C3B] bg-[#FAF8FF] hover:bg-[#E9DDFB] border border-[#E7E0EF] rounded-lg transition-colors inline-flex items-center gap-1.5 whitespace-nowrap"
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#7046A5]" />
              <span>Track</span>
            </button>
          )}
          <Link
            to={`/jobs/${job.id}`}
            className="px-3 py-2 text-xs font-semibold text-[#281C3B] border border-[#E7E0EF] hover:bg-[#E9DDFB]/60 rounded-lg transition-colors whitespace-nowrap"
          >
            View Details
          </Link>
          <a
            href={job.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 text-xs font-semibold btn-purple-gradient rounded-lg inline-flex items-center gap-1.5 whitespace-nowrap"
          >
            <span>Apply Now</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </article>
  );
};
