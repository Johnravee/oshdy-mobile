/**
 * @file usePGMTData.ts
 * @description
 * Custom hook to fetch combined PGMT data (Packages, Grazing, Menu, ThemeMotif)
 * from a Supabase RPC procedure.
 */

import { useState, useEffect } from 'react';
import { PGMTDataType } from '@/types/pgmt-types';
import { logInfo, logSuccess, logError } from '@/utils/logger';
import { getPGMT } from '@/lib/api/getPGMT';

/**
 * Hook to fetch PGMT data via Supabase RPC.
 * @returns { pgmtData, pgmtLoading }
 */
export function usePGMTData(): {
  pgmtData: PGMTDataType;
  pgmtLoading: boolean;
} {
  const [pgmtData, setPGMTData] = useState<PGMTDataType>({
    packages: [],
    grazing: [],
    menu: [],
    thememotif: [],
  });

  const [pgmtLoading, setPgmtLoading] = useState(true);

  useEffect(() => {
    const fetchPGMTData = async () => {
      logInfo('📦 Fetching PGMT data...');
      setPgmtLoading(true);

      try {
        const data = await getPGMT();

        if (!data) {
          throw new Error('PGMT data is null or empty.');
        }
        

        setPGMTData({
          packages: data.packages || [],
          grazing: data.grazing || [],
          menu: data.menu || [],
          thememotif: data.thememotif || [],
        });

        logSuccess('✅ PGMT data fetched successfully');
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        logError('❌ Failed to fetch PGMT data:', message);
      } finally {
        setPgmtLoading(false);
      }
    };

    fetchPGMTData();
  }, []);

  return { pgmtData, pgmtLoading };
}
