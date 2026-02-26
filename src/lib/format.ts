import BigNumber from 'bignumber.js';
import { formatDistanceToNow, format } from 'date-fns';

// Format large numbers with commas
export const formatNumber = (value: string | number | BigNumber, decimals = 0): string => {
  const bn = new BigNumber(value);
  if (bn.isNaN()) return '0';
  
  const fixed = bn.toFixed(decimals);
  const parts = fixed.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
};

// Format XLM amounts (7 decimal places max, but show fewer if possible)
export const formatXLM = (value: string | number | BigNumber): string => {
  const bn = new BigNumber(value);
  if (bn.isNaN()) return '0 XLM';
  
  // For display, show up to 2 decimals for large numbers, 7 for small
  const absValue = bn.abs();
  let decimals = 2;
  if (absValue.lt(1)) decimals = 7;
  else if (absValue.lt(1000)) decimals = 4;
  
  return `${formatNumber(bn, decimals)} XLM`;
};

// Format stroops to XLM
export const stroopsToXLM = (stroops: string | number): BigNumber => {
  return new BigNumber(stroops).dividedBy(10000000);
};

// Format time ago
export const timeAgo = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return formatDistanceToNow(d, { addSuffix: true });
};

// Format seconds to human readable
export const formatSeconds = (seconds: number): string => {
  if (seconds < 60) return `${seconds.toFixed(1)}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds.toFixed(0)}s`;
};

// Format date for charts
export const formatChartDate = (date: string): string => {
  return format(new Date(date), 'MM-dd');
};

// Truncate account ID
export const truncateAccount = (account: string, chars = 4): string => {
  if (!account) return '';
  if (account.length <= chars * 2) return account;
  return `${account.slice(0, chars)}...${account.slice(-chars)}`;
};

// Calculate percentage
export const calculatePercentage = (value: BigNumber, total: BigNumber): string => {
  if (total.isZero()) return '0%';
  return `${value.dividedBy(total).multipliedBy(100).toFixed(2)}%`;
};

// Format fee (in stroops)
export const formatFee = (fee: string | number): string => {
  const stroops = new BigNumber(fee);
  if (stroops.gte(1000000)) {
    return `${stroops.dividedBy(1000000).toFixed(2)}M`;
  }
  if (stroops.gte(1000)) {
    return `${stroops.dividedBy(1000).toFixed(2)}K`;
  }
  return stroops.toString();
};

// Format capacity percentage
export const formatCapacity = (ops: number, maxOps: number): string => {
  if (maxOps === 0) return '0%';
  return `${((ops / maxOps) * 100).toFixed(1)}%`;
};
