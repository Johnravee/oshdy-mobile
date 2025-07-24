/**
 * @file useInsertReservation.ts
 * React hook that uses the API to insert a reservation with state management and logging.
 */

import { useState } from 'react';
import { ReservationData } from '@/types/reservation-types';
import { useProfileContext } from '@/context/ProfileContext';
import { insertReservation } from '@/lib/api/insertUserReservation';
import { logInfo, logSuccess, logError } from '@/utils/logger';

export const useInsertReservation = () => {
  const { profile } = useProfileContext();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleInsert = async (reservationData: ReservationData) => {
    if (!profile?.id) {
      logError('❌ Cannot insert reservation: Missing profile ID.', null);
      return null;
    }

    setLoading(true);
    setSuccess(false);

    try {
      logInfo('📝 Calling insertReservation API...');
      const { data, receiptId } = await insertReservation(profile.id, reservationData);
      logSuccess(`✅ Reservation inserted with receipt ID: ${receiptId}`);
      setSuccess(true);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error occurred';
      logError('❌ Failed to insert reservation:', message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { insertReservation: handleInsert, loading, success };
};
