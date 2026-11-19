import { ApplicationStatus, JobApplication } from '../types';
import { apiRequest } from './apiClient';

export type CreateApplicationInput = Omit<
  JobApplication,
  'id' | 'userId' | 'createdAt' | 'updatedAt'
>;

export const applicationService = {
  async listApplications(): Promise<JobApplication[] | null> {
    try {
      return await apiRequest<JobApplication[]>('/applications', { method: 'GET' });
    } catch {
      return null;
    }
  },

  async createApplication(input: CreateApplicationInput): Promise<JobApplication | null> {
    try {
      return await apiRequest<JobApplication>('/applications', {
        method: 'POST',
        body: JSON.stringify(input),
      });
    } catch {
      return null;
    }
  },

  async updateApplication(
    id: string,
    updates: Partial<JobApplication>
  ): Promise<JobApplication | null> {
    try {
      return await apiRequest<JobApplication>(`/applications/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    } catch {
      return null;
    }
  },

  async updateStatus(
    id: string,
    status: ApplicationStatus
  ): Promise<JobApplication | null> {
    try {
      return await apiRequest<JobApplication>(`/applications/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
    } catch {
      return null;
    }
  },

  async deleteApplication(id: string): Promise<boolean> {
    try {
      await apiRequest<void>(`/applications/${id}`, { method: 'DELETE' });
      return true;
    } catch {
      return false;
    }
  },
};
