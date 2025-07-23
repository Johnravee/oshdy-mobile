/**
 * @file usePendingReservationCount.ts
 * Custom hook to fetch the number of pending reservations for a given user.
 *
 * @returns pendingCount - Number of pending reservations.
 * @returns loadingPending - Loading state.
 */

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useProfileContext } from '@/context/ProfileContext';
import { logInfo, logSuccess, logError } from '@/utils/logger';

export const usePendingReservationCount = () => {
  const { profile } = useProfileContext();
  const [pendingCount, setPendingCount] = useState(0);
  const [loadingPending, setLoadingPending] = useState(false);

  useEffect(() => {
    if (!profile?.id) return;

    const fetchPendingCount = async () => {
      setLoadingPending(true);
      logInfo('🔍 Checking for pending reservations...');

      const { count, error } = await supabase
        .from('reservations')
        .select('*', { count: 'exact', head: true })
        .eq('profile_id', profile.id)
        .eq('status', 'pending');

      if (error) {
        logError('❌ Failed to fetch pending reservation count:', error);
        setPendingCount(0);
      } else {
        logSuccess(`✅ Pending reservation count: ${count}`);
        setPendingCount(count || 0);
      }

      setLoadingPending(false);
    };

    fetchPendingCount();
  }, [profile?.id]);

  return { pendingCount, loadingPending };
};
