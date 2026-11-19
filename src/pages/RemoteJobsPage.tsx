import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, RotateCcw, Search } from 'lucide-react';
import { ApplicationModal } from '../components/ApplicationModal';
import { JobCard } from '../components/JobCard';
import { useApp } from '../context/AppContext';
import { DashboardLayout } from '../layouts/DashboardLayout';
import {
  EmploymentType,
  ExperienceLevel,
  JOB_CATEGORIES,
  JobApplication,
  RemoteJob,
} from '../types';
import { formatSalaryRange } from '../utils/formatters';

const EMPLOYMENT_TYPES: EmploymentType[] = [
  'Full-time',
  'Part-time',
  'Internship',
  'Freelance',
  'Contract',
];

const EXPERIENCE_LEVELS: ExperienceLevel[] = [
  'Internship',
  'Entry-level',
  'Junior',
  'Mid-level',
  'Senior',
];

export const RemoteJobsPage: React.FC = () => {
  const { jobs, jobsLoading, jobsSourceMode, savedJobIds, toggleSaveJob, addApplication } =
    useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [employmentType, setEmploymentType] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [salaryTier, setSalaryTier] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [postedWithinDays, setPostedWithinDays] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'company'>('newest');

  const [trackingJob, setTrackingJob] = useState<RemoteJob | null>(null);
  const [trackSuccessMsg, setTrackSuccessMsg] = useState('');

  const resetFilters = () => {
    setQuery('');
    setCategory('');
    setEmploymentType('');
    setExperienceLevel('');
    setSalaryTier('');
    setSkillFilter('');
    setCompanyFilter('');
    setPostedWithinDays('');
    setSortBy('newest');
    setSearchParams({});
  };

  const filteredJobs = useMemo(() => {
    const q = query.trim().toLowerCase();
    const skillQ = skillFilter.trim().toLowerCase();
    const companyQ = companyFilter.trim().toLowerCase();
    const now = new Date().getTime();

    const list = jobs.filter((job) => {
      if (q) {
        const hay = `${job.jobTitle} ${job.companyName} ${job.description} ${job.requiredSkills.join(' ')}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (category && job.category !== category) return false;
      if (employmentType && job.employmentType !== employmentType) return false;
      if (experienceLevel && job.experienceLevel !== experienceLevel) return false;
      if (companyQ && !job.companyName.toLowerCase().includes(companyQ)) return false;
      if (
        skillQ &&
        !job.requiredSkills.some((s) => s.toLowerCase().includes(skillQ))
      ) {
        return false;
      }
      if (postedWithinDays) {
        const days = Number(postedWithinDays);
        const postedMs = new Date(job.postedDate).getTime();
        const diffDays = (now - postedMs) / (1000 * 60 * 60 * 24);
        if (diffDays > days) return false;
      }
      if (salaryTier) {
        // Normalize rough comparison for USD vs LKR (1 USD ~ 300 LKR)
        const approxLkrMax =
          job.currency === 'LKR' ? job.salaryMax : job.salaryMax * 300;
        if (salaryTier === 'entry' && approxLkrMax > 180000) return false;
        if (salaryTier === 'mid' && (approxLkrMax < 180000 || approxLkrMax > 450000)) {
          return false;
        }
        if (salaryTier === 'senior' && approxLkrMax < 450000) return false;
      }
      return true;
    });

    return [...list].sort((a, b) => {
      if (sortBy === 'company') {
        return a.companyName.localeCompare(b.companyName);
      }
      return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
    });
  }, [
    jobs,
    query,
    category,
    employmentType,
    experienceLevel,
    companyFilter,
    skillFilter,
    postedWithinDays,
    salaryTier,
    sortBy,
  ]);

  const handleSaveTrackedApp = async (
    data: Omit<JobApplication, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ) => {
    await addApplication(data);
    setTrackSuccessMsg(`Added "${data.jobTitle}" at ${data.companyName} to your Application Tracker.`);
    window.setTimeout(() => setTrackSuccessMsg(''), 5000);
  };

  return (
    <DashboardLayout
      title="Sri Lanka Remote Jobs"
      breadcrumb="Portal / Verified Work-From-Home Listings"
      actionButton={
        <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg whitespace-nowrap">
          🇱🇰 Sri Lanka Eligible Only
        </span>
      }
    >
      <div className="space-y-6">
        {/* Source Transparency Notice */}
        <div className="card-elevated border rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs text-[#756B83]">
          <div>
            <span className="font-semibold text-[#211638]">
              {jobsSourceMode === 'LIVE_BACKEND'
                ? 'Live Permitted Job Feed Connected:'
                : 'Sample Demo Job Listings:'}
            </span>{' '}
            {jobsSourceMode === 'LIVE_BACKEND'
              ? 'Showing verified, non-expired, fully remote Sri Lanka-eligible roles from MySQL.'
              : 'No external job API feed is connected yet. Displaying clearly labelled demo listings showing verified Sri Lanka eligibility, official employer portals, and expiry checks.'}
          </div>
          <span className="font-mono tabular-nums font-semibold text-[#281C3B]">
            {filteredJobs.length} of {jobs.length} shown
          </span>
        </div>

        {trackSuccessMsg && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-sm font-medium">
            {trackSuccessMsg}
          </div>
        )}

        {/* Filter Bar */}
        <section className="card-elevated border rounded-xl p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-bold text-[#211638]">
              <Filter className="w-4 h-4 text-[#7046A5]" />
              <span>Filter Verified Remote Opportunities</span>
            </div>
            <button
              type="button"
              onClick={resetFilters}
              className="text-xs font-semibold text-[#756B83] hover:text-[#211638] inline-flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-[#A78BFA] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search title or keyword..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-[#E7E0EF] rounded-lg text-[#281C3B] placeholder:text-[#756B83] focus:outline-none focus:ring-2 focus:ring-[#7046A5]"
              />
            </div>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              aria-label="Job category"
              className="px-3 py-2 text-sm border border-[#E7E0EF] rounded-lg bg-white text-[#281C3B] focus:outline-none focus:ring-2 focus:ring-[#7046A5]"
            >
              <option value="">All 16 Categories</option>
              {JOB_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select
              value={employmentType}
              onChange={(e) => setEmploymentType(e.target.value)}
              aria-label="Employment type"
              className="px-3 py-2 text-sm border border-[#E7E0EF] rounded-lg bg-white text-[#281C3B] focus:outline-none focus:ring-2 focus:ring-[#7046A5]"
            >
              <option value="">All Employment Types</option>
              {EMPLOYMENT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            <select
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              aria-label="Experience level"
              className="px-3 py-2 text-sm border border-[#E7E0EF] rounded-lg bg-white text-[#281C3B] focus:outline-none focus:ring-2 focus:ring-[#7046A5]"
            >
              <option value="">All Experience Levels</option>
              {EXPERIENCE_LEVELS.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>

            <select
              value={salaryTier}
              onChange={(e) => setSalaryTier(e.target.value)}
              aria-label="Salary range"
              className="px-3 py-2 text-sm border border-[#E7E0EF] rounded-lg bg-white text-[#281C3B] focus:outline-none focus:ring-2 focus:ring-[#7046A5]"
            >
              <option value="">Any Salary Range</option>
              <option value="entry">Up to LKR 180k / mo</option>
              <option value="mid">LKR 180k – 450k / mo</option>
              <option value="senior">LKR 450k+ / mo (or USD eq.)</option>
            </select>

            <input
              type="text"
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              placeholder="Required skill (e.g. Spring Boot)"
              className="px-3 py-2 text-sm border border-[#E7E0EF] rounded-lg text-[#281C3B] placeholder:text-[#756B83] focus:outline-none focus:ring-2 focus:ring-[#7046A5]"
            />

            <input
              type="text"
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
              placeholder="Filter by company name"
              className="px-3 py-2 text-sm border border-[#E7E0EF] rounded-lg text-[#281C3B] placeholder:text-[#756B83] focus:outline-none focus:ring-2 focus:ring-[#7046A5]"
            />

            <div className="grid grid-cols-2 gap-2">
              <select
                value={postedWithinDays}
                onChange={(e) => setPostedWithinDays(e.target.value)}
                aria-label="Date posted"
                className="px-2.5 py-2 text-sm border border-[#E7E0EF] rounded-lg bg-white text-[#281C3B] focus:outline-none focus:ring-2 focus:ring-[#7046A5]"
              >
                <option value="">Any Date</option>
                <option value="7">Last 7 days</option>
                <option value="14">Last 14 days</option>
                <option value="30">Last 30 days</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'newest' | 'company')}
                aria-label="Sort jobs"
                className="px-2.5 py-2 text-sm border border-[#E7E0EF] rounded-lg bg-white text-[#281C3B] focus:outline-none focus:ring-2 focus:ring-[#7046A5]"
              >
                <option value="newest">Sort: Newest</option>
                <option value="company">Sort: Company</option>
              </select>
            </div>
          </div>
        </section>

        {/* Job Cards Grid */}
        {jobsLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="h-64 bg-white border border-[#E7E0EF] rounded-xl p-6 animate-pulse"
              />
            ))}
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="card-elevated border rounded-xl p-12 text-center space-y-3">
            <h2 className="text-lg font-bold text-[#211638]">
              No matching verified Sri Lanka remote jobs found
            </h2>
            <p className="text-sm text-[#756B83] max-w-md mx-auto">
              Smart Hire excludes onsite, hybrid, expired, and non-Sri-Lanka restricted roles. Try widening your category or skill filters.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="px-4 py-2 text-sm font-semibold btn-purple-gradient rounded-lg"
            >
              Show All Verified Remote Jobs
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                isSaved={savedJobIds.includes(job.id)}
                onToggleSave={toggleSaveJob}
                onTrackApplication={(selected) => setTrackingJob(selected)}
              />
            ))}
          </div>
        )}
      </div>

      <ApplicationModal
        open={Boolean(trackingJob)}
        initialData={
          trackingJob
            ? {
                companyName: trackingJob.companyName,
                jobTitle: trackingJob.jobTitle,
                location: 'Fully Remote (Sri Lanka)',
                salary: formatSalaryRange(
                  trackingJob.salaryMin,
                  trackingJob.salaryMax,
                  trackingJob.currency
                ),
                jobUrl: trackingJob.originalUrl,
                jobDescription: trackingJob.description,
                status: 'Applied',
              }
            : null
        }
        onClose={() => setTrackingJob(null)}
        onSave={handleSaveTrackedApp}
      />
    </DashboardLayout>
  );
};
