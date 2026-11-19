export function formatSalaryRange(
  min: number,
  max: number,
  currency: 'LKR' | 'USD' | 'GBP' | 'EUR'
): string {
  const formatter = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  });
  if (currency === 'LKR') {
    return `LKR ${formatter.format(min)} – ${formatter.format(max)} / mo`;
  }
  const symbol =
    currency === 'USD' ? '$' : currency === 'GBP' ? '£' : '€';
  return `${symbol}${formatter.format(min)} – ${symbol}${formatter.format(max)} / mo`;
}

export function formatDateShort(dateStr: string): string {
  if (!dateStr) return '—';
  const parsed = new Date(dateStr);
  if (Number.isNaN(parsed.getTime())) return dateStr;
  return parsed.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function daysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  const now = new Date();
  target.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function isJobExpired(expiryDate: string): boolean {
  const exp = new Date(expiryDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return exp.getTime() < today.getTime();
}

export function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}
