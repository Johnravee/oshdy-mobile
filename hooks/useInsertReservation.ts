/**
 * @file useInsertReservation.ts
 * Custom hook to insert a new reservation into Supabase.
 */

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ReservationData } from '@/types/reservation-types';
import generateUniqueReceiptId from '@/utils/receipt-generator';
import convertDateTime from '@/utils/convertDateTime';
import { useProfileContext } from '@/context/ProfileContext';
import { logInfo, logSuccess, logError } from '@/utils/logger';

export const useInsertReservation = () => {
  const { profile } = useProfileContext();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const receiptId = generateUniqueReceiptId();

  const insertReservation = async (reservationData: ReservationData) => {
    setLoading(true);
    setSuccess(false);

    try {
      const { event, guests, menu } = reservationData;
      const { event_date, event_time } = convertDateTime(event.eventDate, event.eventTime);

      const payload = {
        receipt_number: receiptId,
        profile_id: profile?.id,
        celebrant: event.celebrant,
        package: Number(event.pkg.id),
        theme_motif_id: Number(event.theme.id),
        venue: event.venue,
        event_date,
        event_time,
        location: event.location,
        adults_qty: parseInt(guests.adults),
        kids_qty: parseInt(guests.kids),
        grazing_id: Number(event.grazingTable.id),
        menu: menu ? JSON.stringify(menu) : null,
        status: 'pending',
      };

      logInfo('📝 Inserting new reservation with payload:', payload);

      const { data, error: insertError } = await supabase
        .from('reservations')
        .insert([payload]);

      if (insertError) {
        logError('❌ Supabase insert failed:', insertError.message);
        return null;
      }

      logSuccess(`✅ Reservation inserted successfully with receipt ID: ${receiptId}`);
      setSuccess(true);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unexpected error occurred';
      logError('❌ Error inserting reservation:', message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { insertReservation, loading, success };
};
