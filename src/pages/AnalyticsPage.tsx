import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { StatusDistributionChart, TrendBarChart } from '../components/AnalyticsCharts';
import { useApp } from '../context/AppContext';
import { DashboardLayout } from '../layouts/DashboardLayout';
import {
  analyticsService,
  computeAnalyticsFromApplications,
} from '../services/analyticsService';
import { AnalyticsSummary } from '../types';

export const AnalyticsPage: React.FC = () => {
  const { applications, backendConnected, loadDemoApplications, clearAllApplications } =
    useApp();
  const [liveSummary, setLiveSummary] = useState<AnalyticsSummary | null>(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      if (backendConnected) {
        const res = await analyticsService.fetchSummary();
        if (active && res) setLiveSummary(res);
      } else {
        setLiveSummary(null);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [backendConnected, applications]);

  const summary =
    liveSummary || computeAnalyticsFromApplications(applications);

  const hasDemoOnly = applications.some((a) => a.isDemoSample);

  return (
    <DashboardLayout
      title="Application Analytics"
      breadcrumb="Workspace / Analytics"
      actionButton={
        applications.length > 0 ? (
          <button
            type="button"
            onClick={clearAllApplications}
            className="px-3.5 py-2 text-xs font-semibold text-[#281C3B] bg-white border border-[#E7E0EF] hover:bg-[#FAF8FF] rounded-lg whitespace-nowrap"
          >
            Clear Records (Test Empty State)
          </button>
        ) : (
          <button
            type="button"
            onClick={loadDemoApplications}
            className="px-3.5 py-2 text-xs font-semibold btn-purple-gradient rounded-lg whitespace-nowrap"
          >
            Load Sample Demo Records
          </button>
        )
      }
    >
      {summary.totalApplications === 0 ? (
        <div className="card-elevated border rounded-xl p-12 text-center space-y-4">
          <h2 className="text-lg font-bold text-[#211638]">
            No Application Analytics Available Yet
          </h2>
          <p className="text-sm text-[#756B83] max-w-lg mx-auto">
            Smart Hire never displays fabricated statistics. Once you log job applications in your tracker (or connect your MySQL database), real conversion rates and trends appear here automatically.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/applications"
              className="px-4 py-2 text-sm font-semibold btn-purple-gradient rounded-lg"
            >
              Add First Application
            </Link>
            <button
              type="button"
              onClick={loadDemoApplications}
              className="px-4 py-2 text-sm font-semibold text-[#211638] bg-[#E9DDFB] hover:bg-[#DCD0F6] rounded-lg"
            >
              Load Sample Demo Records
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {!backendConnected && hasDemoOnly && (
            <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl px-4 py-3 text-xs">
              <strong>Sample Demo Dataset Active:</strong> Metrics below are computed strictly from your current browser application records (including sample demo records). Connect the Java Spring Boot + MySQL backend for persistent production metrics.
            </div>
          )}

          {/* Top KPI Grid */}
          <section className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
            {[
              { label: 'Total', value: summary.totalApplications },
              { label: 'Applied', value: summary.appliedCount },
              { label: 'Under Review', value: summary.underReviewCount },
              { label: 'Interviews', value: summary.interviewCount },
              { label: 'Offers', value: summary.offerCount },
              { label: 'Rejections', value: summary.rejectionCount },
              {
                label: 'Interview Rate',
                value: `${summary.interviewConversionRate}%`,
              },
            ].map((kpi) => (
              <div
                key={kpi.label}
                className="card-elevated card-elevated-hover border rounded-xl p-4"
              >
                <p className="text-xs text-[#756B83]">{kpi.label}</p>
                <p className="text-2xl font-bold font-mono tabular-nums text-[#211638] mt-1.5">
                  {kpi.value}
                </p>
              </div>
            ))}
          </section>

          {/* Conversion Summary + Status Distribution */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 card-elevated border rounded-xl p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-[#211638]">
                  Application Status Distribution
                </h2>
                <span className="text-xs font-mono tabular-nums text-[#756B83]">
                  Offer Conversion: {summary.offerConversionRate}%
                </span>
              </div>
              <StatusDistributionChart
                distribution={summary.statusDistribution}
                total={summary.totalApplications}
              />
            </div>

            <div className="lg:col-span-6 card-elevated border rounded-xl p-6 space-y-4">
              <h2 className="text-base font-bold text-[#211638]">
                Monthly Application Trends
              </h2>
              <TrendBarChart
                data={summary.monthlyTrends.map((m) => ({
                  label: m.month,
                  count: m.count,
                }))}
                barColor="#A78BFA"
              />
            </div>
          </section>

          {/* Weekly Trends + Company-wise Statistics */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 card-elevated border rounded-xl p-6 space-y-4">
              <h2 className="text-base font-bold text-[#211638]">
                Weekly Application Trends
              </h2>
              <TrendBarChart
                data={summary.weeklyTrends.map((w) => ({
                  label: w.week,
                  count: w.count,
                }))}
                barColor="#7046A5"
              />
            </div>

            <div className="lg:col-span-7 card-elevated border rounded-xl p-6 space-y-4">
              <h2 className="text-base font-bold text-[#211638]">
                Company-wise Statistics
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-[#E7E0EF] text-xs font-semibold text-[#756B83]">
                      <th className="py-2.5 pr-4">Company</th>
                      <th className="py-2.5 px-4 text-right">Applications</th>
                      <th className="py-2.5 px-4 text-right">Interviews</th>
                      <th className="py-2.5 pl-4 text-right">Offers</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E7E0EF]">
                    {summary.companyStats.map((row) => (
                      <tr key={row.company}>
                        <td className="py-2.5 pr-4 font-semibold text-[#211638]">
                          {row.company}
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono tabular-nums text-[#281C3B]">
                          {row.applications}
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono tabular-nums text-[#7046A5] font-semibold">
                          {row.interviews}
                        </td>
                        <td className="py-2.5 pl-4 text-right font-mono tabular-nums text-emerald-700 font-semibold">
                          {row.offers}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      )}
    </DashboardLayout>
  );
};
