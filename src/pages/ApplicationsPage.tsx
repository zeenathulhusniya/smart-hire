import React, { useMemo, useState } from 'react';
import { ExternalLink, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { ApplicationModal } from '../components/ApplicationModal';
import { useApp } from '../context/AppContext';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { ApplicationStatus, JobApplication } from '../types';
import { formatDateShort } from '../utils/formatters';

type ViewMode = 'table' | 'kanban' | 'timeline' | 'activity';

const STATUSES: ApplicationStatus[] = [
  'Wishlist',
  'Applied',
  'Under Review',
  'Interview',
  'Offered',
  'Rejected',
];

const STATUS_STYLES: Record<ApplicationStatus, string> = {
  Wishlist: 'text-[#756B83] bg-[#FAF8FF] border border-[#E7E0EF]',
  Applied: 'text-[#211638] bg-[#E9DDFB]',
  'Under Review': 'text-amber-800 bg-amber-100',
  Interview: 'text-white bg-[#7046A5]',
  Offered: 'text-emerald-800 bg-emerald-100',
  Rejected: 'text-red-800 bg-red-100',
};

export const ApplicationsPage: React.FC = () => {
  const {
    applications,
    activities,
    addApplication,
    updateApplication,
    updateApplicationStatus,
    deleteApplication,
    loadDemoApplications,
  } = useApp();

  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<'newest' | 'company' | 'followup'>('newest');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<JobApplication | null>(null);
  const [viewingApp, setViewingApp] = useState<JobApplication | null>(null);

  const filteredApps = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = applications.filter((app) => {
      if (statusFilter && app.status !== statusFilter) return false;
      if (q) {
        const hay = `${app.companyName} ${app.jobTitle} ${app.notes} ${app.location}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    return [...list].sort((a, b) => {
      if (sortBy === 'company') return a.companyName.localeCompare(b.companyName);
      if (sortBy === 'followup') {
        return (a.followUpDate || '9999').localeCompare(b.followUpDate || '9999');
      }
      return (b.applicationDate || b.createdAt).localeCompare(a.applicationDate || a.createdAt);
    });
  }, [applications, search, statusFilter, sortBy]);

  const handleSave = async (
    data: Omit<JobApplication, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ) => {
    if (editingApp) {
      await updateApplication(editingApp.id, data);
    } else {
      await addApplication(data);
    }
    setEditingApp(null);
  };

  return (
    <DashboardLayout
      title="Job Application Tracker"
      breadcrumb="Workspace / Applications"
      actionButton={
        <button
          type="button"
          onClick={() => {
            setEditingApp(null);
            setModalOpen(true);
          }}
          className="px-4 py-2 text-sm font-semibold btn-purple-gradient rounded-lg inline-flex items-center gap-1.5 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Add Application</span>
        </button>
      }
    >
      <div className="space-y-6">
        {/* Toolbar: View Switcher + Search + Filters */}
        <div className="card-elevated border rounded-xl p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-1 p-1 bg-[#FAF8FF] border border-[#E7E0EF] rounded-lg w-fit overflow-x-auto">
            {(
              [
                ['table', 'Table View'],
                ['kanban', 'Kanban Board'],
                ['timeline', 'Timeline'],
                ['activity', 'Recent Activity'],
              ] as [ViewMode, string][]
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setViewMode(key)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  viewMode === key
                    ? 'btn-purple-gradient text-white shadow-sm'
                    : 'text-[#756B83] hover:text-[#211638]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 sm:w-56">
              <Search className="w-4 h-4 text-[#A78BFA] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search company or role..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-[#E7E0EF] rounded-lg text-[#281C3B] placeholder:text-[#756B83] focus:outline-none focus:ring-2 focus:ring-[#7046A5]"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter by status"
              className="px-3 py-2 text-sm border border-[#E7E0EF] rounded-lg bg-white text-[#281C3B]"
            >
              <option value="">All Statuses</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'company' | 'followup')}
              aria-label="Sort applications"
              className="px-3 py-2 text-sm border border-[#E7E0EF] rounded-lg bg-white text-[#281C3B]"
            >
              <option value="newest">Sort: Newest</option>
              <option value="company">Sort: Company</option>
              <option value="followup">Sort: Follow-up Date</option>
            </select>
          </div>
        </div>

        {/* Empty State */}
        {applications.length === 0 ? (
          <div className="card-elevated border rounded-xl p-12 text-center space-y-4">
            <h2 className="text-lg font-bold text-[#211638]">
              No job applications tracked yet
            </h2>
            <p className="text-sm text-[#756B83] max-w-md mx-auto">
              Start logging your remote Sri Lanka job applications to track statuses, follow-ups, and real conversion analytics.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setEditingApp(null);
                  setModalOpen(true);
                }}
                className="px-4 py-2 text-sm font-semibold btn-purple-gradient rounded-lg"
              >
                Add First Application
              </button>
              <button
                type="button"
                onClick={loadDemoApplications}
                className="px-4 py-2 text-sm font-semibold text-[#211638] bg-[#E9DDFB] hover:bg-[#DCD0F6] rounded-lg"
              >
                Load Sample Demo Applications
              </button>
            </div>
          </div>
        ) : viewMode === 'table' ? (
          /* TABLE VIEW */
          <div className="card-elevated border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E7E0EF] bg-[#FAF8FF] text-xs font-semibold text-[#756B83]">
                    <th className="py-3 px-4">Company &amp; Role</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Salary</th>
                    <th className="py-3 px-4">Applied Date</th>
                    <th className="py-3 px-4">Follow-up</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E7E0EF] text-sm">
                  {filteredApps.map((app) => (
                    <tr key={app.id} className="hover:bg-[#FAF8FF] transition-colors">
                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => setViewingApp(app)}
                          className="text-left hover:text-[#7046A5]"
                        >
                          <p className="font-semibold text-[#211638]">{app.companyName}</p>
                          <p className="text-xs text-[#756B83]">{app.jobTitle}</p>
                        </button>
                      </td>
                      <td className="py-3 px-4 text-xs text-[#756B83]">{app.location}</td>
                      <td className="py-3 px-4 text-xs font-mono tabular-nums text-[#281C3B]">
                        {app.salary || '—'}
                      </td>
                      <td className="py-3 px-4 text-xs font-mono tabular-nums text-[#756B83]">
                        {formatDateShort(app.applicationDate)}
                      </td>
                      <td className="py-3 px-4 text-xs font-mono tabular-nums text-[#756B83]">
                        {app.followUpDate ? formatDateShort(app.followUpDate) : '—'}
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={app.status}
                          onChange={(e) =>
                            updateApplicationStatus(app.id, e.target.value as ApplicationStatus)
                          }
                          aria-label={`Status for ${app.companyName}`}
                          className={`px-2.5 py-1 text-xs font-semibold rounded-md cursor-pointer ${STATUS_STYLES[app.status]}`}
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s} className="bg-white text-[#281C3B]">
                              {s}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          {app.jobUrl && (
                            <a
                              href={app.jobUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label="Open job URL"
                              className="p-1.5 text-[#756B83] hover:text-[#211638] rounded"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setEditingApp(app);
                              setModalOpen(true);
                            }}
                            aria-label="Edit application"
                            className="p-1.5 text-[#756B83] hover:text-[#7046A5] rounded"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteApplication(app.id)}
                            aria-label="Delete application"
                            className="p-1.5 text-[#756B83] hover:text-red-600 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : viewMode === 'kanban' ? (
          /* KANBAN BOARD */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {STATUSES.map((colStatus) => {
              const items = filteredApps.filter((a) => a.status === colStatus);
              return (
                <div
                  key={colStatus}
                  className="bg-[#E9DDFB]/45 border border-[#E7E0EF] rounded-xl p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-[#211638]">{colStatus}</h3>
                    <span className="text-xs font-mono tabular-nums font-semibold text-[#7046A5]">
                      {items.length}
                    </span>
                  </div>

                  {items.length === 0 ? (
                    <p className="text-xs text-[#756B83] py-6 text-center">
                      No applications in {colStatus}
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {items.map((app) => (
                        <div
                          key={app.id}
                          className="card-elevated card-elevated-hover border rounded-lg p-3.5 space-y-2.5"
                        >
                          <div>
                            <button
                              type="button"
                              onClick={() => setViewingApp(app)}
                              className="text-sm font-bold text-[#211638] hover:text-[#7046A5] text-left block"
                            >
                              {app.jobTitle}
                            </button>
                            <p className="text-xs text-[#756B83]">
                              {app.companyName} · {app.salary || app.location}
                            </p>
                          </div>

                          <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#E7E0EF]">
                            <select
                              value={app.status}
                              onChange={(e) =>
                                updateApplicationStatus(
                                  app.id,
                                  e.target.value as ApplicationStatus
                                )
                              }
                              aria-label={`Move ${app.jobTitle}`}
                              className="text-xs font-medium text-[#281C3B] bg-[#FAF8FF] border border-[#E7E0EF] rounded px-2 py-1"
                            >
                              {STATUSES.map((s) => (
                                <option key={s} value={s}>
                                  Move: {s}
                                </option>
                              ))}
                            </select>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingApp(app);
                                  setModalOpen(true);
                                }}
                                aria-label="Edit"
                                className="p-1 text-[#756B83] hover:text-[#7046A5]"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteApplication(app.id)}
                                aria-label="Delete"
                                className="p-1 text-[#756B83] hover:text-red-600"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : viewMode === 'timeline' ? (
          /* APPLICATION TIMELINE */
          <div className="card-elevated border rounded-xl p-6 space-y-6">
            <h2 className="text-base font-bold text-[#211638]">Application Chronology</h2>
            <div className="divide-y divide-[#E7E0EF]">
              {filteredApps.map((app) => (
                <div
                  key={app.id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <p className="text-xs font-mono tabular-nums text-[#756B83]">
                      Applied {formatDateShort(app.applicationDate)}
                      {app.followUpDate
                        ? ` · Follow-up ${formatDateShort(app.followUpDate)}`
                        : ''}
                    </p>
                    <p className="text-sm font-bold text-[#211638] mt-1">
                      {app.jobTitle} — {app.companyName}
                    </p>
                    {app.notes && (
                      <p className="text-xs text-[#756B83] mt-1">{app.notes}</p>
                    )}
                  </div>
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-md w-fit shrink-0 ${STATUS_STYLES[app.status]}`}
                  >
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* RECENT ACTIVITY */
          <div className="card-elevated border rounded-xl p-6 space-y-4">
            <h2 className="text-base font-bold text-[#211638]">Recent Tracker Activity</h2>
            {activities.length === 0 ? (
              <p className="text-sm text-[#756B83] py-6">No recent activity logged.</p>
            ) : (
              <div className="divide-y divide-[#E7E0EF]">
                {activities.map((act) => (
                  <div
                    key={act.id}
                    className="py-3 flex items-center justify-between gap-4 text-sm"
                  >
                    <div>
                      <span className="font-semibold text-[#211638]">
                        {act.companyName}
                      </span>{' '}
                      <span className="text-[#756B83]">— {act.action}</span>
                      <p className="text-xs text-[#756B83]">{act.jobTitle}</p>
                    </div>
                    <span className="text-xs font-mono tabular-nums text-[#756B83]">
                      {formatDateShort(act.timestamp)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Detail Inspection Modal */}
      {viewingApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#211638]/65">
          <div className="bg-white border border-[#E7E0EF] rounded-xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-[#211638]">{viewingApp.jobTitle}</h3>
                <p className="text-sm text-[#756B83]">{viewingApp.companyName}</p>
              </div>
              <span
                className={`px-2.5 py-1 text-xs font-semibold rounded-md ${STATUS_STYLES[viewingApp.status]}`}
              >
                {viewingApp.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs text-[#756B83] pt-2 border-t border-[#E7E0EF]">
              <div>
                <span className="text-[#756B83] block">Location</span>
                <span className="font-medium text-[#281C3B]">{viewingApp.location}</span>
              </div>
              <div>
                <span className="text-[#756B83] block">Salary</span>
                <span className="font-medium text-[#281C3B] tabular-nums">
                  {viewingApp.salary || '—'}
                </span>
              </div>
              <div>
                <span className="text-[#756B83] block">Applied Date</span>
                <span className="font-medium text-[#281C3B] tabular-nums">
                  {formatDateShort(viewingApp.applicationDate)}
                </span>
              </div>
              <div>
                <span className="text-[#756B83] block">Follow-up Date</span>
                <span className="font-medium text-[#281C3B] tabular-nums">
                  {viewingApp.followUpDate
                    ? formatDateShort(viewingApp.followUpDate)
                    : '—'}
                </span>
              </div>
            </div>

            {viewingApp.jobDescription && (
              <div className="text-xs space-y-1">
                <p className="font-semibold text-[#281C3B]">Job Description</p>
                <p className="text-[#756B83] leading-relaxed">{viewingApp.jobDescription}</p>
              </div>
            )}

            {viewingApp.notes && (
              <div className="text-xs space-y-1">
                <p className="font-semibold text-[#281C3B]">Notes</p>
                <p className="text-[#756B83] leading-relaxed">{viewingApp.notes}</p>
              </div>
            )}

            <div className="pt-4 border-t border-[#E7E0EF] flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setViewingApp(null)}
                className="px-4 py-2 text-xs font-semibold text-[#281C3B] border border-[#E7E0EF] hover:bg-[#FAF8FF] rounded-lg"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditingApp(viewingApp);
                  setViewingApp(null);
                  setModalOpen(true);
                }}
                className="px-4 py-2 text-xs font-semibold btn-purple-gradient rounded-lg"
              >
                Edit Application
              </button>
            </div>
          </div>
        </div>
      )}

      <ApplicationModal
        open={modalOpen}
        initialData={editingApp}
        onClose={() => {
          setModalOpen(false);
          setEditingApp(null);
        }}
        onSave={handleSave}
      />
    </DashboardLayout>
  );
};
