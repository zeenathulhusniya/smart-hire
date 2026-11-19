import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  Bell,
  Bookmark,
  Briefcase,
  CalendarClock,
  FileSearch,
  Kanban,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  User,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface DashboardLayoutProps {
  title: string;
  breadcrumb: string;
  actionButton?: React.ReactNode;
  children: React.ReactNode;
}

const NAV_LINKS = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Remote Jobs', to: '/jobs', icon: Briefcase },
  { label: 'Job Tracker', to: '/applications', icon: Kanban },
  { label: 'Analytics', to: '/analytics', icon: BarChart3 },
  { label: 'Resume Analyzer', to: '/resume-analyzer', icon: FileSearch },
  { label: 'Career Assistant', to: '/career-assistant', icon: MessageSquare },
  { label: 'Interviews', to: '/interviews', icon: CalendarClock },
  { label: 'Reminders', to: '/reminders', icon: Bell },
  { label: 'Saved Jobs', to: '/saved-jobs', icon: Bookmark },
  { label: 'Profile', to: '/profile', icon: User },
  { label: 'Settings', to: '/settings', icon: Settings },
];

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  title,
  breadcrumb,
  actionButton,
  children,
}) => {
  const { session, backendConnected, logout, reminders } = useApp();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pendingRemindersCount = reminders.filter((r) => !r.completed).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderNav = (onNavigate?: () => void) => (
    <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
      {NAV_LINKS.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                isActive
                  ? 'btn-purple-gradient text-white'
                  : 'text-[#E9DDFB]/85 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#A78BFA]'}`} />
                  <span>{item.label}</span>
                </span>
                {item.to === '/reminders' && pendingRemindersCount > 0 && (
                  <span className="text-xs font-mono tabular-nums text-[#E9DDFB] bg-[#312252] px-1.5 py-0.5 rounded">
                    {pendingRemindersCount}
                  </span>
                )}
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-dashboard-gradient text-[#281C3B] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-sidebar-gradient text-white border-r border-[#49316F]/50 shadow-[4px_0_24px_-6px_rgba(33,22,56,0.3)]">
        <div className="h-16 px-5 flex items-center border-b border-white/10 shrink-0">
          <Link to="/" className="flex items-center gap-2.5 font-bold text-lg tracking-tight text-white">
            <span className="w-8 h-8 rounded-lg btn-purple-gradient text-white flex items-center justify-center text-sm font-extrabold">
              SH
            </span>
            <span>Smart Hire</span>
          </Link>
        </div>

        {renderNav()}

        <div className="p-4 border-t border-white/10 space-y-3">
          <div className="flex items-center gap-3">
            <img
              src="/src/assets/images/avatar_student_profile_1794906554157.jpg"
              alt={session?.user.fullName || 'Applicant profile'}
              referrerPolicy="no-referrer"
              className="w-9 h-9 rounded-full object-cover border border-[#A78BFA]/60 shrink-0"
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {session?.user.fullName || 'Guest Applicant'}
              </p>
              <p className="text-xs text-[#E9DDFB]/75 truncate">
                {session?.user.city || 'Sri Lanka Remote'}
              </p>
            </div>
          </div>

          {session ? (
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-[#E9DDFB] hover:text-white bg-white/10 hover:bg-white/15 border border-white/10 rounded-lg transition-colors"
            >
              <LogOut className="w-3.5 h-3.5 text-[#A78BFA]" />
              <span>Sign Out</span>
            </button>
          ) : (
            <Link
              to="/login"
              className="w-full flex items-center justify-center px-3 py-2 text-xs font-semibold btn-purple-gradient rounded-lg"
            >
              Sign In / Create Account
            </Link>
          )}
        </div>
      </aside>

      {/* Mobile Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-[#211638]/65"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative w-64 max-w-[80vw] bg-sidebar-gradient text-white flex flex-col z-10">
            <div className="h-16 px-5 flex items-center justify-between border-b border-white/10">
              <Link
                to="/"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-2.5 font-bold text-lg text-white"
              >
                <span className="w-8 h-8 rounded-lg btn-purple-gradient text-white flex items-center justify-center text-sm font-extrabold">
                  SH
                </span>
                <span>Smart Hire</span>
              </Link>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close sidebar"
                className="p-2 text-[#E9DDFB] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {renderNav(() => setSidebarOpen(false))}
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 h-16 bg-white/85 backdrop-blur-md border-b border-[#E7E0EF] px-4 sm:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation"
              className="lg:hidden p-2 -ml-2 text-[#281C3B] hover:bg-[#E9DDFB] rounded-lg min-h-[40px] min-w-[40px] flex items-center justify-center"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <p className="text-xs text-[#756B83] truncate">{breadcrumb}</p>
              <h1 className="text-lg font-bold text-[#211638] truncate">{title}</h1>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {actionButton}
          </div>
        </header>

        {!backendConnected && (
          <div className="bg-[#E9DDFB]/60 border-b border-[#E7E0EF] px-4 sm:px-8 py-2 text-xs text-[#281C3B] flex flex-wrap items-center justify-between gap-2">
            <span>
              <strong>Demo Preview Mode:</strong> Java Spring Boot API (<code className="font-mono">localhost:8080/api</code>) is not connected. Sample listings and browser session data are clearly labelled as demo data.
            </span>
            <Link
              to="/settings"
              className="font-semibold text-[#7046A5] hover:text-[#211638] whitespace-nowrap"
            >
              Check Backend Status
            </Link>
          </div>
        )}

        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
