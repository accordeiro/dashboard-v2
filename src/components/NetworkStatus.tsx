import { useMemo } from 'react';
import type { LedgerRecord, NetworkStatus as NetworkStatusType } from '../types';
import { formatNumber, formatSeconds, timeAgo } from '../lib/format';
import { LEDGERS_IN_AVERAGE } from '../lib/constants';

interface NetworkStatusProps {
  ledgers: LedgerRecord[];
  isLoading?: boolean;
}

export function NetworkStatus({ ledgers, isLoading }: NetworkStatusProps) {
  const status = useMemo((): NetworkStatusType | null => {
    if (!ledgers.length) return null;

    const latestLedger = ledgers[0];
    const lastCloseTime = new Date(latestLedger.closed_at);
    const now = new Date();
    const secondsSinceLastLedger = (now.getTime() - lastCloseTime.getTime()) / 1000;

    // Calculate average close time from available ledgers (up to LEDGERS_IN_AVERAGE)
    const ledgersForAvg = ledgers.slice(0, Math.min(ledgers.length, LEDGERS_IN_AVERAGE));
    let totalCloseTime = 0;
    for (let i = 0; i < ledgersForAvg.length - 1; i++) {
      const current = new Date(ledgersForAvg[i].closed_at);
      const previous = new Date(ledgersForAvg[i + 1].closed_at);
      totalCloseTime += (current.getTime() - previous.getTime()) / 1000;
    }
    const avgCloseTime = ledgersForAvg.length > 1 
      ? totalCloseTime / (ledgersForAvg.length - 1) 
      : 5; // Default 5 seconds

    // Determine network status based on time since last ledger
    let networkStatus: NetworkStatusType['status'] = 'operational';
    if (secondsSinceLastLedger > 60) {
      networkStatus = 'down';
    } else if (secondsSinceLastLedger > 20) {
      networkStatus = 'very_slow';
    } else if (secondsSinceLastLedger > 10) {
      networkStatus = 'slow';
    }

    return {
      status: networkStatus,
      protocolVersion: latestLedger.protocol_version,
      lastLedgerSequence: latestLedger.sequence,
      lastLedgerCloseTime: latestLedger.closed_at,
      avgLedgerCloseTime: avgCloseTime,
      secondsSinceLastLedger,
    };
  }, [ledgers]);

  if (isLoading || !status) {
    return (
      <div className="card col-span-6">
        <div className="card-header">
          <div className="card-title">Network Status</div>
        </div>
        <div className="skeleton skeleton-value" style={{ marginBottom: 16 }} />
        <div className="skeleton skeleton-text" style={{ width: '80%' }} />
      </div>
    );
  }

  const statusConfig = {
    operational: { label: 'Operational', className: 'success' },
    slow: { label: 'Slow', className: 'warning' },
    very_slow: { label: 'Very Slow', className: 'warning' },
    down: { label: 'Down', className: 'error' },
  };

  const currentStatus = statusConfig[status.status];

  return (
    <div className="card col-span-6">
      <div className="card-header">
        <div className="card-title">Network Status</div>
        <span className={`card-badge ${currentStatus.className}`}>
          <span className={`status-indicator ${currentStatus.className}`} />
          {currentStatus.label}
        </span>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginTop: 16 }}>
        <div>
          <div className="card-title" style={{ marginBottom: 4 }}>Protocol Version</div>
          <div className="card-value small">{status.protocolVersion}</div>
        </div>
        <div>
          <div className="card-title" style={{ marginBottom: 4 }}>Last Ledger</div>
          <div className="card-value small mono">{formatNumber(status.lastLedgerSequence)}</div>
        </div>
        <div>
          <div className="card-title" style={{ marginBottom: 4 }}>Ledger Close Time</div>
          <div className="card-value small">{timeAgo(status.lastLedgerCloseTime)}</div>
        </div>
        <div>
          <div className="card-title" style={{ marginBottom: 4 }}>Avg Close Time</div>
          <div className="card-value small">{formatSeconds(status.avgLedgerCloseTime)}</div>
          <div className="card-subtitle">last {Math.min(ledgers.length, LEDGERS_IN_AVERAGE)} ledgers</div>
        </div>
      </div>
    </div>
  );
}
