/**
 * @file useTotalBookCountByUser.ts
 * Custom hook to fetch the total number of reservations (any status) for a given user.
 *
 * @returns totalCount - Number of reservations.
 * @returns totalCountLoading - Loading state.
 */

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useProfileContext } from '@/context/ProfileContext';
import { logInfo, logSuccess, logError } from '@/utils/logger';

export const useTotalBookCountByUser = () => {
  const { profile } = useProfileContext();
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalCountLoading, setTotalCountLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!profile?.id) return;

    const fetchCompletedCount = async () => {
      setTotalCountLoading(true);
      logInfo('📦 Fetching total reservation count for user...');

      const { count, error } = await supabase
        .from('reservations')
        .select('*', { count: 'exact', head: true })
        .eq('profile_id', profile.id);

      if (error) {
        logError('❌ Error fetching total reservation count:', error);
        setTotalCount(0);
      } else {
        logSuccess(`✅ Total reservation count: ${count}`);
        setTotalCount(count || 0);
      }

      setTotalCountLoading(false);
    };

    fetchCompletedCount();
  }, [profile?.id]);

  return { totalCount, totalCountLoading };
};
