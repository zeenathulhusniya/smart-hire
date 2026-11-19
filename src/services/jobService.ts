import { DEMO_REMOTE_JOBS } from '../data/demoData';
import { RemoteJob } from '../types';
import { isJobExpired } from '../utils/formatters';
import { apiRequest } from './apiClient';

/**
 * Business rule guard:
 * Never display onsite, hybrid, expired, unverified, or non-Sri-Lanka jobs.
 */
export function filterVerifiedSriLankaRemoteJobs(jobs: RemoteJob[]): RemoteJob[] {
  return jobs.filter(
    (job) =>
      job.remoteStatus === 'FULLY_REMOTE' &&
      job.sriLankaEligible === true &&
      job.verificationStatus === 'VERIFIED' &&
      !isJobExpired(job.expiryDate)
  );
}

export const jobService = {
  async fetchVerifiedSriLankaJobs(): Promise<{
    jobs: RemoteJob[];
    sourceMode: 'LIVE_BACKEND' | 'DEMO_PREVIEW';
  }> {
    try {
      const jobs = await apiRequest<RemoteJob[]>('/jobs/verified', {
        method: 'GET',
        skipAuth: true,
      });
      return {
        jobs: filterVerifiedSriLankaRemoteJobs(jobs),
        sourceMode: 'LIVE_BACKEND',
      };
    } catch {
      return {
        jobs: filterVerifiedSriLankaRemoteJobs(DEMO_REMOTE_JOBS),
        sourceMode: 'DEMO_PREVIEW',
      };
    }
  },

  async fetchJobById(id: string): Promise<RemoteJob | null> {
    try {
      const job = await apiRequest<RemoteJob>(`/jobs/${id}`, {
        method: 'GET',
        skipAuth: true,
      });
      const verified = filterVerifiedSriLankaRemoteJobs([job]);
      return verified[0] ?? null;
    } catch {
      const found = DEMO_REMOTE_JOBS.find((j) => j.id === id);
      if (!found) return null;
      return filterVerifiedSriLankaRemoteJobs([found])[0] ?? null;
    }
  },
};
