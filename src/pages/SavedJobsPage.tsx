import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ApplicationModal } from '../components/ApplicationModal';
import { JobCard } from '../components/JobCard';
import { useApp } from '../context/AppContext';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { JobApplication, RemoteJob } from '../types';
import { formatSalaryRange } from '../utils/formatters';

export const SavedJobsPage: React.FC = () => {
  const { jobs, savedJobIds, toggleSaveJob, addApplication } = useApp();
  const [trackingJob, setTrackingJob] = useState<RemoteJob | null>(null);
  const [notice, setNotice] = useState('');

  const savedJobs = jobs.filter((j) => savedJobIds.includes(j.id));

  const handleSaveTrack = async (
    data: Omit<JobApplication, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ) => {
    await addApplication(data);
    setNotice(`Added "${data.jobTitle}" to Application Tracker.`);
    window.setTimeout(() => setNotice(''), 4000);
  };

  return (
    <DashboardLayout
      title="Saved Remote Jobs"
      breadcrumb="Workspace / Saved Jobs"
      actionButton={
        <Link
          to="/jobs"
          className="px-4 py-2 text-sm font-semibold btn-purple-gradient rounded-lg whitespace-nowrap"
        >
          Browse More Jobs
        </Link>
      }
    >
      <div className="space-y-6">
        {notice && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-sm">
            {notice}
          </div>
        )}

        {savedJobs.length === 0 ? (
          <div className="card-elevated border rounded-xl p-12 text-center space-y-4">
            <h2 className="text-lg font-bold text-[#211638]">
              No saved Sri Lanka remote jobs yet
            </h2>
            <p className="text-sm text-[#756B83] max-w-md mx-auto">
              Bookmark verified Work-From-Home listings to review requirements, check resume match, and apply later.
            </p>
            <Link
              to="/jobs"
              className="inline-block px-4 py-2 text-sm font-semibold btn-purple-gradient rounded-lg"
            >
              Explore Remote Jobs
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {savedJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                isSaved={true}
                onToggleSave={toggleSaveJob}
                onTrackApplication={(j) => setTrackingJob(j)}
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
                status: 'Wishlist',
              }
            : null
        }
        onClose={() => setTrackingJob(null)}
        onSave={handleSaveTrack}
      />
    </DashboardLayout>
  );
};
