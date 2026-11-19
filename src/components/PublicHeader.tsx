import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PublicHeader: React.FC = () => {
  const { session } = useApp();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { label: 'Remote Jobs', to: '/jobs' },
    { label: 'Tracker', to: '/applications' },
    { label: 'Resume Analyzer', to: '/resume-analyzer' },
    { label: 'Career Assistant', to: '/career-assistant' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#E7E0EF] shadow-[0_2px_12px_-4px_rgba(33,22,56,0.06)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark only */}
        <Link
          to="/"
          className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-[#211638] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7046A5] rounded-md"
        >
          <span className="w-8 h-8 rounded-lg bg-hero-gradient text-white flex items-center justify-center text-sm font-extrabold shadow-sm">
            SH
          </span>
          <span>Smart Hire</span>
        </Link>

        {/* Zone 2: 4 concise single-line nav links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#756B83]">
          {navItems.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`whitespace-nowrap shrink-0 transition-colors hover:text-[#211638] py-1 ${
                  active ? 'text-[#7046A5] font-semibold' : ''
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="hidden md:flex items-center shrink-0">
          <Link
            to={session ? '/dashboard' : '/login'}
            className="px-4 py-2 text-sm font-semibold btn-purple-gradient rounded-lg whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7046A5] focus-visible:ring-offset-2"
          >
            {session ? 'Open Workspace' : 'Sign In'}
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
          className="md:hidden p-2 rounded-lg text-[#281C3B] hover:bg-[#E9DDFB] min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-[#E7E0EF] bg-white px-4 py-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-sm font-medium text-[#281C3B] hover:bg-[#E9DDFB]"
            >
              {item.label}
            </Link>
          ))}
          <Link
            to={session ? '/dashboard' : '/login'}
            onClick={() => setMobileOpen(false)}
            className="block w-full text-center px-4 py-2.5 rounded-lg text-sm font-semibold btn-purple-gradient"
          >
            {session ? 'Open Workspace' : 'Sign In'}
          </Link>
        </div>
      )}
    </header>
  );
};
