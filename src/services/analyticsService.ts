import { AnalyticsSummary, ApplicationStatus, JobApplication } from '../types';
import { apiRequest } from './apiClient';

const ALL_STATUSES: ApplicationStatus[] = [
  'Wishlist',
  'Applied',
  'Under Review',
  'Interview',
  'Offered',
  'Rejected',
];

export function computeAnalyticsFromApplications(
  applications: JobApplication[]
): AnalyticsSummary {
  const totalApplications = applications.length;
  const countByStatus = (status: ApplicationStatus) =>
    applications.filter((a) => a.status === status).length;

  const wishlistCount = countByStatus('Wishlist');
  const appliedCount = countByStatus('Applied');
  const underReviewCount = countByStatus('Under Review');
  const interviewCount = countByStatus('Interview');
  const offerCount = countByStatus('Offered');
  const rejectionCount = countByStatus('Rejected');

  const submittedTotal = totalApplications - wishlistCount;
  const reachedInterviewOrOffer = interviewCount + offerCount;

  const interviewConversionRate =
    submittedTotal > 0
      ? Number(((reachedInterviewOrOffer / submittedTotal) * 100).toFixed(1))
      : 0;

  const offerConversionRate =
    submittedTotal > 0
      ? Number(((offerCount / submittedTotal) * 100).toFixed(1))
      : 0;

  const statusDistribution = ALL_STATUSES.map((status) => ({
    status,
    count: countByStatus(status),
  }));

  // Group by YYYY-MM month
  const monthMap = new Map<string, number>();
  applications.forEach((app) => {
    const dateKey = (app.applicationDate || app.createdAt || '').slice(0, 7);
    if (dateKey) {
      monthMap.set(dateKey, (monthMap.get(dateKey) || 0) + 1);
    }
  });
  const monthlyTrends = Array.from(monthMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, count]) => ({ month, count }));

  // Group into recent 4 weekly buckets based on applicationDate
  const weekMap = new Map<string, number>();
  applications.forEach((app) => {
    const d = new Date(app.applicationDate || app.createdAt);
    if (!Number.isNaN(d.getTime())) {
      const startOfWeek = new Date(d);
      startOfWeek.setDate(d.getDate() - d.getDay());
      const label = startOfWeek.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
      });
      weekMap.set(label, (weekMap.get(label) || 0) + 1);
    }
  });
  const weeklyTrends = Array.from(weekMap.entries())
    .slice(-6)
    .map(([week, count]) => ({ week, count }));

  // Company-wise statistics
  const companyMap = new Map<
    string,
    { company: string; applications: number; interviews: number; offers: number }
  >();
  applications.forEach((app) => {
    const key = app.companyName.trim() || 'Unknown';
    const existing = companyMap.get(key) || {
      company: key,
      applications: 0,
      interviews: 0,
      offers: 0,
    };
    existing.applications += 1;
    if (app.status === 'Interview') existing.interviews += 1;
    if (app.status === 'Offered') existing.offers += 1;
    companyMap.set(key, existing);
  });
  const companyStats = Array.from(companyMap.values()).sort(
    (a, b) => b.applications - a.applications
  );

  return {
    totalApplications,
    appliedCount,
    underReviewCount,
    wishlistCount,
    interviewCount,
    offerCount,
    rejectionCount,
    interviewConversionRate,
    offerConversionRate,
    statusDistribution,
    monthlyTrends,
    weeklyTrends,
    companyStats,
  };
}

export const analyticsService = {
  async fetchSummary(): Promise<AnalyticsSummary | null> {
    try {
      return await apiRequest<AnalyticsSummary>('/analytics/summary', {
        method: 'GET',
      });
    } catch {
      return null;
    }
  },
};
