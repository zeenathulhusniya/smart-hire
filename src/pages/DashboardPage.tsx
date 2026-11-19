import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckSquare, Square } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { formatDateShort } from '../utils/formatters';

export const DashboardPage: React.FC = () => {
  const {
    session,
    jobs,
    applications,
    interviews,
    reminders,
    activities,
    savedJobIds,
    toggleReminderComplete,
  } = useApp();

  const upcomingInterviews = interviews.filter((i) => i.status === 'Scheduled' || i.status === 'Rescheduled');
  const pendingReminders = reminders.filter((r) => !r.completed);

  return (
    <DashboardLayout
      title={`Welcome back, ${session?.user.fullName || 'Applicant'}`}
      breadcrumb="Workspace / Overview"
      actionButton={
        <Link
          to="/jobs"
          className="px-4 py-2 text-sm font-semibold btn-purple-gradient rounded-lg whitespace-nowrap"
        >
          Browse Remote Jobs
        </Link>
      }
    >
      <div className="space-y-8">
        {/* KPI Row */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card-elevated card-elevated-hover border rounded-xl p-5">
            <p className="text-xs font-medium text-[#756B83]">
              Verified Sri Lanka Remote Jobs
            </p>
            <p className="text-3xl font-bold font-mono tabular-nums text-[#211638] mt-2">
              {jobs.length}
            </p>
            <Link
              to="/jobs"
              className="text-xs font-semibold text-[#7046A5] hover:text-[#211638] mt-3 inline-flex items-center gap-1"
            >
              <span>Explore listings</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="card-elevated card-elevated-hover border rounded-xl p-5">
            <p className="text-xs font-medium text-[#756B83]">Tracked Applications</p>
            <p className="text-3xl font-bold font-mono tabular-nums text-[#211638] mt-2">
              {applications.length}
            </p>
            <Link
              to="/applications"
              className="text-xs font-semibold text-[#7046A5] hover:text-[#211638] mt-3 inline-flex items-center gap-1"
            >
              <span>Open tracker</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="card-elevated card-elevated-hover border rounded-xl p-5">
            <p className="text-xs font-medium text-[#756B83]">Upcoming Interviews</p>
            <p className="text-3xl font-bold font-mono tabular-nums text-[#211638] mt-2">
              {upcomingInterviews.length}
            </p>
            <Link
              to="/interviews"
              className="text-xs font-semibold text-[#7046A5] hover:text-[#211638] mt-3 inline-flex items-center gap-1"
            >
              <span>Manage schedule</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="card-elevated card-elevated-hover border rounded-xl p-5">
            <p className="text-xs font-medium text-[#756B83]">Saved Remote Jobs</p>
            <p className="text-3xl font-bold font-mono tabular-nums text-[#211638] mt-2">
              {savedJobIds.length}
            </p>
            <Link
              to="/saved-jobs"
              className="text-xs font-semibold text-[#7046A5] hover:text-[#211638] mt-3 inline-flex items-center gap-1"
            >
              <span>View bookmarks</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        {/* Reminders + Upcoming Interviews */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Reminders Widget on Dashboard */}
          <div className="lg:col-span-6 card-elevated border rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-[#211638]">
                  Active Reminders
                </h2>
                <p className="text-xs text-[#756B83]">
                  Follow-ups, interview prep, and application deadlines
                </p>
              </div>
              <Link
                to="/reminders"
                className="text-xs font-semibold text-[#7046A5] hover:text-[#211638] whitespace-nowrap"
              >
                All Reminders
              </Link>
            </div>

            {pendingReminders.length === 0 ? (
              <div className="py-8 text-center text-sm text-[#756B83]">
                No pending reminders.{' '}
                <Link to="/reminders" className="text-[#7046A5] font-semibold">
                  Create one
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-[#E7E0EF]">
                {pendingReminders.slice(0, 4).map((rem) => (
                  <div
                    key={rem.id}
                    className="py-3 flex items-start justify-between gap-3"
                  >
                    <button
                      type="button"
                      onClick={() => toggleReminderComplete(rem.id)}
                      className="flex items-start gap-3 text-left group"
                    >
                      {rem.completed ? (
                        <CheckSquare className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-[#A78BFA] group-hover:text-[#7046A5] mt-0.5 shrink-0" />
                      )}
                      <div>
                        <p className="text-sm font-semibold text-[#281C3B]">
                          {rem.title}
                        </p>
                        <p className="text-xs text-[#756B83] mt-0.5 tabular-nums">
                          {rem.reminderType} · Due {formatDateShort(rem.dueDate)} at{' '}
                          {rem.dueTime}
                        </p>
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Interviews */}
          <div className="lg:col-span-6 card-elevated border rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-[#211638]">
                  Upcoming Interviews
                </h2>
                <p className="text-xs text-[#756B83]">
                  Scheduled remote interview sessions
                </p>
              </div>
              <Link
                to="/interviews"
                className="text-xs font-semibold text-[#7046A5] hover:text-[#211638] whitespace-nowrap"
              >
                Manage Interviews
              </Link>
            </div>

            {upcomingInterviews.length === 0 ? (
              <div className="py-8 text-center text-sm text-[#756B83]">
                No upcoming interviews scheduled.
              </div>
            ) : (
              <div className="divide-y divide-[#E7E0EF]">
                {upcomingInterviews.slice(0, 4).map((interview) => (
                  <div
                    key={interview.id}
                    className="py-3 flex items-center justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#281C3B] truncate">
                        {interview.company} — {interview.jobTitle}
                      </p>
                      <p className="text-xs text-[#756B83] mt-0.5 tabular-nums">
                        {interview.interviewType} ·{' '}
                        {formatDateShort(interview.interviewDate)} at{' '}
                        {interview.interviewTime}
                      </p>
                    </div>
                    {interview.meetingLink && (
                      <a
                        href={interview.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 text-xs font-semibold text-[#7046A5] bg-[#E9DDFB] hover:bg-[#DCD0F6] rounded-lg whitespace-nowrap shrink-0"
                      >
                        Join Link
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Recent Activity + Quick Career Tools */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 card-elevated border rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-[#211638]">Recent Application Activity</h2>
              <Link
                to="/applications"
                className="text-xs font-semibold text-[#7046A5] hover:text-[#211638]"
              >
                Open Tracker
              </Link>
            </div>
            {activities.length === 0 ? (
              <p className="text-sm text-[#756B83] py-6">
                No recent application activity yet.
              </p>
            ) : (
              <div className="divide-y divide-[#E7E0EF]">
                {activities.slice(0, 5).map((act) => (
                  <div
                    key={act.id}
                    className="py-3 flex items-center justify-between gap-4 text-sm"
                  >
                    <div className="min-w-0">
                      <span className="font-semibold text-[#281C3B]">
                        {act.companyName}
                      </span>{' '}
                      <span className="text-[#756B83]">— {act.action}</span>
                      <p className="text-xs text-[#756B83] truncate">{act.jobTitle}</p>
                    </div>
                    <span className="text-xs font-mono tabular-nums text-[#756B83] shrink-0">
                      {formatDateShort(act.timestamp)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-5 bg-hero-gradient text-white rounded-xl p-6 flex flex-col justify-between gap-6 shadow-[0_14px_34px_-10px_rgba(33,22,56,0.35)]">
            <div className="space-y-3">
              <h2 className="text-lg font-bold">Prepare for Your Next Remote Role</h2>
              <p className="text-sm text-[#E9DDFB]/85 leading-relaxed">
                Analyze your PDF resume against Sri Lanka remote job descriptions or practice interview answers in English and Tamil.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                to="/resume-analyzer"
                className="px-4 py-2.5 text-sm font-semibold btn-purple-gradient rounded-lg text-center"
              >
                Analyze Resume
              </Link>
              <Link
                to="/career-assistant"
                className="px-4 py-2.5 text-sm font-semibold text-white bg-white/15 hover:bg-white/25 border border-white/20 rounded-lg text-center transition-colors"
              >
                Career Assistant
              </Link>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
};
