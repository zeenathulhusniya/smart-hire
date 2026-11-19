import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PublicHeader } from '../components/PublicHeader';
import { useApp } from '../context/AppContext';
import { authService } from '../services/authService';

export const LoginPage: React.FC = () => {
  const { login, loginDemoUser } = useApp();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [forgotOpen, setForgotOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password) {
      setError('Please enter both your email address and password.');
      return;
    }
    setLoading(true);
    try {
      await login({ email: email.trim(), password });
      navigate('/dashboard');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unable to sign in. Please verify your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) return;
    const res = await authService.requestPasswordReset(resetEmail.trim());
    setResetMessage(res.message);
  };

  const handleDemoAccess = () => {
    loginDemoUser();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-dashboard-gradient flex flex-col">
      <PublicHeader />
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md card-elevated border rounded-xl p-6 sm:p-8 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-[#211638] tracking-tight">
              Sign in to Smart Hire
            </h1>
            <p className="text-sm text-[#756B83] mt-1">
              Access your Sri Lanka remote job tracker, interviews, and career tools.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
              {error}
            </div>
          )}

          {!forgotOpen ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#281C3B] mb-1.5">
                  Email Address
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
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-[#281C3B]">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotOpen(true);
                      setResetMessage('');
                    }}
                    className="text-xs font-medium text-[#7046A5] hover:text-[#211638]"
                  >
                    Forgot password?
                  </button>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full px-3.5 py-2.5 text-sm border border-[#E7E0EF] rounded-lg text-[#281C3B] placeholder:text-[#756B83] focus:outline-none focus:ring-2 focus:ring-[#7046A5]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 text-sm font-semibold btn-purple-gradient rounded-lg disabled:opacity-60"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#281C3B] mb-1.5">
                  Account Email for Password Reset
                </label>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="you@example.lk"
                  required
                  className="w-full px-3.5 py-2.5 text-sm border border-[#E7E0EF] rounded-lg text-[#281C3B] placeholder:text-[#756B83] focus:outline-none focus:ring-2 focus:ring-[#7046A5]"
                />
              </div>
              {resetMessage && (
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                  {resetMessage}
                </div>
              )}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setForgotOpen(false)}
                  className="flex-1 py-2.5 px-4 text-sm font-medium text-[#281C3B] border border-[#E7E0EF] rounded-lg hover:bg-[#FAF8FF]"
                >
                  Back to Login
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 text-sm font-semibold btn-purple-gradient rounded-lg"
                >
                  Send Reset Link
                </button>
              </div>
            </form>
          )}

          <div className="pt-4 border-t border-[#E7E0EF] space-y-3">
            <button
              type="button"
              onClick={handleDemoAccess}
              className="w-full py-2.5 px-4 text-sm font-semibold text-[#211638] bg-[#E9DDFB] hover:bg-[#DCD0F6] rounded-lg transition-colors"
            >
              Continue in Demo Preview Mode
            </button>
            <p className="text-center text-xs text-[#756B83]">
              New to Smart Hire?{' '}
              <Link to="/register" className="font-semibold text-[#7046A5] hover:text-[#211638]">
                Create a free account
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};
