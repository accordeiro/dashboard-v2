import { useQuery } from '@tanstack/react-query';
import { useEffect, useState, useCallback, useRef } from 'react';
import * as StellarSdk from '@stellar/stellar-sdk';
import {
  getHorizonUrl,
  DASHBOARD_API,
  STATUSPAGE_API,
  LEDGERS_FOR_CHARTS,
} from '../lib/constants';
import type { NetworkType } from '../lib/constants';
import type {
  LedgerRecord,
  OperationRecord,
  FeeStats,
  LumenSupplyV2,
  LedgerStat,
  StatusPageSummary,
  HorizonResponse,
} from '../types';

// Fetch ledgers
export const useLedgers = (network: NetworkType, limit = LEDGERS_FOR_CHARTS) => {
  const horizonUrl = getHorizonUrl(network);
  
  return useQuery({
    queryKey: ['ledgers', network, limit],
    queryFn: async (): Promise<LedgerRecord[]> => {
      const response = await fetch(
        `${horizonUrl}/ledgers?order=desc&limit=${limit}`
      );
      if (!response.ok) throw new Error('Failed to fetch ledgers');
      const data: HorizonResponse<LedgerRecord> = await response.json();
      return data._embedded.records;
    },
    refetchInterval: 5000,
  });
};

// Streaming ledgers hook
export const useLedgerStream = (network: NetworkType) => {
  const [ledgers, setLedgers] = useState<LedgerRecord[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const closeStreamRef = useRef<(() => void) | null>(null);
  const horizonUrl = getHorizonUrl(network);

  const startStream = useCallback(async () => {
    try {
      // First, get the latest ledger to start streaming from
      const response = await fetch(`${horizonUrl}/ledgers?order=desc&limit=${LEDGERS_FOR_CHARTS}`);
      if (!response.ok) throw new Error('Failed to fetch initial ledgers');
      const data: HorizonResponse<LedgerRecord> = await response.json();
      
      setLedgers(data._embedded.records);
      
      const server = new StellarSdk.Horizon.Server(horizonUrl);
      const lastLedger = data._embedded.records[0];
      
      // Start streaming from the last ledger
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const closeStream = server
        .ledgers()
        .cursor(lastLedger.paging_token)
        .stream({
          onmessage: (ledger: any) => {
            setLedgers(prev => {
              const newLedgers = [ledger as LedgerRecord, ...prev.slice(0, LEDGERS_FOR_CHARTS - 1)];
              return newLedgers;
            });
          },
          onerror: () => {
            console.warn('Ledger stream error');
            setIsStreaming(false);
            // Retry after 5 seconds
            setTimeout(() => startStream(), 5000);
          },
        });
      
      closeStreamRef.current = closeStream;
      setIsStreaming(true);
    } catch (error) {
      console.error('Failed to start ledger stream:', error);
      setIsStreaming(false);
      // Retry after 5 seconds
      setTimeout(() => startStream(), 5000);
    }
  }, [horizonUrl]);

  useEffect(() => {
    startStream();
    
    return () => {
      if (closeStreamRef.current) {
        closeStreamRef.current();
      }
    };
  }, [startStream]);

  return { ledgers, isStreaming };
};

// Fetch operations
export const useOperations = (network: NetworkType, limit = 20) => {
  const horizonUrl = getHorizonUrl(network);
  
  return useQuery({
    queryKey: ['operations', network, limit],
    queryFn: async (): Promise<OperationRecord[]> => {
      const response = await fetch(
        `${horizonUrl}/operations?order=desc&limit=${limit}`
      );
      if (!response.ok) throw new Error('Failed to fetch operations');
      const data: HorizonResponse<OperationRecord> = await response.json();
      return data._embedded.records;
    },
    refetchInterval: 5000,
  });
};

// Streaming operations hook
export const useOperationStream = (network: NetworkType, limit = 20) => {
  const [operations, setOperations] = useState<OperationRecord[]>([]);
  const closeStreamRef = useRef<(() => void) | null>(null);
  const horizonUrl = getHorizonUrl(network);

  useEffect(() => {
    let isMounted = true;

    const startStream = async () => {
      try {
        // Get initial operations
        const response = await fetch(`${horizonUrl}/operations?order=desc&limit=${limit}`);
        if (!response.ok) throw new Error('Failed to fetch initial operations');
        const data: HorizonResponse<OperationRecord> = await response.json();
        
        if (isMounted) {
          setOperations(data._embedded.records);
        }
        
        const server = new StellarSdk.Horizon.Server(horizonUrl);
        const lastOp = data._embedded.records[0];
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const closeStream = server
          .operations()
          .cursor(lastOp?.paging_token || 'now')
          .stream({
            onmessage: (operation: any) => {
              if (isMounted) {
                setOperations(prev => {
                  const newOps = [operation as OperationRecord, ...prev.slice(0, limit - 1)];
                  return newOps;
                });
              }
            },
            onerror: () => {
              console.warn('Operation stream error');
              // Retry after 5 seconds
              setTimeout(() => startStream(), 5000);
            },
          });
        
        closeStreamRef.current = closeStream;
      } catch (error) {
        console.error('Failed to start operation stream:', error);
        setTimeout(() => startStream(), 5000);
      }
    };

    startStream();
    
    return () => {
      isMounted = false;
      if (closeStreamRef.current) {
        closeStreamRef.current();
      }
    };
  }, [horizonUrl, limit]);

  return operations;
};

// Fetch fee stats
export const useFeeStats = (network: NetworkType) => {
  const horizonUrl = getHorizonUrl(network);
  
  return useQuery({
    queryKey: ['feeStats', network],
    queryFn: async (): Promise<FeeStats> => {
      const response = await fetch(`${horizonUrl}/fee_stats`);
      if (!response.ok) throw new Error('Failed to fetch fee stats');
      return response.json();
    },
    refetchInterval: 5000,
  });
};

// Fetch account balance
export const useAccountBalance = (network: NetworkType, accountId: string) => {
  const horizonUrl = getHorizonUrl(network);
  
  return useQuery({
    queryKey: ['account', network, accountId],
    queryFn: async (): Promise<string> => {
      const response = await fetch(`${horizonUrl}/accounts/${accountId}`);
      if (!response.ok) {
        if (response.status === 404) return '0';
        throw new Error('Failed to fetch account');
      }
      const data = await response.json();
      const xlmBalance = data.balances.find(
        (b: { asset_type: string }) => b.asset_type === 'native'
      );
      return xlmBalance?.balance || '0';
    },
    refetchInterval: 60000, // Refresh every minute
  });
};

// Fetch lumen supply from dashboard API
export const useLumenSupply = () => {
  return useQuery({
    queryKey: ['lumenSupply'],
    queryFn: async (): Promise<LumenSupplyV2> => {
      const url = import.meta.env.DEV 
        ? '/api/dashboard/v2/lumens' 
        : `${DASHBOARD_API}/api/v2/lumens`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch lumen supply');
      return response.json();
    },
    refetchInterval: 300000, // Refresh every 5 minutes
    staleTime: 300000,
  });
};

// Fetch historical ledger data
export const useHistoricalLedgers = () => {
  return useQuery({
    queryKey: ['historicalLedgers'],
    queryFn: async (): Promise<LedgerStat[]> => {
      const url = import.meta.env.DEV 
        ? '/api/dashboard/ledgers/public' 
        : `${DASHBOARD_API}/api/ledgers/public`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch historical ledgers');
      return response.json();
    },
    refetchInterval: 3600000, // Refresh every hour
    staleTime: 3600000,
  });
};

// Fetch StatusPage data
export const useStatusPage = () => {
  return useQuery({
    queryKey: ['statusPage'],
    queryFn: async (): Promise<StatusPageSummary> => {
      // STATUSPAGE_API already handles dev vs prod URLs via proxy
      const response = await fetch(STATUSPAGE_API);
      if (!response.ok) throw new Error('Failed to fetch status');
      return response.json();
    },
    refetchInterval: 60000, // Refresh every minute
  });
};
