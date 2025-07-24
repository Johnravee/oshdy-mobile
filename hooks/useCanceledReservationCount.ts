/**
 * @file useCanceledReservationCount.ts
 * Custom hook to fetch the number of canceled reservations for a given user.
 *
 * @returns canceledCount - Number of canceled reservations.
 * @returns loadingCanceled - Loading state.
 */
import { useEffect, useState } from 'react';
import { useProfileContext } from '@/context/ProfileContext';
import { getCanceledReservation } from '@/lib/api/getCanceledReservationCount';
import { logSuccess, logError } from '@/utils/logger';

export const useCanceledReservationCount = (): {
  canceledCount: number
  loadingCanceled: boolean
} => {
  const { profile } = useProfileContext();
  const [canceledCount, setCanceledCount] = useState<number>(0);
  const [loadingCanceled, setLoadingCanceled] = useState(false);

  useEffect(() => {
    if (!profile?.id) return;

    const fetchCanceledCount = async () => {
      setLoadingCanceled(true);

      try {
        const count = await getCanceledReservation(profile.id);
        if (typeof count === 'number') {
          logSuccess(`✅ Canceled reservation count: ${count}`);
          setCanceledCount(count); 
        }
      } catch (error) {
        logError('❌ Failed to fetch canceled count:', error);
      } finally {
        setLoadingCanceled(false);
      }
    };

    fetchCanceledCount();
  }, [profile?.id]);

  return { canceledCount, loadingCanceled };
};
