/**
 * @file usePGMTData.ts
 * @description
 * Custom hook to fetch combined PGMT data (Packages, Grazing, Menu, ThemeMotif)
 * from a Supabase RPC procedure.
 */

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { PGMTDataType } from '@/types/pgmt-types';

/**
 * Hook to fetch PGMT data via Supabase RPC.
 * @returns {{
 *   pgmtData: PGMTDataType,
 *   pgmtLoading: boolean,
 *   pgmtError: string | null
 * }}
 */
export function usePGMTData(): {
  pgmtData: PGMTDataType;
  pgmtLoading: boolean;
  pgmtError: string | null;
} {
  const [pgmtData, setPGMTData] = useState<PGMTDataType>({
    packages: [],
    grazing: [],
    menu: [],
    thememotif: [],
  });

  const [pgmtLoading, setPgmtLoading] = useState(true);
  const [pgmtError, setPgmtError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPGMTData = async () => {
      const { data, error } = await supabase.rpc('get_pgm_data');

      if (error) {
        console.error('PGMT Data Error:', error.message);
        setPgmtError(error.message);
      } else {
        setPGMTData({
          packages: data?.packages || [],
          grazing: data?.grazing || [],
          menu: data?.menu || [],
          thememotif: data?.thememotif || [],
        });
      }


      setPgmtLoading(false);
    };

    fetchPGMTData();
  }, []);

  return { pgmtData, pgmtLoading, pgmtError };
}
