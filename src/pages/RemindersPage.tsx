import React, { useState } from 'react';
import { CheckSquare, Plus, Square, Trash2, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { ReminderType } from '../types';
import { daysUntil, formatDateShort } from '../utils/formatters';

const REMINDER_TYPES: ReminderType[] = [
  'Follow-up',
  'Interview',
  'Application Deadline',
];

export const RemindersPage: React.FC = () => {
  const { reminders, addReminder, toggleReminderComplete, deleteReminder } =
    useApp();

  const [filter, setFilter] = useState<'upcoming' | 'completed'>('upcoming');
  const [modalOpen, setModalOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [reminderType, setReminderType] = useState<ReminderType>('Follow-up');
  const [dueDate, setDueDate] = useState(new Date().toISOString().slice(0, 10));
  const [dueTime, setDueTime] = useState('10:00');
  const [relatedCompany, setRelatedCompany] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    await addReminder({
      title: title.trim(),
      description: description.trim(),
      reminderType,
      dueDate,
      dueTime,
      relatedCompany: relatedCompany.trim(),
      completed: false,
    });
    setTitle('');
    setDescription('');
    setRelatedCompany('');
    setModalOpen(false);
  };

  const visible = reminders.filter((r) =>
    filter === 'upcoming' ? !r.completed : r.completed
  );

  return (
    <DashboardLayout
      title="Reminders"
      breadcrumb="Workspace / Reminders"
      actionButton={
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 text-sm font-semibold btn-purple-gradient rounded-lg inline-flex items-center gap-1.5 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Add Reminder</span>
        </button>
      }
    >
      <div className="space-y-6">
        <div className="flex items-center gap-1 p-1 bg-[#E9DDFB]/60 border border-[#E7E0EF] rounded-lg w-fit">
          <button
            type="button"
            onClick={() => setFilter('upcoming')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              filter === 'upcoming'
                ? 'btn-purple-gradient text-white shadow-sm'
                : 'text-[#756B83] hover:text-[#211638]'
            }`}
          >
            Upcoming ({reminders.filter((r) => !r.completed).length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('completed')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              filter === 'completed'
                ? 'btn-purple-gradient text-white shadow-sm'
                : 'text-[#756B83] hover:text-[#211638]'
            }`}
          >
            Completed ({reminders.filter((r) => r.completed).length})
          </button>
        </div>

        {visible.length === 0 ? (
          <div className="card-elevated border rounded-xl p-12 text-center space-y-3">
            <h2 className="text-lg font-bold text-[#211638]">
              No {filter} reminders
            </h2>
            <p className="text-sm text-[#756B83]">
              Set follow-up, interview, or application deadline reminders so nothing slips past.
            </p>
          </div>
        ) : (
          <div className="card-elevated border rounded-xl divide-y divide-[#E7E0EF]">
            {visible.map((rem) => {
              const delta = daysUntil(rem.dueDate);
              const urgencyLabel = rem.completed
                ? 'Completed'
                : delta < 0
                ? 'Overdue'
                : delta === 0
                ? 'Due Today'
                : `In ${delta} day${delta === 1 ? '' : 's'}`;
              const urgencyStyle = rem.completed
                ? 'text-emerald-700 bg-emerald-50'
                : delta < 0
                ? 'text-red-700 bg-red-50'
                : delta <= 2
                ? 'text-amber-800 bg-amber-50'
                : 'text-[#7046A5] bg-[#E9DDFB]';

              return (
                <div
                  key={rem.id}
                  className="p-5 flex items-start justify-between gap-4"
                >
                  <button
                    type="button"
                    onClick={() => toggleReminderComplete(rem.id)}
                    className="flex items-start gap-3.5 text-left flex-1 min-w-0"
                  >
                    {rem.completed ? (
                      <CheckSquare className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                    ) : (
                      <Square className="w-5 h-5 text-[#A78BFA] hover:text-[#7046A5] mt-0.5 shrink-0" />
                    )}
                    <div className="min-w-0">
                      <p
                        className={`text-sm font-bold ${
                          rem.completed
                            ? 'line-through text-[#756B83]'
                            : 'text-[#211638]'
                        }`}
                      >
                        {rem.title}
                      </p>
                      {rem.description && (
                        <p className="text-xs text-[#756B83] mt-1">
                          {rem.description}
                        </p>
                      )}
                      <p className="text-xs text-[#756B83] mt-1.5 tabular-nums">
                        {rem.reminderType}
                        {rem.relatedCompany ? ` · ${rem.relatedCompany}` : ''} ·{' '}
                        {formatDateShort(rem.dueDate)} at {rem.dueTime}
                      </p>
                    </div>
                  </button>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`px-2.5 py-1 text-xs font-semibold rounded-md ${urgencyStyle}`}
                    >
                      {urgencyLabel}
                    </span>
                    <button
                      type="button"
                      onClick={() => deleteReminder(rem.id)}
                      aria-label="Delete reminder"
                      className="p-1.5 text-[#756B83] hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#211638]/65">
          <div className="bg-white border border-[#E7E0EF] rounded-xl w-full max-w-md p-6 space-y-4 shadow-[0_20px_50px_-12px_rgba(33,22,56,0.35)]">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#211638]">New Reminder</h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-[#756B83] hover:text-[#211638]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#281C3B] mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="e.g. Follow up with WSO2 recruiter"
                  className="w-full px-3 py-2 text-sm border border-[#E7E0EF] rounded-lg text-[#281C3B] placeholder:text-[#756B83] focus:outline-none focus:ring-2 focus:ring-[#7046A5]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#281C3B] mb-1">
                    Type
                  </label>
                  <select
                    value={reminderType}
                    onChange={(e) => setReminderType(e.target.value as ReminderType)}
                    className="w-full px-3 py-2 text-sm border border-[#E7E0EF] rounded-lg bg-white text-[#281C3B] focus:outline-none focus:ring-2 focus:ring-[#7046A5]"
                  >
                    {REMINDER_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#281C3B] mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    value={relatedCompany}
                    onChange={(e) => setRelatedCompany(e.target.value)}
                    placeholder="Optional"
                    className="w-full px-3 py-2 text-sm border border-[#E7E0EF] rounded-lg text-[#281C3B] placeholder:text-[#756B83] focus:outline-none focus:ring-2 focus:ring-[#7046A5]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#281C3B] mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-sm border border-[#E7E0EF] rounded-lg text-[#281C3B] focus:outline-none focus:ring-2 focus:ring-[#7046A5]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#281C3B] mb-1">
                    Due Time
                  </label>
                  <input
                    type="time"
                    value={dueTime}
                    onChange={(e) => setDueTime(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-sm border border-[#E7E0EF] rounded-lg text-[#281C3B] focus:outline-none focus:ring-2 focus:ring-[#7046A5]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#281C3B] mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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
                  Save Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};
