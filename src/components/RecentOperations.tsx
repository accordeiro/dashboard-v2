import type { OperationRecord } from '../types';
import { truncateAccount, timeAgo, formatNumber } from '../lib/format';
import { KNOWN_ACCOUNTS, getHorizonUrl } from '../lib/constants';
import type { NetworkType } from '../lib/constants';
import BigNumber from 'bignumber.js';

interface RecentOperationsProps {
  operations: OperationRecord[];
  network: NetworkType;
  isLoading?: boolean;
}

function getOperationDetails(op: OperationRecord): string {
  switch (op.type) {
    case 'payment':
      if (op.asset_type === 'native') {
        return `${formatNumber(new BigNumber(op.amount || 0), 2)} XLM`;
      }
      return `${formatNumber(new BigNumber(op.amount || 0), 2)} ${op.asset_code}`;
    
    case 'create_account':
      return `${formatNumber(new BigNumber(op.starting_balance || 0), 2)} XLM`;
    
    case 'path_payment_strict_send':
    case 'path_payment_strict_receive':
      return `${formatNumber(new BigNumber(op.amount || 0), 2)} ${op.asset_code || 'XLM'}`;
    
    case 'manage_sell_offer':
    case 'manage_buy_offer':
    case 'create_passive_sell_offer':
      return op.amount ? `${formatNumber(new BigNumber(op.amount), 2)}` : '';
    
    case 'set_options':
      return op.home_domain ? `home_domain: ${op.home_domain}` : '';
    
    case 'change_trust':
      return op.asset_code || '';
    
    case 'invoke_host_function':
      return 'Soroban';
    
    case 'bump_sequence':
      return `to ${op.bump_to}`;
    
    default:
      return '';
  }
}

function getOperationTypeClass(type: string): string {
  const typeMap: Record<string, string> = {
    payment: 'payment',
    create_account: 'create_account',
    invoke_host_function: 'invoke_host_function',
  };
  return typeMap[type] || '';
}

function formatOperationType(type: string): string {
  return type.replace(/_/g, ' ');
}

export function RecentOperations({ operations, network, isLoading }: RecentOperationsProps) {
  const horizonUrl = getHorizonUrl(network);

  if (isLoading) {
    return (
      <div className="card col-span-12">
        <div className="card-header">
          <div className="card-title">Recent Operations</div>
        </div>
        <div style={{ padding: 20 }}>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="skeleton skeleton-text" style={{ marginBottom: 12, height: 40 }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="card col-span-12">
      <div className="card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="card-title">Recent Operations</div>
          <span className="live-indicator">Live</span>
        </div>
        <a 
          href={`${horizonUrl}/operations?order=desc&limit=20`}
          target="_blank" 
          rel="noopener noreferrer"
          className="api-link"
        >
          API
        </a>
      </div>
      
      <div style={{ overflowX: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Source</th>
              <th>Operation</th>
              <th>Details</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {operations.map((op) => (
              <tr key={op.id}>
                <td>
                  <a 
                    href={`${horizonUrl}/accounts/${op.source_account}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="account-badge"
                    title={KNOWN_ACCOUNTS[op.source_account] || op.source_account}
                  >
                    {KNOWN_ACCOUNTS[op.source_account] || truncateAccount(op.source_account)}
                  </a>
                </td>
                <td>
                  <a 
                    href={op._links.self.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className={`op-type ${getOperationTypeClass(op.type)}`}>
                      {formatOperationType(op.type)}
                    </span>
                  </a>
                </td>
                <td className="mono" style={{ color: 'var(--color-text-secondary)' }}>
                  {getOperationDetails(op)}
                </td>
                <td style={{ color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>
                  {timeAgo(op.created_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
