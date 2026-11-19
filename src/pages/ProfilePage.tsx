import React, { useState } from 'react';
import { DEFAULT_DEMO_USER } from '../data/demoData';
import { useApp } from '../context/AppContext';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { ExperienceLevel, UserProfile } from '../types';

const LEVELS: ExperienceLevel[] = [
  'Internship',
  'Entry-level',
  'Junior',
  'Mid-level',
  'Senior',
];

export const ProfilePage: React.FC = () => {
  const { session, updateProfile, loginDemoUser } = useApp();
  const baseUser = session?.user || DEFAULT_DEMO_USER;

  const [form, setForm] = useState<UserProfile>(baseUser);
  const [skillsInput, setSkillsInput] = useState(baseUser.skills.join(', '));
  const [savedBanner, setSavedBanner] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      loginDemoUser();
    }
    const updated: UserProfile = {
      ...form,
      skills: skillsInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    };
    await updateProfile(updated);
    setSavedBanner(true);
    window.setTimeout(() => setSavedBanner(false), 3500);
  };

  return (
    <DashboardLayout
      title="User Profile"
      breadcrumb="Account / Profile"
    >
      <div className="max-w-4xl space-y-6">
        {savedBanner && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-sm font-medium">
            Profile updated successfully.
          </div>
        )}

        <div className="card-elevated border rounded-xl p-6 flex flex-wrap items-center gap-5">
          <img
            src="/src/assets/images/avatar_student_profile_1794906554157.jpg"
            alt={form.fullName}
            referrerPolicy="no-referrer"
            className="w-20 h-20 rounded-full object-cover border-2 border-[#E9DDFB] shrink-0"
          />
          <div>
            <h2 className="text-xl font-bold text-[#211638]">{form.fullName}</h2>
            <p className="text-sm text-[#7046A5] font-medium">{form.targetRole}</p>
            <p className="text-xs text-[#756B83] mt-1">
              🇱🇰 {form.city} · {form.experienceLevel}
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="card-elevated border rounded-xl p-6 space-y-5"
        >
          <h3 className="text-base font-bold text-[#211638]">
            Edit Personal &amp; Remote Career Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#281C3B] mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                required
                className="w-full px-3.5 py-2 text-sm border border-[#E7E0EF] rounded-lg text-[#281C3B] focus:outline-none focus:ring-2 focus:ring-[#7046A5]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#281C3B] mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="w-full px-3.5 py-2 text-sm border border-[#E7E0EF] rounded-lg text-[#281C3B] focus:outline-none focus:ring-2 focus:ring-[#7046A5]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#281C3B] mb-1.5">
                Phone Number (Sri Lanka)
              </label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3.5 py-2 text-sm border border-[#E7E0EF] rounded-lg text-[#281C3B] focus:outline-none focus:ring-2 focus:ring-[#7046A5]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#281C3B] mb-1.5">
                City / Province
              </label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full px-3.5 py-2 text-sm border border-[#E7E0EF] rounded-lg text-[#281C3B] focus:outline-none focus:ring-2 focus:ring-[#7046A5]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#281C3B] mb-1.5">
                Target Role
              </label>
              <input
                type="text"
                value={form.targetRole}
                onChange={(e) => setForm({ ...form, targetRole: e.target.value })}
                className="w-full px-3.5 py-2 text-sm border border-[#E7E0EF] rounded-lg text-[#281C3B] focus:outline-none focus:ring-2 focus:ring-[#7046A5]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#281C3B] mb-1.5">
                Experience Level
              </label>
              <select
                value={form.experienceLevel}
                onChange={(e) =>
                  setForm({
                    ...form,
                    experienceLevel: e.target.value as ExperienceLevel,
                  })
                }
                className="w-full px-3.5 py-2 text-sm border border-[#E7E0EF] rounded-lg bg-white text-[#281C3B] focus:outline-none focus:ring-2 focus:ring-[#7046A5]"
              >
                {LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#281C3B] mb-1.5">
              Core Technical &amp; Remote Skills (comma-separated)
            </label>
            <input
              type="text"
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-[#E7E0EF] rounded-lg text-[#281C3B] focus:outline-none focus:ring-2 focus:ring-[#7046A5]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#281C3B] mb-1.5">
              Professional Bio
            </label>
            <textarea
              rows={3}
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              className="w-full px-3.5 py-2 text-sm border border-[#E7E0EF] rounded-lg text-[#281C3B] focus:outline-none focus:ring-2 focus:ring-[#7046A5]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#281C3B] mb-1.5">
                GitHub URL
              </label>
              <input
                type="url"
                value={form.githubUrl}
                onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-[#E7E0EF] rounded-lg text-[#281C3B] focus:outline-none focus:ring-2 focus:ring-[#7046A5]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#281C3B] mb-1.5">
                LinkedIn URL
              </label>
              <input
                type="url"
                value={form.linkedinUrl}
                onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-[#E7E0EF] rounded-lg text-[#281C3B] focus:outline-none focus:ring-2 focus:ring-[#7046A5]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#281C3B] mb-1.5">
                Portfolio URL
              </label>
              <input
                type="url"
                value={form.portfolioUrl}
                onChange={(e) => setForm({ ...form, portfolioUrl: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-[#E7E0EF] rounded-lg text-[#281C3B] focus:outline-none focus:ring-2 focus:ring-[#7046A5]"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-semibold btn-purple-gradient rounded-lg"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};
