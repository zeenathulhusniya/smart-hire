import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PublicHeader } from '../components/PublicHeader';
import { useApp } from '../context/AppContext';
import { JOB_CATEGORIES } from '../types';

export const RegisterPage: React.FC = () => {
  const { register } = useApp();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Colombo, Sri Lanka');
  const [targetRole, setTargetRole] = useState<string>(JOB_CATEGORIES[0]);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (fullName.trim().length < 2) {
      setError('Please enter your full name.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await register({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        city: city.trim(),
        targetRole,
      });
      navigate('/dashboard');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Registration failed. Please check your details.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dashboard-gradient flex flex-col">
      <PublicHeader />
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-lg card-elevated border rounded-xl p-6 sm:p-8 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-[#211638] tracking-tight">
              Create your Smart Hire account
            </h1>
            <p className="text-sm text-[#756B83] mt-1">
              Built for Sri Lankan remote developers, interns, designers, and analysts.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#281C3B] mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Amina Farook"
                  required
                  className="w-full px-3.5 py-2.5 text-sm border border-[#E7E0EF] rounded-lg text-[#281C3B] placeholder:text-[#756B83] focus:outline-none focus:ring-2 focus:ring-[#7046A5]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#281C3B] mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.lk"
                  required
                  className="w-full px-3.5 py-2.5 text-sm border border-[#E7E0EF] rounded-lg text-[#281C3B] placeholder:text-[#756B83] focus:outline-none focus:ring-2 focus:ring-[#7046A5]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#281C3B] mb-1.5">
                  City / District in Sri Lanka
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Colombo / Kandy / Jaffna / Galle"
                  className="w-full px-3.5 py-2.5 text-sm border border-[#E7E0EF] rounded-lg text-[#281C3B] placeholder:text-[#756B83] focus:outline-none focus:ring-2 focus:ring-[#7046A5]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#281C3B] mb-1.5">
                  Target Remote Role
                </label>
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-[#E7E0EF] rounded-lg bg-white text-[#281C3B] focus:outline-none focus:ring-2 focus:ring-[#7046A5]"
                >
                  {JOB_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#281C3B] mb-1.5">
                  Password (min 8 chars) *
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 text-sm border border-[#E7E0EF] rounded-lg text-[#281C3B] focus:outline-none focus:ring-2 focus:ring-[#7046A5]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#281C3B] mb-1.5">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 text-sm border border-[#E7E0EF] rounded-lg text-[#281C3B] focus:outline-none focus:ring-2 focus:ring-[#7046A5]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 text-sm font-semibold btn-purple-gradient rounded-lg disabled:opacity-60"
            >
              {loading ? 'Creating account...' : 'Create Free Account'}
            </button>
          </form>

          <p className="text-center text-xs text-[#756B83] pt-2 border-t border-[#E7E0EF]">
            Already registered?{' '}
            <Link to="/login" className="font-semibold text-[#7046A5] hover:text-[#211638]">
              Sign in here
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};
