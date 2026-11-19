import { Interview } from '../types';
import { apiRequest } from './apiClient';

export type CreateInterviewInput = Omit<Interview, 'id' | 'userId' | 'createdAt'>;

export const interviewService = {
  async listInterviews(): Promise<Interview[] | null> {
    try {
      return await apiRequest<Interview[]>('/interviews', { method: 'GET' });
    } catch {
      return null;
    }
  },

  async createInterview(input: CreateInterviewInput): Promise<Interview | null> {
    try {
      return await apiRequest<Interview>('/interviews', {
        method: 'POST',
        body: JSON.stringify(input),
      });
    } catch {
      return null;
    }
  },

  async updateInterview(
    id: string,
    updates: Partial<Interview>
  ): Promise<Interview | null> {
    try {
      return await apiRequest<Interview>(`/interviews/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    } catch {
      return null;
    }
  },

  async deleteInterview(id: string): Promise<boolean> {
    try {
      await apiRequest<void>(`/interviews/${id}`, { method: 'DELETE' });
      return true;
    } catch {
      return false;
    }
  },
};
