const USAGE_KEY = 'loonkloof_usage_count';
const USAGE_MONTH_KEY = 'loonkloof_usage_month';
const PREMIUM_TOKEN_KEY = 'premium_token';
const FREE_LIMIT = 1;

function currentMonthKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth()}`;
}

export function resetUsageIfNewMonth(): void {
  if (typeof window === 'undefined') return;
  const stored = localStorage.getItem(USAGE_MONTH_KEY);
  if (stored !== currentMonthKey()) {
    localStorage.setItem(USAGE_MONTH_KEY, currentMonthKey());
    localStorage.setItem(USAGE_KEY, '0');
  }
}

export function getUsageThisMonth(): number {
  if (typeof window === 'undefined') return 0;
  resetUsageIfNewMonth();
  return parseInt(localStorage.getItem(USAGE_KEY) ?? '0', 10);
}

export function incrementUsage(): void {
  if (typeof window === 'undefined') return;
  resetUsageIfNewMonth();
  const current = getUsageThisMonth();
  localStorage.setItem(USAGE_KEY, String(current + 1));
}

export function hasReachedFreeLimit(): boolean {
  return getUsageThisMonth() > FREE_LIMIT;
}

export function isPremiumUser(): boolean {
  if (typeof window === 'undefined') return false;
  const token = localStorage.getItem(PREMIUM_TOKEN_KEY);
  return !!token && token.length > 0;
}

export function setPremiumToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PREMIUM_TOKEN_KEY, token);
}
