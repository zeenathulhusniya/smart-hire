import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { ApplicationStatus, JobApplication } from '../types';

interface ApplicationModalProps {
  open: boolean;
  initialData?: Partial<JobApplication> | null;
  onClose: () => void;
  onSave: (data: Omit<JobApplication, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
}

const STATUSES: ApplicationStatus[] = [
  'Wishlist',
  'Applied',
  'Under Review',
  'Interview',
  'Offered',
  'Rejected',
];

export const ApplicationModal: React.FC<ApplicationModalProps> = ({
  open,
  initialData,
  onClose,
  onSave,
}) => {
  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [location, setLocation] = useState('Fully Remote (Sri Lanka)');
  const [salary, setSalary] = useState('');
  const [applicationDate, setApplicationDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [jobUrl, setJobUrl] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<ApplicationStatus>('Applied');
  const [followUpDate, setFollowUpDate] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setCompanyName(initialData?.companyName || '');
      setJobTitle(initialData?.jobTitle || '');
      setLocation(initialData?.location || 'Fully Remote (Sri Lanka)');
      setSalary(initialData?.salary || '');
      setApplicationDate(
        initialData?.applicationDate || new Date().toISOString().slice(0, 10)
      );
      setJobUrl(initialData?.jobUrl || '');
      setJobDescription(initialData?.jobDescription || '');
      setNotes(initialData?.notes || '');
      setStatus(initialData?.status || 'Applied');
      setFollowUpDate(initialData?.followUpDate || '');
      setError('');
    }
  }, [open, initialData]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !jobTitle.trim()) {
      setError('Company name and job title are required.');
      return;
    }
    setSaving(true);
    try {
      await onSave({
        companyName: companyName.trim(),
        jobTitle: jobTitle.trim(),
        location: location.trim() || 'Fully Remote (Sri Lanka)',
        salary: salary.trim(),
        applicationDate,
        jobUrl: jobUrl.trim(),
        jobDescription: jobDescription.trim(),
        notes: notes.trim(),
        status,
        followUpDate,
      });
      onClose();
    } catch {
      setError('Could not save application. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#211638]/65">
      <div className="bg-white border border-[#E7E0EF] rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-[0_20px_50px_-12px_rgba(33,22,56,0.35)]">
        <div className="px-6 py-4 border-b border-[#E7E0EF] flex items-center justify-between sticky top-0 bg-white">
          <h2 className="text-lg font-bold text-[#211638]">
            {initialData?.id ? 'Edit Job Application' : 'Add Job Application'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 text-[#756B83] hover:text-[#211638] rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#281C3B] mb-1.5">
                Company Name *
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. WSO2"
                required
                className="w-full px-3.5 py-2 text-sm border border-[#E7E0EF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7046A5]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#281C3B] mb-1.5">
                Job Title *
              </label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Junior Java Developer"
                required
                className="w-full px-3.5 py-2 text-sm border border-[#E7E0EF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7046A5]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#281C3B] mb-1.5">
                Work Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Fully Remote (Sri Lanka)"
                className="w-full px-3.5 py-2 text-sm border border-[#E7E0EF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7046A5]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#281C3B] mb-1.5">
                Salary / Compensation
              </label>
              <input
                type="text"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                placeholder="e.g. LKR 250,000 / mo"
                className="w-full px-3.5 py-2 text-sm border border-[#E7E0EF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7046A5]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#281C3B] mb-1.5">
                Application Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ApplicationStatus)}
                className="w-full px-3.5 py-2 text-sm border border-[#E7E0EF] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#7046A5]"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#281C3B] mb-1.5">
                Application Date
              </label>
              <input
                type="date"
                value={applicationDate}
                onChange={(e) => setApplicationDate(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-[#E7E0EF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7046A5]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#281C3B] mb-1.5">
                Follow-up Date
              </label>
              <input
                type="date"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-[#E7E0EF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7046A5]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#281C3B] mb-1.5">
                Original Job URL
              </label>
              <input
                type="url"
                value={jobUrl}
                onChange={(e) => setJobUrl(e.target.value)}
                placeholder="https://company.com/careers/..."
                className="w-full px-3.5 py-2 text-sm border border-[#E7E0EF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7046A5]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#281C3B] mb-1.5">
              Job Description Summary
            </label>
            <textarea
              rows={3}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Key technologies, remote requirements, or role responsibilities..."
              className="w-full px-3.5 py-2 text-sm border border-[#E7E0EF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7046A5]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#281C3B] mb-1.5">
              Personal Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Resume version used, recruiter contact, interview preparation notes..."
              className="w-full px-3.5 py-2 text-sm border border-[#E7E0EF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7046A5]"
            />
          </div>

          <div className="pt-4 border-t border-[#E7E0EF] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-[#281C3B] bg-white border border-[#E7E0EF] hover:bg-[#FAF8FF] rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 text-sm font-semibold btn-purple-gradient rounded-lg disabled:opacity-60"
            >
              {saving ? 'Saving...' : initialData?.id ? 'Save Changes' : 'Save Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
