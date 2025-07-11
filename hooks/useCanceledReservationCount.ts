/**
 * @file useCanceledReservationCount.ts
 * Custom hook to fetch the number of canceled reservations for a given user.
 *
 * @param profile_id - The user's profile ID.
 * @returns canceledCount - Number of canceled reservations.
 * @returns loadingCanceled - Loading state.
 * @returns errorCanceled - Error message if fetching fails.
 */

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useProfileContext } from '@/context/ProfileContext';

export const useCanceledReservationCount = () => {
  const { profile } = useProfileContext();
  const [canceledCount, setCanceledCount] = useState(0);
  const [loadingCanceled, setLoadingCanceled] = useState(false);
  const [errorCanceled, setErrorCanceled] = useState<string | null>(null);

  useEffect(() => {
    if (!profile?.id) return;

    const fetchCanceledCount = async () => {
      setLoadingCanceled(true);
      setErrorCanceled(null);

      const { count, error } = await supabase
        .from('reservations')
        .select('*', { count: 'exact', head: true })
        .eq('profile_id', profile.id)
        .eq('status', 'canceled');

      if (error) {
        setErrorCanceled(error.message);
        setCanceledCount(0);
      } else {
        setCanceledCount(count || 0);
      }

      setLoadingCanceled(false);
    };

    fetchCanceledCount();
  }, [profile?.id]);

  return { canceledCount, loadingCanceled, errorCanceled };
};
