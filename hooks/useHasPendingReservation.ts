
/**
 * Custom hook to check if the current user has a pending reservation.
 * @returns { hasPending: boolean, loading: boolean, error: string | null }
 */

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useProfileContext } from '@/context/ProfileContext';


export function useHasPendingReservation() {
  const { profile } = useProfileContext();
  const [hasPending, setHasPending] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkPendingReservation = async () => {
      if (!profile?.id) return;

      setIsChecking(true);
      const { data, error } = await supabase
        .from('reservations')
        .select('id')
        .eq('profile_id', profile.id)
        .eq('status', 'pending')
        .limit(1);

      if (error) {
        setError(error.message);
        setHasPending(false);
      } else {
        setHasPending(data.length > 0);
      }

      setIsChecking(false);
    };

    checkPendingReservation();
  }, [profile?.id]);

  return { hasPending, isChecking, error };
}
