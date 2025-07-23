/**
 * @file usePGMTData.ts
 * @description
 * Custom hook to fetch combined PGMT data (Packages, Grazing, Menu, ThemeMotif)
 * from a Supabase RPC procedure.
 */

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { PGMTDataType } from '@/types/pgmt-types';
import { logInfo, logSuccess, logError } from '@/utils/logger';

/**
 * Hook to fetch PGMT data via Supabase RPC.
 * @returns {{
 *   pgmtData: PGMTDataType,
 *   pgmtLoading: boolean,
 * }}
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

      const { data, error } = await supabase.rpc('get_pgm_data');

      if (error) {
        logError('❌ Failed to fetch PGMT data:', error.message);
      } else {
        setPGMTData({
          packages: data?.packages || [],
          grazing: data?.grazing || [],
          menu: data?.menu || [],
          thememotif: data?.thememotif || [],
        });
        logSuccess('✅ PGMT data fetched successfully');
      }

      setPgmtLoading(false);
    };

    fetchPGMTData();
  }, []);

  return { pgmtData, pgmtLoading };
}
