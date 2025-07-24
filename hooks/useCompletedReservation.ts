import { useEffect, useState } from 'react';
import { useProfileContext } from '@/context/ProfileContext';
import { logInfo, logSuccess, logError } from '@/utils/logger';
import { getCompletedReservationCount } from '@/lib/api/getCompletedReservationCount';

/**
 * Custom hook to fetch the total number of completed reservations for the current user.
 *
 * @returns {Object} An object containing:
 * - totalCount: number of completed reservations.
 * - totalCountLoading: loading state while fetching.
 */
export const useCompletedReservationCount = (): {
  totalCount: number
  totalCountLoading: boolean
} => {
  const { profile } = useProfileContext();
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalCountLoading, setTotalCountLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!profile?.id) return;

    const fetchCompletedCount = async () => {
      setTotalCountLoading(true);
      logInfo('📦 Fetching completed reservation count for user...');

      try {
        const count = await getCompletedReservationCount(profile.id);

        if (typeof count === 'number') {
          logSuccess(`✅ Completed reservation count: ${count}`);
          setTotalCount(count);
        }
      } catch (error) {
        logError('❌ Failed to fetch completed reservation count:', error);
      } finally {
        setTotalCountLoading(false);
      }
    };

    fetchCompletedCount();
  }, [profile?.id]);

  return { totalCount, totalCountLoading };
};
