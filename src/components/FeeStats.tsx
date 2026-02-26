import type { FeeStats as FeeStatsType } from '../types';
import { formatFee } from '../lib/format';

interface FeeStatsProps {
  feeStats: FeeStatsType | undefined;
  isLoading?: boolean;
}

export function FeeStats({ feeStats, isLoading }: FeeStatsProps) {
  if (isLoading || !feeStats) {
    return (
      <div className="card col-span-6">
        <div className="card-header">
          <div className="card-title">Fee Stats (Last 5 Ledgers)</div>
        </div>
        <div className="skeleton skeleton-value" style={{ marginBottom: 16 }} />
        <div className="skeleton skeleton-text" />
      </div>
    );
  }

  const capacityUsage = (parseFloat(feeStats.ledger_capacity_usage) * 100).toFixed(2);

  return (
    <div className="card col-span-6">
      <div className="card-header">
        <div className="card-title">Fee Stats (Last 5 Ledgers)</div>
        <a 
          href="https://horizon.stellar.org/fee_stats" 
          target="_blank" 
          rel="noopener noreferrer"
          className="api-link"
        >
          API
        </a>
      </div>
      
      <div style={{ marginBottom: 16 }}>
        <div className="card-title" style={{ marginBottom: 4 }}>Capacity Usage</div>
        <div className="card-value small">{capacityUsage}%</div>
      </div>

      <div className="card-title" style={{ marginBottom: 8 }}>Accepted Fees (stroops)</div>
      <div className="fee-stats-grid">
        <div className="fee-stat-item">
          <div className="fee-stat-label">Max</div>
          <div className="fee-stat-value">{formatFee(feeStats.fee_charged.max)}</div>
        </div>
        <div className="fee-stat-item">
          <div className="fee-stat-label">Min</div>
          <div className="fee-stat-value">{formatFee(feeStats.fee_charged.min)}</div>
        </div>
        <div className="fee-stat-item">
          <div className="fee-stat-label">Mode</div>
          <div className="fee-stat-value">{formatFee(feeStats.fee_charged.mode)}</div>
        </div>
        <div className="fee-stat-item">
          <div className="fee-stat-label">p10</div>
          <div className="fee-stat-value">{formatFee(feeStats.fee_charged.p10)}</div>
        </div>
        <div className="fee-stat-item">
          <div className="fee-stat-label">p20</div>
          <div className="fee-stat-value">{formatFee(feeStats.fee_charged.p20)}</div>
        </div>
        <div className="fee-stat-item">
          <div className="fee-stat-label">p30</div>
          <div className="fee-stat-value">{formatFee(feeStats.fee_charged.p30)}</div>
        </div>
        <div className="fee-stat-item">
          <div className="fee-stat-label">p40</div>
          <div className="fee-stat-value">{formatFee(feeStats.fee_charged.p40)}</div>
        </div>
        <div className="fee-stat-item">
          <div className="fee-stat-label">p50</div>
          <div className="fee-stat-value">{formatFee(feeStats.fee_charged.p50)}</div>
        </div>
        <div className="fee-stat-item">
          <div className="fee-stat-label">p60</div>
          <div className="fee-stat-value">{formatFee(feeStats.fee_charged.p60)}</div>
        </div>
        <div className="fee-stat-item">
          <div className="fee-stat-label">p70</div>
          <div className="fee-stat-value">{formatFee(feeStats.fee_charged.p70)}</div>
        </div>
        <div className="fee-stat-item">
          <div className="fee-stat-label">p80</div>
          <div className="fee-stat-value">{formatFee(feeStats.fee_charged.p80)}</div>
        </div>
        <div className="fee-stat-item">
          <div className="fee-stat-label">p90</div>
          <div className="fee-stat-value">{formatFee(feeStats.fee_charged.p90)}</div>
        </div>
        <div className="fee-stat-item">
          <div className="fee-stat-label">p95</div>
          <div className="fee-stat-value">{formatFee(feeStats.fee_charged.p95)}</div>
        </div>
        <div className="fee-stat-item">
          <div className="fee-stat-label">p99</div>
          <div className="fee-stat-value">{formatFee(feeStats.fee_charged.p99)}</div>
        </div>
        <div className="fee-stat-item">
          <div className="fee-stat-label">Base</div>
          <div className="fee-stat-value">{formatFee(feeStats.last_ledger_base_fee)}</div>
        </div>
      </div>
    </div>
  );
}
