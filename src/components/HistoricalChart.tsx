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
import type { LedgerStat } from '../types';
import { formatNumber } from '../lib/format';

interface HistoricalChartProps {
  data: LedgerStat[] | undefined;
  isLoading?: boolean;
}

export function HistoricalChart({ data, isLoading }: HistoricalChartProps) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    // Data is already sorted by date, oldest first
    return data.map((stat) => ({
      date: stat.date,
      transactions: stat.transaction_count,
      operations: stat.operation_count,
    }));
  }, [data]);

  if (isLoading) {
    return (
      <div className="card col-span-12">
        <div className="card-header">
          <div className="card-title">Transactions & Operations (Last 30 Days)</div>
        </div>
        <div className="chart-container tall">
          <div className="skeleton" style={{ width: '100%', height: '100%' }} />
        </div>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="card col-span-12">
        <div className="card-header">
          <div className="card-title">Transactions & Operations (Last 30 Days)</div>
        </div>
        <div className="empty-state">
          <div className="empty-state-icon">📊</div>
          <p>No historical data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card col-span-12">
      <div className="card-header">
        <div className="card-title">Txs & Ops in the last 30 days</div>
        <a 
          href="https://dashboard.stellar.org/api/ledgers/public" 
          target="_blank" 
          rel="noopener noreferrer"
          className="api-link"
        >
          API
        </a>
      </div>
      <div className="chart-container tall">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <XAxis 
              dataKey="date" 
              tick={{ fill: 'var(--color-text-secondary)', fontSize: 10 }}
              axisLine={{ stroke: 'var(--color-border)' }}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis 
              tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }}
              axisLine={{ stroke: 'var(--color-border)' }}
              tickLine={false}
              tickFormatter={(value) => {
                if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
                return value;
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-bg-tertiary)',
                border: '1px solid var(--color-border)',
                borderRadius: 8,
                fontSize: 12,
              }}
              labelStyle={{ color: 'var(--color-text-primary)' }}
              formatter={(value, name) => [
                formatNumber(Number(value), 0),
                name === 'transactions' ? 'Transactions' : 'Operations'
              ]}
            />
            <Legend 
              wrapperStyle={{ fontSize: 11, paddingTop: 10 }}
            />
            <Bar 
              dataKey="transactions" 
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
