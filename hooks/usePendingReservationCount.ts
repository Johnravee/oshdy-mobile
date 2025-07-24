

import { useEffect, useState } from 'react';
import { useProfileContext } from '@/context/ProfileContext';
import { logInfo, logSuccess } from '@/utils/logger';
import { getPendingReservationCount } from '@/lib/api/getPendingReservationCount';

/**
 * @file usePendingReservationCount.ts
 * Custom hook to fetch the number of pending reservations for a given user.
 *
 * @returns pendingCount - Number of pending reservations.
 * @returns loadingPending - Loading state.
 */


export const usePendingReservationCount = (): {
  pendingCount: number
  loadingPending: boolean
} => {
  const { profile } = useProfileContext();
  const [pendingCount, setPendingCount] = useState(0);
  const [loadingPending, setLoadingPending] = useState(false);

  useEffect(() => {
    if (!profile?.id) return;

    const fetchPendingCount = async () => {
      setLoadingPending(true);
      logInfo('🔍 Checking for pending reservations...');

      const count = await getPendingReservationCount(profile.id)

       if (typeof count === 'number') {
        logSuccess(`✅ Completed reservation count: ${count}`);
        setPendingCount(count);
      }

      setLoadingPending(false);
    };

    fetchPendingCount();
  }, [profile?.id]);

  return { pendingCount, loadingPending };
};
