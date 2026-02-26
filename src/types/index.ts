// Horizon API types

export interface LedgerRecord {
  id: string;
  paging_token: string;
  hash: string;
  sequence: number;
  successful_transaction_count: number;
  failed_transaction_count: number;
  operation_count: number;
  tx_set_operation_count: number;
  closed_at: string;
  total_coins: string;
  fee_pool: string;
  base_fee_in_stroops: number;
  base_reserve_in_stroops: number;
  max_tx_set_size: number;
  protocol_version: number;
  header_xdr: string;
}

export interface OperationRecord {
  id: string;
  paging_token: string;
  transaction_successful: boolean;
  source_account: string;
  type: string;
  type_i: number;
  created_at: string;
  transaction_hash: string;
  // Payment specific
  asset_type?: string;
  asset_code?: string;
  asset_issuer?: string;
  from?: string;
  to?: string;
  amount?: string;
  // Create account specific
  funder?: string;
  account?: string;
  starting_balance?: string;
  // Other operation types may have additional fields
  [key: string]: unknown;
  _links: {
    self: { href: string };
    transaction: { href: string };
    effects: { href: string };
    succeeds: { href: string };
    precedes: { href: string };
  };
}

export interface FeeStats {
  last_ledger: string;
  last_ledger_base_fee: string;
  ledger_capacity_usage: string;
  fee_charged: {
    max: string;
    min: string;
    mode: string;
    p10: string;
    p20: string;
    p30: string;
    p40: string;
    p50: string;
    p60: string;
    p70: string;
    p80: string;
    p90: string;
    p95: string;
    p99: string;
  };
  max_fee: {
    max: string;
    min: string;
    mode: string;
    p10: string;
    p20: string;
    p30: string;
    p40: string;
    p50: string;
    p60: string;
    p70: string;
    p80: string;
    p90: string;
    p95: string;
    p99: string;
  };
}

export interface AccountRecord {
  id: string;
  account_id: string;
  sequence: string;
  subentry_count: number;
  home_domain?: string;
  last_modified_ledger: number;
  thresholds: {
    low_threshold: number;
    med_threshold: number;
    high_threshold: number;
  };
  flags: {
    auth_required: boolean;
    auth_revocable: boolean;
    auth_immutable: boolean;
  };
  balances: Array<{
    balance: string;
    asset_type: string;
    asset_code?: string;
    asset_issuer?: string;
  }>;
}

export interface HorizonResponse<T> {
  _links: {
    self: { href: string };
    next: { href: string };
    prev: { href: string };
  };
  _embedded: {
    records: T[];
  };
}

// Lumen supply API types
export interface LumenSupplyV2 {
  updatedAt: string;
  originalSupply: string;
  inflationLumens: string;
  burnedLumens: string;
  totalSupply: string;
  upgradeReserve: string;
  feePool: string;
  sdfMandate: string;
  circulatingSupply: string;
  _details: string;
}

// Historical ledger data
export interface LedgerStat {
  date: string;
  transaction_count: number;
  operation_count: number;
}

// StatusPage types
export interface StatusPageSummary {
  page: {
    id: string;
    name: string;
    url: string;
    updated_at: string;
  };
  status: {
    indicator: 'none' | 'minor' | 'major' | 'critical';
    description: string;
  };
  components: Array<{
    id: string;
    name: string;
    status: string;
    created_at: string;
    updated_at: string;
    position: number;
    description: string | null;
  }>;
  incidents: Array<{
    id: string;
    name: string;
    status: string;
    created_at: string;
    updated_at: string;
    monitoring_at: string | null;
    resolved_at: string | null;
    impact: string;
    shortlink: string;
    incident_updates: Array<{
      id: string;
      status: string;
      body: string;
      created_at: string;
      updated_at: string;
    }>;
  }>;
  scheduled_maintenances: Array<{
    id: string;
    name: string;
    status: string;
    created_at: string;
    updated_at: string;
    scheduled_for: string;
    scheduled_until: string;
    impact: string;
    shortlink: string;
    incident_updates: Array<{
      id: string;
      status: string;
      body: string;
      created_at: string;
      updated_at: string;
    }>;
  }>;
}

// Network status derived from ledger data
export interface NetworkStatus {
  status: 'operational' | 'slow' | 'very_slow' | 'down';
  protocolVersion: number;
  lastLedgerSequence: number;
  lastLedgerCloseTime: string;
  avgLedgerCloseTime: number;
  secondsSinceLastLedger: number;
}

// Chart data types
export interface ChartDataPoint {
  label: string;
  value: number;
  successfulTxs?: number;
  failedTxs?: number;
  operations?: number;
}
