import React from 'react';
import { AnalyticsSummary, ApplicationStatus } from '../types';

const STATUS_BAR_COLOR: Record<ApplicationStatus, string> = {
  Wishlist: 'bg-[#A78BFA]/70',
  Applied: 'bg-gradient-to-r from-[#49316F] to-[#7046A5]',
  'Under Review': 'bg-amber-500',
  Interview: 'bg-gradient-to-r from-[#7046A5] to-[#A78BFA]',
  Offered: 'bg-emerald-600',
  Rejected: 'bg-red-500',
};

export const StatusDistributionChart: React.FC<{
  distribution: AnalyticsSummary['statusDistribution'];
  total: number;
}> = ({ distribution, total }) => {
  return (
    <div className="space-y-3.5">
      {distribution.map((item) => {
        const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
        return (
          <div key={item.status} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-[#281C3B]">{item.status}</span>
              <span className="font-mono tabular-nums text-[#756B83]">
                {item.count} ({pct}%)
              </span>
            </div>
            <div className="h-2.5 w-full bg-[#E9DDFB]/60 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${STATUS_BAR_COLOR[item.status]}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const TrendBarChart: React.FC<{
  data: { label: string; count: number }[];
  barColor?: string;
}> = ({ data, barColor = '#A78BFA' }) => {
  if (data.length === 0) {
    return (
      <div className="h-44 flex items-center justify-center text-sm text-[#756B83]">
        No trend data recorded yet.
      </div>
    );
  }

  const maxVal = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="h-48 flex items-end gap-3 pt-6 pb-2">
      {data.map((point) => {
        const heightPct = Math.max(10, Math.round((point.count / maxVal) * 100));
        return (
          <div
            key={point.label}
            className="flex-1 flex flex-col items-center justify-end h-full gap-2 min-w-0"
          >
            <span className="text-xs font-mono tabular-nums font-semibold text-[#281C3B]">
              {point.count}
            </span>
            <div className="w-full max-w-[44px] flex-1 flex items-end">
              <div
                className="w-full rounded-t-md transition-all duration-300"
                style={{
                  height: `${heightPct}%`,
                  background: `linear-gradient(180deg, ${barColor} 0%, #49316F 100%)`,
                }}
              />
            </div>
            <span className="text-[11px] font-mono text-[#756B83] truncate w-full text-center">
              {point.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};
