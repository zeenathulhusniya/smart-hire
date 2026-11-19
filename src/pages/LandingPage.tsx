import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Search, ShieldCheck } from 'lucide-react';
import { JobCard } from '../components/JobCard';
import { PublicHeader } from '../components/PublicHeader';
import { useApp } from '../context/AppContext';
import { JOB_CATEGORIES } from '../types';

export const LandingPage: React.FC = () => {
  const { jobs, savedJobIds, toggleSaveJob, session } = useApp();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [heroImgFailed, setHeroImgFailed] = useState(false);
  const [toolsImgFailed, setToolsImgFailed] = useState(false);

  const featuredJobs = jobs.slice(0, 3);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('q', searchQuery.trim());
    if (selectedCategory) params.set('category', selectedCategory);
    navigate(`/jobs${params.toString() ? `?${params.toString()}` : ''}`);
  };

  return (
    <div className="min-h-screen bg-dashboard-gradient text-[#281C3B] flex flex-col">
      <PublicHeader />

      {/* Hero Section */}
      <section className="bg-hero-gradient text-white border-b border-[#49316F]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
              <p className="text-sm font-medium text-[#A78BFA] tracking-wide">
                🇱🇰 Exclusive Sri Lanka Work-From-Home Job Portal &amp; Career Suite
              </p>

              <h1
                className="font-extrabold tracking-tight text-white text-balance leading-[1.1]"
                style={{ fontSize: 'clamp(2.25rem, 4vw, 3.75rem)' }}
              >
                Find Remote Jobs. Build Your Future.
              </h1>

              <p className="text-base sm:text-lg text-[#E9DDFB]/85 max-w-2xl leading-relaxed">
                Discover fully remote Work-From-Home opportunities from local and international employers that explicitly accept applicants residing in Sri Lanka—paired with application tracking, resume matching, and interview preparation.
              </p>

              {/* Search Bar */}
              <form
                onSubmit={handleHeroSearch}
                className="bg-white p-2 rounded-xl border border-[#E7E0EF] flex flex-col sm:flex-row gap-2 max-w-2xl"
              >
                <div className="flex-1 flex items-center gap-2.5 px-3">
                  <Search className="w-4 h-4 text-[#A78BFA] shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Job title, Java, React, QA..."
                    aria-label="Search remote jobs"
                    className="w-full py-2 text-sm text-[#281C3B] placeholder:text-[#756B83] focus:outline-none"
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  aria-label="Filter by category"
                  className="px-3 py-2 text-sm text-[#281C3B] bg-[#FAF8FF] border border-[#E7E0EF] rounded-lg focus:outline-none"
                >
                  <option value="">All Categories</option>
                  {JOB_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-sm font-semibold btn-purple-gradient rounded-lg whitespace-nowrap shrink-0"
                >
                  Search Jobs
                </button>
              </form>

              {/* Prominent Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  to="/jobs"
                  className="px-5 py-3 text-sm font-semibold btn-purple-gradient rounded-lg inline-flex items-center gap-2 whitespace-nowrap"
                >
                  <span>Explore Remote Jobs</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to={session ? '/dashboard' : '/register'}
                  className="px-5 py-3 text-sm font-semibold text-white bg-white/12 hover:bg-white/20 border border-white/20 rounded-lg transition-colors whitespace-nowrap"
                >
                  Create Free Account
                </Link>
                <Link
                  to="/applications"
                  className="px-5 py-3 text-sm font-semibold text-[#E9DDFB] hover:text-white underline underline-offset-4 whitespace-nowrap"
                >
                  Track My Applications
                </Link>
              </div>
            </div>

            {/* Right 16:9 / Stretched Visual */}
            <div className="lg:col-span-5">
              <div className="h-full min-h-[280px] rounded-xl overflow-hidden border border-white/15 bg-[#2B1D48] shadow-[0_14px_34px_-10px_rgba(33,22,56,0.45)]">
                {!heroImgFailed ? (
                  <img
                    src="/src/assets/images/hero_sri_lanka_remote_1794906553102.jpg"
                    alt="Sri Lankan software engineer working remotely from a bright modern desk"
                    referrerPolicy="no-referrer"
                    onError={() => setHeroImgFailed(true)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full p-8 flex flex-col justify-end bg-gradient-to-br from-[#211638] to-[#7046A5]">
                    <p className="text-sm font-semibold text-[#E9DDFB]">
                      🇱🇰 Sri Lanka Remote Workspace
                    </p>
                    <p className="text-lg font-bold text-white mt-1">
                      Verified Work-From-Home Opportunities
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 4-Column Verification Strip below Hero Split */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12 pt-8 border-t border-white/15 text-sm">
            <div>
              <p className="font-semibold text-white">100% Fully Remote</p>
              <p className="text-[#E9DDFB]/75 mt-1 text-xs leading-relaxed">
                Strict exclusion of onsite, hybrid, and relocation-required roles.
              </p>
            </div>
            <div>
              <p className="font-semibold text-white">Sri Lanka Eligible Only</p>
              <p className="text-[#E9DDFB]/75 mt-1 text-xs leading-relaxed">
                Every verified card confirms applicants in Sri Lanka may apply.
              </p>
            </div>
            <div>
              <p className="font-semibold text-white">Source &amp; Expiry Checked</p>
              <p className="text-[#E9DDFB]/75 mt-1 text-xs leading-relaxed">
                Original employer URLs, verification timestamps, and active deadlines.
              </p>
            </div>
            <div>
              <p className="font-semibold text-white">Bilingual Career Prep</p>
              <p className="text-[#E9DDFB]/75 mt-1 text-xs leading-relaxed">
                English and Tamil interview &amp; resume support via Gemini backend.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Remote Jobs */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#211638] tracking-tight">
              Featured Sri Lanka Remote Jobs
            </h2>
            <p className="text-sm text-[#756B83] mt-1.5">
              Sample verified-format listings demonstrating Sri Lanka eligibility and official career portal links.
            </p>
          </div>
          <Link
            to="/jobs"
            className="text-sm font-semibold text-[#7046A5] hover:text-[#211638] inline-flex items-center gap-1.5 whitespace-nowrap"
          >
            <span>View all {jobs.length} remote jobs</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {featuredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              isSaved={savedJobIds.includes(job.id)}
              onToggleSave={toggleSaveJob}
            />
          ))}
        </div>
      </section>

      {/* Popular Job Categories */}
      <section className="bg-white/80 backdrop-blur-sm border-y border-[#E7E0EF] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#211638] tracking-tight">
              Popular Remote Categories
            </h2>
            <p className="text-sm text-[#756B83] mt-1.5">
              Filter verified Sri Lanka work-from-home roles across software engineering, QA, design, support, and analytics.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {JOB_CATEGORIES.map((category) => {
              const count = jobs.filter((j) => j.category === category).length;
              return (
                <Link
                  key={category}
                  to={`/jobs?category=${encodeURIComponent(category)}`}
                  className="p-4 rounded-xl border border-[#E7E0EF] bg-white shadow-[0_3px_12px_-4px_rgba(33,22,56,0.06)] hover:bg-[#E9DDFB]/40 hover:border-[#A78BFA] transition-all flex items-center justify-between gap-2"
                >
                  <span className="text-sm font-semibold text-[#281C3B] truncate">
                    {category}
                  </span>
                  <span className="text-xs font-mono tabular-nums text-[#756B83] shrink-0">
                    {count}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* How Smart Hire Works */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-2xl mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#211638] tracking-tight">
            How Smart Hire Works
          </h2>
          <p className="text-sm text-[#756B83] mt-1.5">
            A structured workflow from verified discovery to offer tracking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: '01. Discover Verified Roles',
              body: 'Browse only fully remote postings where Sri Lankan residency is confirmed and expiry dates are active.',
            },
            {
              step: '02. Analyze Your Resume',
              body: 'Upload your PDF resume to compare skills against a target job description and spot missing competencies.',
            },
            {
              step: '03. Track Every Stage',
              body: 'Manage applications across Table, Kanban, and Timeline views with interview schedules and follow-up reminders.',
            },
            {
              step: '04. Prepare Bilingually',
              body: 'Practice technical and HR questions in English or Tamil using the Career Assistant powered by Gemini.',
            },
          ].map((item) => (
            <div
              key={item.step}
              className="card-elevated card-elevated-hover border rounded-xl p-6 space-y-2.5"
            >
              <h3 className="text-base font-bold text-[#211638]">{item.step}</h3>
              <p className="text-sm text-[#756B83] leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Career Tools Section (Resume Analyzer + Career Assistant) */}
      <section className="bg-featured-gradient text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            <div className="lg:col-span-5">
              <div className="h-full min-h-[260px] rounded-xl overflow-hidden border border-white/25 bg-[#211638] shadow-[0_14px_34px_-10px_rgba(33,22,56,0.4)]">
                {!toolsImgFailed ? (
                  <img
                    src="/src/assets/images/career_workspace_preview_1794906553598.jpg"
                    alt="Clean developer workspace desk with laptop and notebook"
                    referrerPolicy="no-referrer"
                    onError={() => setToolsImgFailed(true)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full p-8 flex items-end bg-hero-gradient">
                    <p className="font-semibold text-[#E9DDFB]">
                      Smart Hire Career Tools
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-[#211638]/92 backdrop-blur-sm border border-white/20 rounded-xl p-6 flex flex-col justify-between gap-5 shadow-[0_14px_34px_-10px_rgba(33,22,56,0.4)]">
                <div className="space-y-3">
                  <ShieldCheck className="w-6 h-6 text-[#A78BFA]" />
                  <h3 className="text-xl font-bold text-white">Resume Analyzer</h3>
                  <p className="text-sm text-[#E9DDFB]/85 leading-relaxed">
                    Validate and upload PDF resumes securely through the Java Spring Boot backend to calculate match scores, identify missing skills, and receive targeted recommendations.
                  </p>
                  <ul className="text-xs text-[#E9DDFB]/85 space-y-1.5 pt-1">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#A78BFA] shrink-0" />
                      <span>PDF text extraction &amp; size validation</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#A78BFA] shrink-0" />
                      <span>Matched vs. missing skill breakdown</span>
                    </li>
                  </ul>
                </div>
                <Link
                  to="/resume-analyzer"
                  className="px-4 py-2.5 text-sm font-semibold btn-purple-gradient rounded-lg text-center"
                >
                  Open Resume Analyzer
                </Link>
              </div>

              <div className="bg-[#211638]/92 backdrop-blur-sm border border-white/20 rounded-xl p-6 flex flex-col justify-between gap-5 shadow-[0_14px_34px_-10px_rgba(33,22,56,0.4)]">
                <div className="space-y-3">
                  <ShieldCheck className="w-6 h-6 text-[#A78BFA]" />
                  <h3 className="text-xl font-bold text-white">Career Assistant</h3>
                  <p className="text-sm text-[#E9DDFB]/85 leading-relaxed">
                    Practice technical Java, React, and HR interview questions, draft follow-up emails, and receive career guidance in both English and Tamil.
                  </p>
                  <ul className="text-xs text-[#E9DDFB]/85 space-y-1.5 pt-1">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#A78BFA] shrink-0" />
                      <span>Tamil &amp; English bilingual guidance</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#A78BFA] shrink-0" />
                      <span>Persistent MySQL chat history</span>
                    </li>
                  </ul>
                </div>
                <Link
                  to="/career-assistant"
                  className="px-4 py-2.5 text-sm font-semibold text-white bg-white/15 hover:bg-white/25 border border-white/20 rounded-lg transition-colors text-center"
                >
                  Open Career Assistant
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sample Testimonials (Explicitly labelled as sample content) */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8">
          <p className="text-xs font-semibold text-[#7046A5] mb-1">
            Sample Content — Illustrative User Scenarios
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#211638] tracking-tight">
            Built for Sri Lankan Remote Job Seekers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              quote:
                'Filtering out US-only and hybrid jobs saved hours every week. Seeing the Sri Lanka eligibility confirmation upfront made applying focused and practical.',
              name: 'Kavindu Perera (Sample Persona)',
              role: 'Software Engineering Intern, Moratuwa',
            },
            {
              quote:
                'Comparing my internship CV against Spring Boot job descriptions highlighted missing JUnit and Docker keywords before I submitted my application.',
              name: 'Nivetha Selvaraj (Sample Persona)',
              role: 'Junior Java Developer Applicant, Jaffna',
            },
            {
              quote:
                'Having follow-up reminders, interview links, and Tamil interview prep in one workspace kept my remote internship search organized.',
              name: 'Rifath Ahamed (Sample Persona)',
              role: 'QA Automation Applicant, Kandy',
            },
          ].map((item) => (
            <blockquote
              key={item.name}
              className="card-elevated card-elevated-hover border rounded-xl p-6 flex flex-col justify-between gap-4"
            >
              <p className="text-sm text-[#281C3B] leading-relaxed">“{item.quote}”</p>
              <footer className="pt-3 border-t border-[#E7E0EF]">
                <p className="text-sm font-bold text-[#211638]">{item.name}</p>
                <p className="text-xs text-[#756B83]">{item.role}</p>
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      {/* Quiet Footer */}
      <footer className="mt-auto bg-white/90 backdrop-blur-sm border-t border-[#E7E0EF] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <p className="text-base font-bold text-[#211638]">Smart Hire</p>
            <p className="text-xs text-[#756B83] mt-1">
              Find Remote Jobs. Build Your Future. · Sri Lanka Work-From-Home Career Platform
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-xs font-medium text-[#756B83]">
            <Link to="/jobs" className="hover:text-[#211638]">Remote Jobs</Link>
            <Link to="/applications" className="hover:text-[#211638]">Application Tracker</Link>
            <Link to="/analytics" className="hover:text-[#211638]">Analytics</Link>
            <Link to="/resume-analyzer" className="hover:text-[#211638]">Resume Analyzer</Link>
            <Link to="/career-assistant" className="hover:text-[#211638]">Career Assistant</Link>
            <Link to="/login" className="hover:text-[#211638]">Sign In</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
