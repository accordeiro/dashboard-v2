import BigNumber from 'bignumber.js';
import type { LumenSupplyV2 } from '../types';
import { formatNumber } from '../lib/format';

interface LumenSupplyProps {
  supply: LumenSupplyV2 | undefined;
  isLoading?: boolean;
}

export function LumenSupply({ supply, isLoading }: LumenSupplyProps) {
  if (isLoading || !supply) {
    return (
      <>
        <div className="card col-span-4">
          <div className="skeleton skeleton-text" style={{ marginBottom: 8 }} />
          <div className="skeleton skeleton-value" />
        </div>
        <div className="card col-span-4">
          <div className="skeleton skeleton-text" style={{ marginBottom: 8 }} />
          <div className="skeleton skeleton-value" />
        </div>
        <div className="card col-span-4">
          <div className="skeleton skeleton-text" style={{ marginBottom: 8 }} />
          <div className="skeleton skeleton-value" />
        </div>
      </>
    );
  }

  const totalSupply = new BigNumber(supply.totalSupply);
  const circulatingSupply = new BigNumber(supply.circulatingSupply);
  const nonCirculating = totalSupply.minus(circulatingSupply);

  return (
    <>
      <div className="card col-span-4">
        <div className="card-header">
          <div className="card-title">Total Supply</div>
          <a 
            href="https://dashboard.stellar.org/api/v2/lumens" 
            target="_blank" 
            rel="noopener noreferrer"
            className="api-link"
          >
            API
          </a>
        </div>
        <div className="card-value">{formatNumber(totalSupply, 0)}</div>
        <div className="card-subtitle">XLM</div>
        
        <div className="supply-breakdown">
          <div className="supply-item">
            <span className="supply-item-label">Original Supply</span>
            <span className="supply-item-value">{formatNumber(supply.originalSupply, 0)}</span>
          </div>
          <div className="supply-item">
            <span className="supply-item-label">Inflation Lumens</span>
            <span className="supply-item-value">+{formatNumber(supply.inflationLumens, 0)}</span>
          </div>
          <div className="supply-item">
            <span className="supply-item-label">Burned Lumens</span>
            <span className="supply-item-value">-{formatNumber(supply.burnedLumens, 0)}</span>
          </div>
        </div>
      </div>

      <div className="card col-span-4">
        <div className="card-header">
          <div className="card-title">Non-Circulating Supply</div>
        </div>
        <div className="card-value">{formatNumber(nonCirculating, 0)}</div>
        <div className="card-subtitle">XLM</div>
        
        <div className="supply-breakdown">
          <div className="supply-item">
            <span className="supply-item-label">Upgrade Reserve</span>
            <span className="supply-item-value">{formatNumber(supply.upgradeReserve, 0)}</span>
          </div>
          <div className="supply-item">
            <span className="supply-item-label">Fee Pool</span>
            <span className="supply-item-value">{formatNumber(supply.feePool, 0)}</span>
          </div>
          <div className="supply-item">
            <span className="supply-item-label">SDF Mandate</span>
            <span className="supply-item-value">{formatNumber(supply.sdfMandate, 0)}</span>
          </div>
        </div>
      </div>

      <div className="card col-span-4">
        <div className="card-header">
          <div className="card-title">Circulating Supply</div>
        </div>
        <div className="card-value">{formatNumber(circulatingSupply, 0)}</div>
        <div className="card-subtitle">XLM</div>
        
        <div className="supply-breakdown">
          <div className="supply-item">
            <span className="supply-item-label">% of Total</span>
            <span className="supply-item-value">
              {circulatingSupply.dividedBy(totalSupply).multipliedBy(100).toFixed(2)}%
            </span>
          </div>
        </div>
        
        <div style={{ marginTop: 16 }}>
          <a 
            href={supply._details} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ fontSize: 12 }}
          >
            Lumen Supply Metrics →
          </a>
        </div>
      </div>
    </>
  );
}
