import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ApplicationsPage } from './pages/ApplicationsPage';
import { CareerAssistantPage } from './pages/CareerAssistantPage';
import { DashboardPage } from './pages/DashboardPage';
import { InterviewsPage } from './pages/InterviewsPage';
import { JobDetailsPage } from './pages/JobDetailsPage';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { ProfilePage } from './pages/ProfilePage';
import { RegisterPage } from './pages/RegisterPage';
import { RemindersPage } from './pages/RemindersPage';
import { RemoteJobsPage } from './pages/RemoteJobsPage';
import { ResumeAnalyzerPage } from './pages/ResumeAnalyzerPage';
import { SavedJobsPage } from './pages/SavedJobsPage';
import { SettingsPage } from './pages/SettingsPage';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/jobs" element={<RemoteJobsPage />} />
          <Route path="/jobs/:id" element={<JobDetailsPage />} />
          <Route path="/applications" element={<ApplicationsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/resume-analyzer" element={<ResumeAnalyzerPage />} />
          <Route path="/career-assistant" element={<CareerAssistantPage />} />
          <Route path="/interviews" element={<InterviewsPage />} />
          <Route path="/reminders" element={<RemindersPage />} />
          <Route path="/saved-jobs" element={<SavedJobsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
