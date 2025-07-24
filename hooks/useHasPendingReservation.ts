/**
 * @file useHasPendingReservation.ts
 * @description
 * Custom hook to determine if the currently logged-in user has a pending reservation.
 * Uses a Supabase query to check for the 'pending' status.
 *
 * @returns {{
 *   hasPending: boolean,
 *   isChecking: boolean
 * }}
 */

import { useEffect, useState } from 'react';
import { useProfileContext } from '@/context/ProfileContext';
import { logInfo, logSuccess, logError } from '@/utils/logger';
import { checkHasPendingReservation } from '@/lib/api/checkHasPendingReservation';

/**
 * Hook to check if the current user has a pending reservation.
 */
export function useHasPendingReservation() {
  const { profile } = useProfileContext();
  const [hasPending, setHasPending] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const check = async () => {
      if (!profile?.id) {
        logInfo('⚠️ Skipping pending reservation check — no profile ID.');
        setIsChecking(false);
        return;
      }

      setIsChecking(true);
      logInfo(`🔍 Checking for pending reservation for profile ID: ${profile.id}`);

      try {
        const result = await checkHasPendingReservation(profile.id);
        setHasPending(result);

        logSuccess(`✅ Pending reservation ${result ? 'found' : 'not found'} for user ${profile.id}`);
      } catch (error: any) {
        logError('❌ Error checking pending reservation:', error?.message || error);
        setHasPending(false);
      }

      setIsChecking(false);
    };

    check();
  }, [profile?.id]);

  return { hasPending, isChecking };
}
