/**
 * @file useUserFetchReservationWithJoins.ts
 * @hook useUserFetchReservationWithJoins
 * @description
 * Custom React hook to fetch and subscribe to a specific reservation’s details
 * including full reservation data with joined `packages` and `grazing` table info.
 *
 * @features
 * - Fetches reservation by `id` for authenticated user
 * - Includes joined fields from `packages` and `grazing` tables
 * - Subscribes to real-time INSERT, UPDATE, DELETE changes for live updates
 * - Refetches data on updates to maintain relational joins
 *
 * @usage
 * Call this hook inside a component that needs detailed reservation information.
 *
 * @note
 * Real-time `UPDATE` events trigger a full refetch to preserve joined relational data integrity.
 * Uses `supabase.channel()` to subscribe only to changes from the current user's profile.
 *
 * @author John Rave Mimay
 * @created 2025-07-02
 */

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Reservation } from '@/types/reservation-types';
import { useProfileContext } from '@/context/ProfileContext';
import { logInfo, logSuccess, logError } from '@/utils/logger';

export function useUserFetchReservationWithJoins(reservation_id: any) {
  const { profile } = useProfileContext();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReservationsWithJoins = useCallback(async () => {
    if (!profile?.id) {
      setReservations([]);
      setError('User profile not found');
      logError('🚫 Profile ID missing during fetch', null);
      return;
    }

    setIsFetching(true);
    setError(null);
    logInfo(`📡 Fetching reservation [ID: ${reservation_id}] with joins...`);

    try {
      const { data, error: fetchError } = await supabase
        .from('reservations')
        .select(`
          *,
          packages(id, name),
          grazing(id, name)
        `)
        .eq('profile_id', profile.id)
        .eq('id', reservation_id)
        .order('id', { ascending: false });

      if (fetchError) throw fetchError;

      logSuccess(`✅ Reservation fetch success [${data?.length || 0} result(s)]`);
      setReservations(data as Reservation[]);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'An unknown error occurred';
      logError('❌ Failed to fetch reservations with joins:', errorMsg);
      setError(errorMsg);
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
    error,
    refetch: fetchReservationsWithJoins,
  };
}
