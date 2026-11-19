export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const TOKEN_STORAGE_KEY = 'smarthire_jwt_token';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setStoredToken(token: string | null): void {
  if (token) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
}

export interface ApiFetchOptions extends RequestInit {
  skipAuth?: boolean;
}

export async function apiRequest<T>(
  endpoint: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  const { skipAuth = false, headers, ...rest } = options;
  const token = getStoredToken();
  const isFormData = rest.body instanceof FormData;

  const finalHeaders: Record<string, string> = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(headers as Record<string, string>),
  };

  if (!skipAuth && token) {
    finalHeaders['Authorization'] = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 5500);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...rest,
      headers: finalHeaders,
      signal: controller.signal,
    });

    if (!response.ok) {
      let message = `Request failed (${response.status})`;
      try {
        const errBody = await response.json();
        message = errBody.message || errBody.error || message;
      } catch {
        // Ignore non-JSON error body
      }
      throw new Error(message);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return (await response.json()) as T;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

export async function checkJavaBackendHealth(): Promise<{
  connected: boolean;
  service?: string;
  timestamp?: string;
}> {
  try {
    const data = await apiRequest<{ status: string; service: string; timestamp: string }>(
      '/health',
      { method: 'GET', skipAuth: true }
    );
    return {
      connected: data.status === 'UP',
      service: data.service,
      timestamp: data.timestamp,
    };
  } catch {
    return { connected: false };
  }
}
