

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Reservation } from '@/types/reservation-types';
import { useProfileContext } from '@/context/ProfileContext';
import { logInfo, logSuccess, logError } from '@/utils/logger';
import { getReservationFullJoinInformation } from '@/lib/api/getReservationFullJoin';

/**
 * Custom hook to fetch and subscribe to a reservation with joined `packages` and `grazing` info.
 *
 * @param {number} reservation_id - ID of the reservation to fetch.
 * @returns {{
 *   reservations: Reservation[],
 *   isFetching: boolean,
 *   refetch: () => Promise<void>
 * }} Hook result including data, loading state, and manual refetch.
 */

export function useUserFetchReservationWithJoins(reservation_id: number): {
  reservations: Reservation[];
  isFetching: boolean;
  refetch: () => Promise<void>;
} {
  const { profile } = useProfileContext();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);


  const fetchReservationsWithJoins = useCallback(async () => {
    if (!profile?.id) {
      setReservations([]);
      logError('🚫 Profile ID missing during fetch', null);
      return;
    }

    setIsFetching(true);
    logInfo(`📡 Fetching reservation [ID: ${reservation_id}] with joins...`);

    try {
      const data = await getReservationFullJoinInformation(reservation_id, profile.id)

      logSuccess(`✅ Reservation fetch success [${data?.length || 0} result(s)]`);
      setReservations(data as Reservation[]);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'An unknown error occurred';
      logError('❌ Failed to fetch reservations with joins:', errorMsg);
      setReservations([]);
    } finally {
      setIsFetching(false);
    }
  }, [profile?.id, reservation_id]);

  useEffect(() => {
    fetchReservationsWithJoins();

    if (!profile?.id) return;

    const channel = supabase
      .channel('public:reservations')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reservations',
          filter: `profile_id=eq.${profile.id}`,
        },
        (payload) => {
          const newReservation = payload.new as Reservation;
          const oldReservation = payload.old as Reservation;


          setReservations((current) => {
            switch (payload.eventType) {
              case 'INSERT':
                logSuccess('🆕 New reservation inserted');
                return [...current, newReservation];
              case 'UPDATE':
                logInfo('🔁 Reservation updated - refetching...');
                fetchReservationsWithJoins();
                return current;
              case 'DELETE':
                logInfo('🗑️ Reservation deleted');
                return current.filter((res) => res.id !== oldReservation.id);
              default:
                return current;
            }
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      logInfo('📴 Supabase reservation channel unsubscribed');
    };
  }, [fetchReservationsWithJoins, profile?.id, reservation_id]);

  return {
    reservations,
    isFetching,
    refetch: fetchReservationsWithJoins,
  };
}
