import { apiRequest } from './apiClient';

export const savedJobService = {
  async listSavedJobIds(): Promise<string[] | null> {
    try {
      const items = await apiRequest<{ jobId: string }[]>('/saved-jobs', {
        method: 'GET',
      });
      return items.map((i) => i.jobId);
    } catch {
      return null;
    }
  },

  async saveJob(jobId: string): Promise<boolean> {
    try {
      await apiRequest<void>(`/saved-jobs/${jobId}`, { method: 'POST' });
      return true;
    } catch {
      return false;
    }
  },

  async removeSavedJob(jobId: string): Promise<boolean> {
    try {
      await apiRequest<void>(`/saved-jobs/${jobId}`, { method: 'DELETE' });
      return true;
    } catch {
      return false;
    }
  },
};
