/**
 * @file usePendingReservationCount.ts
 * Custom hook to fetch the number of pending reservations for a given user.
 *
 * @param profile_id - The user's profile ID.
 * @returns pendingCount - Number of pending reservations.
 * @returns loadingPending - Loading state.
 * @returns errorPending - Error message if fetching fails.
 */

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useProfileContext } from '@/context/ProfileContext';

export const usePendingReservationCount = () => {
  const { profile } = useProfileContext();
  const [pendingCount, setPendingCount] = useState(0);
  const [loadingPending, setLoadingPending] = useState(false);
  const [errorPending, setErrorPending] = useState<string | null>(null);

  useEffect(() => {
    if (!profile?.id) return;

    const fetchPendingCount = async () => {
      setLoadingPending(true);
      setErrorPending(null);

      const { count, error } = await supabase
        .from('reservations')
        .select('*', { count: 'exact', head: true })
        .eq('profile_id', profile.id)
        .eq('status', 'pending');

      if (error) {
        setErrorPending(error.message);
        setPendingCount(0);
      } else {
        setPendingCount(count || 0);
      }

      setLoadingPending(false);
    };

    fetchPendingCount();
  }, [profile?.id]);

  return { pendingCount, loadingPending, errorPending };
};
