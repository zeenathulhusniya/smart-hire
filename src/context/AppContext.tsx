import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  DEFAULT_DEMO_USER,
  DEMO_ACTIVITIES,
  DEMO_APPLICATIONS,
  DEMO_INTERVIEWS,
  DEMO_REMINDERS,
  DEMO_REMOTE_JOBS,
} from '../data/demoData';
import { checkJavaBackendHealth } from '../services/apiClient';
import {
  CreateApplicationInput,
  applicationService,
} from '../services/applicationService';
import { authService, LoginPayload, RegisterPayload } from '../services/authService';
import { chatService } from '../services/chatService';
import { CreateInterviewInput, interviewService } from '../services/interviewService';
import { filterVerifiedSriLankaRemoteJobs, jobService } from '../services/jobService';
import { CreateReminderInput, reminderService } from '../services/reminderService';
import { savedJobService } from '../services/savedJobService';
import {
  ApplicationActivity,
  ApplicationStatus,
  AuthSession,
  ChatMessage,
  Interview,
  JobApplication,
  Reminder,
  RemoteJob,
  ResumeAnalysisResult,
  UserProfile,
} from '../types';
import { generateId } from '../utils/formatters';

interface AppContextValue {
  session: AuthSession | null;
  backendConnected: boolean;
  jobsSourceMode: 'LIVE_BACKEND' | 'DEMO_PREVIEW';
  jobs: RemoteJob[];
  jobsLoading: boolean;
  savedJobIds: string[];
  applications: JobApplication[];
  activities: ApplicationActivity[];
  interviews: Interview[];
  reminders: Reminder[];
  resumeHistory: ResumeAnalysisResult[];
  chatMessages: ChatMessage[];
  login: (payload: LoginPayload) => Promise<AuthSession>;
  register: (payload: RegisterPayload) => Promise<AuthSession>;
  loginDemoUser: () => void;
  logout: () => void;
  updateProfile: (updated: UserProfile) => Promise<void>;
  refreshBackendHealth: () => Promise<boolean>;
  toggleSaveJob: (jobId: string) => Promise<void>;
  addApplication: (input: CreateApplicationInput) => Promise<JobApplication>;
  updateApplication: (id: string, updates: Partial<JobApplication>) => Promise<void>;
  updateApplicationStatus: (id: string, status: ApplicationStatus) => Promise<void>;
  deleteApplication: (id: string) => Promise<void>;
  loadDemoApplications: () => void;
  clearAllApplications: () => void;
  addInterview: (input: CreateInterviewInput) => Promise<Interview>;
  updateInterview: (id: string, updates: Partial<Interview>) => Promise<void>;
  deleteInterview: (id: string) => Promise<void>;
  addReminder: (input: CreateReminderInput) => Promise<Reminder>;
  updateReminder: (id: string, updates: Partial<Reminder>) => Promise<void>;
  toggleReminderComplete: (id: string) => Promise<void>;
  deleteReminder: (id: string) => Promise<void>;
  addResumeAnalysis: (result: ResumeAnalysisResult) => void;
  appendChatMessages: (userMsg: ChatMessage, assistantMsg: ChatMessage) => void;
  clearChatMessages: () => Promise<void>;
  resetDemoWorkspace: () => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

const STORAGE_KEYS = {
  apps: 'smarthire_apps_v1',
  activities: 'smarthire_activities_v1',
  interviews: 'smarthire_interviews_v1',
  reminders: 'smarthire_reminders_v1',
  savedJobs: 'smarthire_saved_jobs_v1',
  resumeHistory: 'smarthire_resume_history_v1',
  chatHistory: 'smarthire_chat_history_v1',
};

function loadJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<AuthSession | null>(() =>
    authService.getSavedSession()
  );
  const [backendConnected, setBackendConnected] = useState(false);
  const [jobsSourceMode, setJobsSourceMode] = useState<'LIVE_BACKEND' | 'DEMO_PREVIEW'>(
    'DEMO_PREVIEW'
  );
  const [jobs, setJobs] = useState<RemoteJob[]>(() =>
    filterVerifiedSriLankaRemoteJobs(DEMO_REMOTE_JOBS)
  );
  const [jobsLoading, setJobsLoading] = useState(true);

  const [savedJobIds, setSavedJobIds] = useState<string[]>(() =>
    loadJson<string[]>(STORAGE_KEYS.savedJobs, ['job-sl-001', 'job-sl-002'])
  );
  const [applications, setApplications] = useState<JobApplication[]>(() =>
    loadJson<JobApplication[]>(STORAGE_KEYS.apps, DEMO_APPLICATIONS)
  );
  const [activities, setActivities] = useState<ApplicationActivity[]>(() =>
    loadJson<ApplicationActivity[]>(STORAGE_KEYS.activities, DEMO_ACTIVITIES)
  );
  const [interviews, setInterviews] = useState<Interview[]>(() =>
    loadJson<Interview[]>(STORAGE_KEYS.interviews, DEMO_INTERVIEWS)
  );
  const [reminders, setReminders] = useState<Reminder[]>(() =>
    loadJson<Reminder[]>(STORAGE_KEYS.reminders, DEMO_REMINDERS)
  );
  const [resumeHistory, setResumeHistory] = useState<ResumeAnalysisResult[]>(() =>
    loadJson<ResumeAnalysisResult[]>(STORAGE_KEYS.resumeHistory, [])
  );
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() =>
    loadJson<ChatMessage[]>(STORAGE_KEYS.chatHistory, [])
  );

  // Persist workspace state locally for seamless multi-page Demo Preview persistence
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.savedJobs, JSON.stringify(savedJobIds));
  }, [savedJobIds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.apps, JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.activities, JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.interviews, JSON.stringify(interviews));
  }, [interviews]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.reminders, JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.resumeHistory, JSON.stringify(resumeHistory));
  }, [resumeHistory]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.chatHistory, JSON.stringify(chatMessages));
  }, [chatMessages]);

  const refreshBackendHealth = useCallback(async () => {
    const health = await checkJavaBackendHealth();
    setBackendConnected(health.connected);
    return health.connected;
  }, []);

  useEffect(() => {
    let active = true;
    const init = async () => {
      setJobsLoading(true);
      const [healthOk, jobResult] = await Promise.all([
        checkJavaBackendHealth(),
        jobService.fetchVerifiedSriLankaJobs(),
      ]);
      if (!active) return;
      setBackendConnected(healthOk.connected);
      setJobs(jobResult.jobs);
      setJobsSourceMode(jobResult.sourceMode);
      setJobsLoading(false);

      if (healthOk.connected && session?.mode === 'LIVE_BACKEND') {
        const [apiApps, apiInts, apiRems, apiSaved, apiChat] = await Promise.all([
          applicationService.listApplications(),
          interviewService.listInterviews(),
          reminderService.listReminders(),
          savedJobService.listSavedJobIds(),
          chatService.fetchHistory(),
        ]);
        if (!active) return;
        if (apiApps) setApplications(apiApps);
        if (apiInts) setInterviews(apiInts);
        if (apiRems) setReminders(apiRems);
        if (apiSaved) setSavedJobIds(apiSaved);
        if (apiChat) setChatMessages(apiChat);
      }
    };
    init();
    return () => {
      active = false;
    };
  }, [session?.mode]);

  const login = async (payload: LoginPayload) => {
    const res = await authService.login(payload);
    setSession(res);
    return res;
  };

  const register = async (payload: RegisterPayload) => {
    const res = await authService.register(payload);
    setSession(res);
    return res;
  };

  const loginDemoUser = () => {
    const demoSession: AuthSession = {
      token: 'demo-preview-token',
      user: DEFAULT_DEMO_USER,
      mode: 'DEMO_PREVIEW',
    };
    authService.saveSession(demoSession);
    setSession(demoSession);
  };

  const logout = () => {
    authService.logout();
    setSession(null);
  };

  const updateProfile = async (updated: UserProfile) => {
    const saved = await authService.updateProfile(updated);
    if (session) {
      const nextSession: AuthSession = { ...session, user: saved };
      authService.saveSession(nextSession);
      setSession(nextSession);
    }
  };

  const toggleSaveJob = async (jobId: string) => {
    const exists = savedJobIds.includes(jobId);
    if (exists) {
      await savedJobService.removeSavedJob(jobId);
      setSavedJobIds((prev) => prev.filter((id) => id !== jobId));
    } else {
      await savedJobService.saveJob(jobId);
      setSavedJobIds((prev) => [jobId, ...prev]);
    }
  };

  const recordActivity = (applicationId: string, companyName: string, jobTitle: string, action: string) => {
    const newAct: ApplicationActivity = {
      id: generateId('act'),
      applicationId,
      companyName,
      jobTitle,
      action,
      timestamp: new Date().toISOString(),
    };
    setActivities((prev) => [newAct, ...prev].slice(0, 30));
  };

  const addApplication = async (input: CreateApplicationInput) => {
    const remoteCreated = await applicationService.createApplication(input);
    const created: JobApplication = remoteCreated || {
      ...input,
      id: generateId('app'),
      userId: session?.user.id || DEFAULT_DEMO_USER.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setApplications((prev) => [created, ...prev]);
    recordActivity(created.id, created.companyName, created.jobTitle, `Added as ${created.status}`);
    return created;
  };

  const updateApplication = async (id: string, updates: Partial<JobApplication>) => {
    const remoteUpdated = await applicationService.updateApplication(id, updates);
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== id) return app;
        const merged = remoteUpdated || {
          ...app,
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        recordActivity(merged.id, merged.companyName, merged.jobTitle, 'Updated application details');
        return merged;
      })
    );
  };

  const updateApplicationStatus = async (id: string, status: ApplicationStatus) => {
    await applicationService.updateStatus(id, status);
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== id) return app;
        recordActivity(app.id, app.companyName, app.jobTitle, `Moved status to ${status}`);
        return { ...app, status, updatedAt: new Date().toISOString() };
      })
    );
  };

  const deleteApplication = async (id: string) => {
    const target = applications.find((a) => a.id === id);
    await applicationService.deleteApplication(id);
    setApplications((prev) => prev.filter((a) => a.id !== id));
    if (target) {
      recordActivity(id, target.companyName, target.jobTitle, 'Removed application');
    }
  };

  const loadDemoApplications = () => {
    setApplications(DEMO_APPLICATIONS);
    setActivities(DEMO_ACTIVITIES);
  };

  const clearAllApplications = () => {
    setApplications([]);
    setActivities([]);
  };

  const addInterview = async (input: CreateInterviewInput) => {
    const remoteCreated = await interviewService.createInterview(input);
    const created: Interview = remoteCreated || {
      ...input,
      id: generateId('int'),
      userId: session?.user.id || DEFAULT_DEMO_USER.id,
      createdAt: new Date().toISOString(),
    };
    setInterviews((prev) => [created, ...prev]);
    return created;
  };

  const updateInterview = async (id: string, updates: Partial<Interview>) => {
    const remoteUpdated = await interviewService.updateInterview(id, updates);
    setInterviews((prev) =>
      prev.map((item) => (item.id === id ? remoteUpdated || { ...item, ...updates } : item))
    );
  };

  const deleteInterview = async (id: string) => {
    await interviewService.deleteInterview(id);
    setInterviews((prev) => prev.filter((item) => item.id !== id));
  };

  const addReminder = async (input: CreateReminderInput) => {
    const remoteCreated = await reminderService.createReminder(input);
    const created: Reminder = remoteCreated || {
      ...input,
      id: generateId('rem'),
      userId: session?.user.id || DEFAULT_DEMO_USER.id,
      createdAt: new Date().toISOString(),
    };
    setReminders((prev) => [created, ...prev]);
    return created;
  };

  const updateReminder = async (id: string, updates: Partial<Reminder>) => {
    const remoteUpdated = await reminderService.updateReminder(id, updates);
    setReminders((prev) =>
      prev.map((item) => (item.id === id ? remoteUpdated || { ...item, ...updates } : item))
    );
  };

  const toggleReminderComplete = async (id: string) => {
    const current = reminders.find((r) => r.id === id);
    if (!current) return;
    await reminderService.toggleComplete(id, !current.completed);
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r))
    );
  };

  const deleteReminder = async (id: string) => {
    await reminderService.deleteReminder(id);
    setReminders((prev) => prev.filter((item) => item.id !== id));
  };

  const addResumeAnalysis = (result: ResumeAnalysisResult) => {
    setResumeHistory((prev) => [result, ...prev].slice(0, 20));
  };

  const appendChatMessages = (userMsg: ChatMessage, assistantMsg: ChatMessage) => {
    setChatMessages((prev) => [...prev, userMsg, assistantMsg]);
  };

  const clearChatMessages = async () => {
    await chatService.clearHistory();
    setChatMessages([]);
  };

  const resetDemoWorkspace = () => {
    setApplications(DEMO_APPLICATIONS);
    setActivities(DEMO_ACTIVITIES);
    setInterviews(DEMO_INTERVIEWS);
    setReminders(DEMO_REMINDERS);
    setSavedJobIds(['job-sl-001', 'job-sl-002']);
    setResumeHistory([]);
    setChatMessages([]);
  };

  return (
    <AppContext.Provider
      value={{
        session,
        backendConnected,
        jobsSourceMode,
        jobs,
        jobsLoading,
        savedJobIds,
        applications,
        activities,
        interviews,
        reminders,
        resumeHistory,
        chatMessages,
        login,
        register,
        loginDemoUser,
        logout,
        updateProfile,
        refreshBackendHealth,
        toggleSaveJob,
        addApplication,
        updateApplication,
        updateApplicationStatus,
        deleteApplication,
        loadDemoApplications,
        clearAllApplications,
        addInterview,
        updateInterview,
        deleteInterview,
        addReminder,
        updateReminder,
        toggleReminderComplete,
        deleteReminder,
        addResumeAnalysis,
        appendChatMessages,
        clearChatMessages,
        resetDemoWorkspace,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used inside AppProvider');
  }
  return ctx;
}
