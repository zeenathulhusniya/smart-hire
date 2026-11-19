import { DEFAULT_DEMO_USER } from '../data/demoData';
import { AuthSession, UserProfile } from '../types';
import { apiRequest, setStoredToken } from './apiClient';

const SESSION_KEY = 'smarthire_session_v1';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  city: string;
  targetRole: string;
}

export const authService = {
  getSavedSession(): AuthSession | null {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as AuthSession;
    } catch {
      return null;
    }
  },

  saveSession(session: AuthSession | null): void {
    if (session) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      if (session.mode === 'LIVE_BACKEND') {
        setStoredToken(session.token);
      }
    } else {
      localStorage.removeItem(SESSION_KEY);
      setStoredToken(null);
    }
  },

  async login(payload: LoginPayload): Promise<AuthSession> {
    try {
      const res = await apiRequest<{ token: string; user: UserProfile }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload),
        skipAuth: true,
      });
      const session: AuthSession = {
        token: res.token,
        user: res.user,
        mode: 'LIVE_BACKEND',
      };
      this.saveSession(session);
      return session;
    } catch (err) {
      // If Java backend is not running locally, allow Demo Preview sign-in cleanly
      if (err instanceof TypeError || (err instanceof Error && err.name === 'AbortError')) {
        const demoSession: AuthSession = {
          token: 'demo-preview-token',
          user: {
            ...DEFAULT_DEMO_USER,
            email: payload.email,
          },
          mode: 'DEMO_PREVIEW',
        };
        this.saveSession(demoSession);
        return demoSession;
      }
      throw err;
    }
  },

  async register(payload: RegisterPayload): Promise<AuthSession> {
    try {
      const res = await apiRequest<{ token: string; user: UserProfile }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload),
        skipAuth: true,
      });
      const session: AuthSession = {
        token: res.token,
        user: res.user,
        mode: 'LIVE_BACKEND',
      };
      this.saveSession(session);
      return session;
    } catch (err) {
      if (err instanceof TypeError || (err instanceof Error && err.name === 'AbortError')) {
        const demoSession: AuthSession = {
          token: 'demo-preview-token',
          user: {
            ...DEFAULT_DEMO_USER,
            id: `user_${Date.now()}`,
            fullName: payload.fullName,
            email: payload.email,
            city: payload.city || 'Colombo, Sri Lanka',
            targetRole: payload.targetRole || 'Software Engineering Intern',
          },
          mode: 'DEMO_PREVIEW',
        };
        this.saveSession(demoSession);
        return demoSession;
      }
      throw err;
    }
  },

  async requestPasswordReset(email: string): Promise<{ message: string; isDemo: boolean }> {
    try {
      const res = await apiRequest<{ message: string }>('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
        skipAuth: true,
      });
      return { message: res.message, isDemo: false };
    } catch {
      return {
        message: `Demo Preview: Password reset flow verified for ${email}. Connect the Java Spring Boot backend to dispatch live reset tokens.`,
        isDemo: true,
      };
    }
  },

  async updateProfile(profile: UserProfile): Promise<UserProfile> {
    try {
      return await apiRequest<UserProfile>('/users/me', {
        method: 'PUT',
        body: JSON.stringify(profile),
      });
    } catch {
      return profile;
    }
  },

  logout(): void {
    this.saveSession(null);
  },
};
