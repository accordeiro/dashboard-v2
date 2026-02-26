import { useAccountBalance } from '../hooks/useHorizon';
import { formatNumber } from '../lib/format';
import { FRIENDBOT_ACCOUNT } from '../lib/constants';
import type { NetworkType } from '../lib/constants';
import BigNumber from 'bignumber.js';

interface AccountBalanceProps {
  network: NetworkType;
  accountId: string;
  name: string;
}

export function AccountBalance({ network, accountId, name }: AccountBalanceProps) {
  const { data: balance, isLoading } = useAccountBalance(network, accountId);

  if (isLoading) {
    return (
      <div className="card col-span-4">
        <div className="card-header">
          <div className="card-title">{name}</div>
        </div>
        <div className="skeleton skeleton-value" />
      </div>
    );
  }

  const horizonUrl = network === 'mainnet' 
    ? 'https://horizon.stellar.org' 
    : 'https://horizon-testnet.stellar.org';

  return (
    <div className="card col-span-4">
      <div className="card-header">
        <div className="card-title">{name}</div>
        <a 
          href={`${horizonUrl}/accounts/${accountId}`}
          target="_blank" 
          rel="noopener noreferrer"
          className="api-link"
        >
          API
        </a>
      </div>
      <div className="card-value small">{formatNumber(new BigNumber(balance || 0), 0)}</div>
      <div className="card-subtitle">XLM</div>
      <div style={{ marginTop: 8 }}>
        <a 
          href={`${horizonUrl}/accounts/${accountId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="account-badge"
          style={{ fontSize: 11 }}
        >
          {accountId.slice(0, 4)}...{accountId.slice(-4)}
        </a>
      </div>
    </div>
  );
}

export function FriendbotBalance() {
  return (
    <AccountBalance 
      network="testnet" 
      accountId={FRIENDBOT_ACCOUNT} 
      name="Friendbot" 
    />
  );
}
