// useInsertReservation.ts
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ReservationData } from '@/types/reservation-types';
import { useAuthContext } from '@/context/AuthContext';
import generateUniqueReceiptId from '@/utils/receipt-generator';
import convertDateTime from '@/utils/convertDateTime';

export const useInsertReservation = () => {
  const { profile } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const  receiptId  = generateUniqueReceiptId();
  
  const insertReservation = async (reservationData: ReservationData) => {
    setLoading(true);
    setError(null);
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
        event_date: event_date,
        event_time: event_time,
        location: event.location,
        adults_qty: parseInt(guests.adults),
        kids_qty: parseInt(guests.kids),
        grazing_id: Number(event.grazingTable.id),
        menu: menu ? JSON.stringify(menu) : null,
        status: 'pending',
      };

      console.log('Payload:', payload);

      const { data, error: insertError } = await supabase
        .from('reservations')
        .insert([payload]);

      if (insertError) {
        console.error('Supabase Insert Error:', insertError);
        throw insertError;
      }

      setSuccess(true);
      return data;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'An unexpected error occurred';
      console.error('Error inserting reservation:', message);
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { insertReservation, loading, error, success };
};




