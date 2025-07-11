/**
 * @file useTotalBookCountByUser.ts
 * Custom hook to fetch the total number of completed reservations for a given user.
 *
 * @param profile_id - The user's profile ID.
 * @returns completedCount - Number of completed reservations.
 * @returns loadingCompleted - Loading state.
 * @returns errorCompleted - Error message if fetching fails.
 */

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useProfileContext } from '@/context/ProfileContext';

export const useTotalBookCountByUser = () => {
  const { profile } = useProfileContext();
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalCountLoading, setTotalCountLoading] = useState<boolean>(false);
  const [errorTotalCount, setErrorTotalCount] = useState<string | null>(null);

  useEffect(() => {
    if (!profile?.id) return;

    const fetchCompletedCount = async () => {
      setTotalCountLoading(true);
      setErrorTotalCount(null);

      const { count, error } = await supabase
        .from('reservations')
        .select('*', { count: 'exact', head: true })
        .eq('profile_id', profile.id)
        

      if (error) {
        setErrorTotalCount(error.message);
        setTotalCount(0);
      } else {
        setTotalCount(count || 0);
      }

      setTotalCountLoading(false);
    };

    fetchCompletedCount();
  }, [profile?.id]);

  return { totalCount, totalCountLoading, errorTotalCount };
};
