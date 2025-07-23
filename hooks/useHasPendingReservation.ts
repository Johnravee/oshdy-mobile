/**
 * Custom hook to check if the current user has a pending reservation.
 * @returns { hasPending: boolean, isChecking: boolean, error: string | null }
 */

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useProfileContext } from '@/context/ProfileContext';
import { logInfo, logSuccess, logError } from '@/utils/logger';

export function useHasPendingReservation() {
  const { profile } = useProfileContext();
  const [hasPending, setHasPending] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  useEffect(() => {
    const checkPendingReservation = async () => {
      if (!profile?.id) {
        logInfo('⚠️ Skipping pending reservation check — no profile ID.');
        return;
      }

      setIsChecking(true);
      logInfo(`🔍 Checking for pending reservation for profile ID: ${profile.id}`);

      const { data, error } = await supabase
        .from('reservations')
        .select('id')
        .eq('profile_id', profile.id)
        .eq('status', 'pending')
        .limit(1);

      if (error) {
        logError('❌ Error checking pending reservations:', error.message);
        setHasPending(false);
      } else {
        const hasResult = data.length > 0;
        logSuccess(`✅ Pending reservation ${hasResult ? 'found' : 'not found'} for user ${profile.id}`);
        setHasPending(hasResult);
      }

      setIsChecking(false);
    };

    checkPendingReservation();
  }, [profile?.id]);

  return { hasPending, isChecking };
}
