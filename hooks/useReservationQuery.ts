import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ReservationData } from '@/types/reservation-types';

export const useInsertReservation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const insertReservation = async (reservationData: ReservationData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { personal, event, guests, menu } = reservationData;

      const { data, error: insertError } = await supabase
        .from('reservations')
        .insert([
          {
            name: personal.name,
            email: personal.email,
            contact: personal.contact,
            address: personal.address,
            celebrant: event.celebrant,
            package: event.pkg,
            theme: event.theme,
            venue: event.venue,
            event_date: event.eventDate,
            event_time: event.eventTime,
            location: event.location,
            adults_quantity: parseInt(guests.adults),
            kids_quantity: parseInt(guests.kids),
            menu: menu ? JSON.stringify(menu) : null,
          },
        ])
       

      if (insertError) throw insertError;

      setSuccess(true);
      return data; // Return the inserted data if needed
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
