import { useState } from 'react';
import type { NetworkType } from './lib/constants';
import { 
  useLedgerStream, 
  useFeeStats, 
  useOperationStream, 
  useLumenSupply,
  useHistoricalLedgers,
  useStatusPage,
} from './hooks/useHorizon';
import { NetworkStatus } from './components/NetworkStatus';
import { FeeStats } from './components/FeeStats';
import { LumenSupply } from './components/LumenSupply';
import { RecentOperations } from './components/RecentOperations';
import { LedgerCloseChart } from './components/LedgerCloseChart';
import { TransactionsChart, FailedTransactionsChart } from './components/TransactionsChart';
import { HistoricalChart } from './components/HistoricalChart';
import { Incidents } from './components/Incidents';
import { FriendbotBalance } from './components/AccountBalance';

function App() {
  const [network, setNetwork] = useState<NetworkType>('mainnet');
  
  // Ledger streaming
  const { ledgers, isStreaming } = useLedgerStream(network);
  
  // Fee stats
  const { data: feeStats, isLoading: feeStatsLoading } = useFeeStats(network);
  
  // Operations streaming
  const operations = useOperationStream(network, 20);
  
  // Lumen supply (mainnet only)
  const { data: lumenSupply, isLoading: lumenSupplyLoading } = useLumenSupply();
  
  // Historical ledger data (mainnet only)
  const { data: historicalLedgers, isLoading: historicalLoading } = useHistoricalLedgers();
  
  // StatusPage
  const { data: statusPage, isLoading: statusLoading } = useStatusPage();

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-logo">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="16" fill="var(--color-accent)"/>
            <path d="M22.5 10.5L9.5 16.5L22.5 22.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9.5 10.5L22.5 16.5L9.5 22.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="app-header-title">Stellar Dashboard</span>
        </div>
        
        <div className="app-header-nav">
          <div className="network-toggle">
            <button 
              className={network === 'mainnet' ? 'active' : ''}
              onClick={() => setNetwork('mainnet')}
            >
              Mainnet
            </button>
            <button 
              className={network === 'testnet' ? 'active' : ''}
              onClick={() => setNetwork('testnet')}
            >
              Testnet
            </button>
          </div>
        </div>
      </header>

      <main className="app-main">
        {/* Network Status Section */}
        <section className="dashboard-section">
          <h2 className="section-title">
            {network === 'mainnet' ? 'Live Network' : 'Test Network'}
            {isStreaming && <span className="live-indicator">Live</span>}
          </h2>
          <div className="dashboard-grid">
            <NetworkStatus ledgers={ledgers} isLoading={ledgers.length === 0} />
            <FeeStats feeStats={feeStats} isLoading={feeStatsLoading} />
          </div>
        </section>

        {/* Charts Section */}
        <section className="dashboard-section">
          <h2 className="section-title">Network Activity</h2>
          <div className="dashboard-grid">
            <LedgerCloseChart ledgers={ledgers} isLoading={ledgers.length === 0} />
            <TransactionsChart ledgers={ledgers} isLoading={ledgers.length === 0} />
            <FailedTransactionsChart ledgers={ledgers} isLoading={ledgers.length === 0} />
            {network === 'mainnet' && (
              <HistoricalChart data={historicalLedgers} isLoading={historicalLoading} />
            )}
          </div>
        </section>

        {/* Lumen Supply Section (Mainnet only) */}
        {network === 'mainnet' && (
          <section className="dashboard-section">
            <h2 className="section-title">Lumen Supply</h2>
            <div className="dashboard-grid">
              <LumenSupply supply={lumenSupply} isLoading={lumenSupplyLoading} />
            </div>
          </section>
        )}

        {/* Testnet specific: Friendbot */}
        {network === 'testnet' && (
          <section className="dashboard-section">
            <h2 className="section-title">Testnet Accounts</h2>
            <div className="dashboard-grid">
              <FriendbotBalance />
            </div>
          </section>
        )}

        {/* Recent Operations Section */}
        <section className="dashboard-section">
          <h2 className="section-title">Recent Operations</h2>
          <div className="dashboard-grid">
            <RecentOperations 
              operations={operations} 
              network={network}
              isLoading={operations.length === 0} 
            />
          </div>
        </section>

        {/* Network Nodes Link */}
        <section className="dashboard-section">
          <h2 className="section-title">Network Nodes</h2>
          <div className="dashboard-grid">
            <div className="card col-span-12">
              <div className="card-header">
                <div className="card-title">Node Explorer</div>
              </div>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: 12 }}>
                Explore the Stellar network topology and validator nodes.
              </p>
              <a 
                href="https://stellarbeat.io" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  display: 'inline-block',
                  padding: '8px 16px',
                  background: 'var(--color-accent)',
                  color: 'white',
                  borderRadius: 6,
                  fontWeight: 500,
                  fontSize: 14,
                }}
              >
                View on Stellarbeat.io →
              </a>
            </div>
          </div>
        </section>

        {/* Status & Incidents */}
        <section className="dashboard-section">
          <h2 className="section-title">Status & Incidents</h2>
          <div className="dashboard-grid">
            <Incidents statusPage={statusPage} isLoading={statusLoading} />
          </div>
        </section>
      </main>

      <footer className="app-footer">
        <div>
          <a href="https://stellar.org" target="_blank" rel="noopener noreferrer">Stellar.org</a>
          <a href="https://developers.stellar.org" target="_blank" rel="noopener noreferrer">Developers</a>
          <a href="https://github.com/stellar" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="https://horizon.stellar.org" target="_blank" rel="noopener noreferrer">Horizon API</a>
        </div>
        <div style={{ marginTop: 8, fontSize: 12, opacity: 0.7 }}>
          Live data from the Stellar Network
        </div>
      </footer>
    </div>
  );
}

export default App;
