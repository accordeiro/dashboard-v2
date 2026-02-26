import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { LedgerRecord } from '../types';

interface TransactionsChartProps {
  ledgers: LedgerRecord[];
  isLoading?: boolean;
}

export function TransactionsChart({ ledgers, isLoading }: TransactionsChartProps) {
  const chartData = useMemo(() => {
    if (ledgers.length === 0) return [];
    
    // Reverse to show oldest to newest (left to right)
    return [...ledgers].reverse().map((ledger) => ({
      sequence: ledger.sequence,
      successfulTxs: ledger.successful_transaction_count,
      operations: ledger.operation_count,
    }));
  }, [ledgers]);

  if (isLoading || chartData.length === 0) {
    return (
      <div className="card col-span-6">
        <div className="card-header">
          <div className="card-title">Successful Transactions & Operations</div>
        </div>
        <div className="chart-container">
          <div className="skeleton" style={{ width: '100%', height: '100%' }} />
        </div>
      </div>
    );
  }

  return (
    <div className="card col-span-6">
      <div className="card-header">
        <div className="card-title">Successful Txs & Ops (Last {chartData.length} Ledgers)</div>
      </div>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis 
              dataKey="sequence" 
              tick={false}
              axisLine={{ stroke: 'var(--color-border)' }}
              tickLine={false}
            />
            <YAxis 
              tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }}
              axisLine={{ stroke: 'var(--color-border)' }}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-bg-tertiary)',
                border: '1px solid var(--color-border)',
                borderRadius: 8,
                fontSize: 12,
              }}
              labelStyle={{ color: 'var(--color-text-primary)' }}
              labelFormatter={(label) => `Ledger #${label}`}
            />
            <Legend 
              wrapperStyle={{ fontSize: 11, paddingTop: 10 }}
            />
            <Bar 
              dataKey="successfulTxs" 
              name="Transactions"
              fill="var(--chart-color-1)" 
              radius={[2, 2, 0, 0]}
            />
            <Bar 
              dataKey="operations" 
              name="Operations"
              fill="var(--chart-color-2)" 
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

interface FailedTransactionsChartProps {
  ledgers: LedgerRecord[];
  isLoading?: boolean;
}

export function FailedTransactionsChart({ ledgers, isLoading }: FailedTransactionsChartProps) {
  const chartData = useMemo(() => {
    if (ledgers.length === 0) return [];
    
    // Reverse to show oldest to newest (left to right)
    return [...ledgers].reverse().map((ledger) => ({
      sequence: ledger.sequence,
      failedTxs: ledger.failed_transaction_count,
    }));
  }, [ledgers]);

  if (isLoading || chartData.length === 0) {
    return (
      <div className="card col-span-6">
        <div className="card-header">
          <div className="card-title">Failed Transactions</div>
        </div>
        <div className="chart-container">
          <div className="skeleton" style={{ width: '100%', height: '100%' }} />
        </div>
      </div>
    );
  }

  return (
    <div className="card col-span-6">
      <div className="card-header">
        <div className="card-title">Failed Txs (Last {chartData.length} Ledgers)</div>
      </div>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis 
              dataKey="sequence" 
              tick={false}
              axisLine={{ stroke: 'var(--color-border)' }}
              tickLine={false}
            />
            <YAxis 
              tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }}
              axisLine={{ stroke: 'var(--color-border)' }}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-bg-tertiary)',
                border: '1px solid var(--color-border)',
                borderRadius: 8,
                fontSize: 12,
              }}
              labelStyle={{ color: 'var(--color-text-primary)' }}
              formatter={(value) => [value, 'Failed Txs']}
              labelFormatter={(label) => `Ledger #${label}`}
            />
            <Bar 
              dataKey="failedTxs" 
              fill="var(--chart-color-3)" 
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
