import React, { useState } from 'react';
import { ExternalLink, Pencil, Plus, Trash2, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { Interview, InterviewStatus, InterviewType } from '../types';
import { formatDateShort } from '../utils/formatters';

const INTERVIEW_TYPES: InterviewType[] = [
  'HR Screening',
  'Technical',
  'System Design',
  'Behavioral',
  'Final',
];

const INTERVIEW_STATUSES: InterviewStatus[] = [
  'Scheduled',
  'Completed',
  'Rescheduled',
  'Cancelled',
];

export const InterviewsPage: React.FC = () => {
  const { interviews, addInterview, updateInterview, deleteInterview } = useApp();

  const [tab, setTab] = useState<'upcoming' | 'completed'>('upcoming');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Interview | null>(null);

  const [company, setCompany] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [interviewDate, setInterviewDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [interviewTime, setInterviewTime] = useState('10:00');
  const [interviewType, setInterviewType] = useState<InterviewType>('Technical');
  const [meetingLink, setMeetingLink] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<InterviewStatus>('Scheduled');

  const openCreate = () => {
    setEditing(null);
    setCompany('');
    setJobTitle('');
    setInterviewDate(new Date().toISOString().slice(0, 10));
    setInterviewTime('10:00');
    setInterviewType('Technical');
    setMeetingLink('');
    setNotes('');
    setStatus('Scheduled');
    setModalOpen(true);
  };

  const openEdit = (item: Interview) => {
    setEditing(item);
    setCompany(item.company);
    setJobTitle(item.jobTitle);
    setInterviewDate(item.interviewDate);
    setInterviewTime(item.interviewTime);
    setInterviewType(item.interviewType);
    setMeetingLink(item.meetingLink);
    setNotes(item.notes);
    setStatus(item.status);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !jobTitle.trim()) return;
    const payload = {
      company: company.trim(),
      jobTitle: jobTitle.trim(),
      interviewDate,
      interviewTime,
      interviewType,
      meetingLink: meetingLink.trim(),
      notes: notes.trim(),
      status,
    };
    if (editing) {
      await updateInterview(editing.id, payload);
    } else {
      await addInterview(payload);
    }
    setModalOpen(false);
  };

  const visibleList = interviews.filter((i) =>
    tab === 'upcoming'
      ? i.status === 'Scheduled' || i.status === 'Rescheduled'
      : i.status === 'Completed' || i.status === 'Cancelled'
  );

  return (
    <DashboardLayout
      title="Interview Management"
      breadcrumb="Workspace / Interviews"
      actionButton={
        <button
          type="button"
          onClick={openCreate}
          className="px-4 py-2 text-sm font-semibold btn-purple-gradient rounded-lg inline-flex items-center gap-1.5 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Interview</span>
        </button>
      }
    >
      <div className="space-y-6">
        <div className="flex items-center gap-1 p-1 bg-[#E9DDFB]/60 border border-[#E7E0EF] rounded-lg w-fit">
          <button
            type="button"
            onClick={() => setTab('upcoming')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              tab === 'upcoming'
                ? 'btn-purple-gradient text-white shadow-sm'
                : 'text-[#756B83] hover:text-[#211638]'
            }`}
          >
            Upcoming Interviews
          </button>
          <button
            type="button"
            onClick={() => setTab('completed')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              tab === 'completed'
                ? 'btn-purple-gradient text-white shadow-sm'
                : 'text-[#756B83] hover:text-[#211638]'
            }`}
          >
            Completed / Past
          </button>
        </div>

        {visibleList.length === 0 ? (
          <div className="card-elevated border rounded-xl p-12 text-center space-y-3">
            <h2 className="text-lg font-bold text-[#211638]">
              No {tab} interviews found
            </h2>
            <p className="text-sm text-[#756B83]">
              Schedule an interview with meeting link and preparation notes.
            </p>
            <button
              type="button"
              onClick={openCreate}
              className="px-4 py-2 text-sm font-semibold btn-purple-gradient rounded-lg"
            >
              Schedule Interview
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {visibleList.map((item) => (
              <div
                key={item.id}
                className="card-elevated card-elevated-hover border rounded-xl p-6 space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-[#211638]">
                      {item.company} — {item.jobTitle}
                    </h3>
                    <p className="text-xs text-[#756B83] mt-1 tabular-nums">
                      {item.interviewType} · {formatDateShort(item.interviewDate)} at{' '}
                      {item.interviewTime} (GMT+5:30)
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-[#7046A5] bg-[#E9DDFB] px-2.5 py-1 rounded-md shrink-0">
                    {item.status}
                  </span>
                </div>

                {item.notes && (
                  <p className="text-sm text-[#281C3B] leading-relaxed">{item.notes}</p>
                )}

                <div className="pt-3 border-t border-[#E7E0EF] flex items-center justify-between gap-3">
                  {item.meetingLink ? (
                    <a
                      href={item.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-[#7046A5] hover:text-[#211638] inline-flex items-center gap-1"
                    >
                      <span>Open Meeting Link</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <span className="text-xs text-[#756B83]">No meeting link added</span>
                  )}

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEdit(item)}
                      aria-label="Edit interview"
                      className="p-1.5 text-[#756B83] hover:text-[#7046A5] rounded"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteInterview(item.id)}
                      aria-label="Delete interview"
                      className="p-1.5 text-[#756B83] hover:text-red-600 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#211638]/65">
          <div className="bg-white border border-[#E7E0EF] rounded-xl w-full max-w-lg p-6 space-y-4 shadow-[0_20px_50px_-12px_rgba(33,22,56,0.35)]">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#211638]">
                {editing ? 'Edit Interview' : 'Schedule Interview'}
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-[#756B83] hover:text-[#211638]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#281C3B] mb-1">
                    Company *
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-sm border border-[#E7E0EF] rounded-lg text-[#281C3B] focus:outline-none focus:ring-2 focus:ring-[#7046A5]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#281C3B] mb-1">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-sm border border-[#E7E0EF] rounded-lg text-[#281C3B] focus:outline-none focus:ring-2 focus:ring-[#7046A5]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#281C3B] mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-sm border border-[#E7E0EF] rounded-lg text-[#281C3B] focus:outline-none focus:ring-2 focus:ring-[#7046A5]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#281C3B] mb-1">
                    Time (SL Time)
                  </label>
                  <input
                    type="time"
                    value={interviewTime}
                    onChange={(e) => setInterviewTime(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-sm border border-[#E7E0EF] rounded-lg text-[#281C3B] focus:outline-none focus:ring-2 focus:ring-[#7046A5]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#281C3B] mb-1">
                    Interview Type
                  </label>
                  <select
                    value={interviewType}
                    onChange={(e) => setInterviewType(e.target.value as InterviewType)}
                    className="w-full px-3 py-2 text-sm border border-[#E7E0EF] rounded-lg bg-white text-[#281C3B] focus:outline-none focus:ring-2 focus:ring-[#7046A5]"
                  >
                    {INTERVIEW_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#281C3B] mb-1">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as InterviewStatus)}
                    className="w-full px-3 py-2 text-sm border border-[#E7E0EF] rounded-lg bg-white text-[#281C3B] focus:outline-none focus:ring-2 focus:ring-[#7046A5]"
                  >
                    {INTERVIEW_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#281C3B] mb-1">
                  Meeting Link
                </label>
                <input
                  type="url"
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                  placeholder="https://meet.google.com/..."
                  className="w-full px-3 py-2 text-sm border border-[#E7E0EF] rounded-lg text-[#281C3B] placeholder:text-[#756B83] focus:outline-none focus:ring-2 focus:ring-[#7046A5]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#281C3B] mb-1">
                  Preparation Notes
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#E7E0EF] rounded-lg text-[#281C3B] focus:outline-none focus:ring-2 focus:ring-[#7046A5]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-[#281C3B] border border-[#E7E0EF] hover:bg-[#FAF8FF] rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-semibold btn-purple-gradient rounded-lg"
                >
                  Save Interview
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};
