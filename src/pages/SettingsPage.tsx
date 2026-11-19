import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { DEFAULT_DEMO_USER } from '../data/demoData';
import { useApp } from '../context/AppContext';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { API_BASE_URL } from '../services/apiClient';

export const SettingsPage: React.FC = () => {
  const {
    session,
    backendConnected,
    refreshBackendHealth,
    updateProfile,
    resetDemoWorkspace,
  } = useApp();

  const user = session?.user || DEFAULT_DEMO_USER;
  const [emailAlerts, setEmailAlerts] = useState(user.emailRemindersEnabled);
  const [interviewAlerts, setInterviewAlerts] = useState(user.interviewAlertsEnabled);
  const [deadlineAlerts, setDeadlineAlerts] = useState(user.deadlineAlertsEnabled);
  const [language, setLanguage] = useState<'en' | 'ta'>(user.preferredLanguage);
  const [checkingHealth, setCheckingHealth] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const handleCheckBackend = async () => {
    setCheckingHealth(true);
    const ok = await refreshBackendHealth();
    setStatusMessage(
      ok
        ? `Connected to Java 21 Spring Boot backend at ${API_BASE_URL}.`
        : `Java Spring Boot backend did not respond at ${API_BASE_URL}/health. Continuing in Demo Preview Mode.`
    );
    setCheckingHealth(false);
  };

  const handleSavePrefs = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      ...user,
      preferredLanguage: language,
      emailRemindersEnabled: emailAlerts,
      interviewAlertsEnabled: interviewAlerts,
      deadlineAlertsEnabled: deadlineAlerts,
    });
    setStatusMessage('Notification and language preferences saved.');
  };

  return (
    <DashboardLayout title="Settings" breadcrumb="Account / Settings">
      <div className="max-w-3xl space-y-6">
        {statusMessage && (
          <div className="bg-[#E9DDFB] border border-[#A78BFA]/40 text-[#211638] px-4 py-3 rounded-xl text-sm">
            {statusMessage}
          </div>
        )}

        {/* Backend Connection Card */}
        <section className="card-elevated border rounded-xl p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-[#211638]">
                Java Spring Boot Backend Connection
              </h2>
              <p className="text-xs text-[#756B83] mt-1">
                Configured endpoint: <code className="font-mono">{API_BASE_URL}</code>
              </p>
            </div>
            <button
              type="button"
              onClick={handleCheckBackend}
              disabled={checkingHealth}
              className="px-4 py-2 text-xs font-semibold text-white bg-hero-gradient hover:opacity-95 rounded-lg inline-flex items-center gap-2 shadow-sm transition-opacity"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${checkingHealth ? 'animate-spin' : ''}`} />
              <span>Test /api/health</span>
            </button>
          </div>

          <div className="text-sm">
            <span className="font-semibold text-[#281C3B]">Current State: </span>
            <span
              className={`font-semibold ${
                backendConnected ? 'text-emerald-700' : 'text-amber-700'
              }`}
            >
              {backendConnected
                ? 'Connected (Live Java + MySQL + Gemini)'
                : 'Offline — Demo Preview Mode Active'}
            </span>
          </div>
        </section>

        {/* Preferences */}
        <form
          onSubmit={handleSavePrefs}
          className="card-elevated border rounded-xl p-6 space-y-5"
        >
          <h2 className="text-base font-bold text-[#211638]">
            Language &amp; Reminder Preferences
          </h2>

          <div>
            <label className="block text-xs font-semibold text-[#281C3B] mb-1.5">
              Preferred Career Assistant Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'en' | 'ta')}
              className="w-full sm:w-64 px-3 py-2 text-sm border border-[#E7E0EF] rounded-lg bg-white text-[#281C3B] focus:outline-none focus:ring-2 focus:ring-[#7046A5]"
            >
              <option value="en">English</option>
              <option value="ta">தமிழ் (Tamil)</option>
            </select>
          </div>

          <div className="space-y-3 pt-2">
            <label className="flex items-center gap-3 text-sm text-[#281C3B] cursor-pointer">
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 accent-[#7046A5] rounded"
              />
              <span>Enable follow-up reminder alerts</span>
            </label>
            <label className="flex items-center gap-3 text-sm text-[#281C3B] cursor-pointer">
              <input
                type="checkbox"
                checked={interviewAlerts}
                onChange={(e) => setInterviewAlerts(e.target.checked)}
                className="w-4 h-4 accent-[#7046A5] rounded"
              />
              <span>Enable upcoming interview alerts</span>
            </label>
            <label className="flex items-center gap-3 text-sm text-[#281C3B] cursor-pointer">
              <input
                type="checkbox"
                checked={deadlineAlerts}
                onChange={(e) => setDeadlineAlerts(e.target.checked)}
                className="w-4 h-4 accent-[#7046A5] rounded"
              />
              <span>Enable Sri Lanka remote job deadline alerts</span>
            </label>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 text-sm font-semibold btn-purple-gradient rounded-lg"
            >
              Save Preferences
            </button>
          </div>
        </form>

        {/* Demo Workspace Reset */}
        <section className="card-elevated border rounded-xl p-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-[#211638]">
              Reset Demo Preview Workspace
            </h2>
            <p className="text-xs text-[#756B83] mt-1">
              Restore initial sample demo applications, interviews, and reminders in browser storage.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              resetDemoWorkspace();
              setStatusMessage('Demo workspace restored to initial sample records.');
            }}
            className="px-4 py-2 text-xs font-semibold text-[#211638] bg-[#E9DDFB] hover:bg-[#DCD0F6] rounded-lg transition-colors"
          >
            Restore Sample Data
          </button>
        </section>
      </div>
    </DashboardLayout>
  );
};
