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
import { useAuthContext } from '@/context/AuthContext';

// --- Types ---
export interface Packages {
  id: number;
  name: string;
}

export interface Grazing {
  id: number;
  name: string;
}

export interface Reservation {
  id: number;
  receipt_number: string;
  celebrant: string;
  theme_motif_id: number;
  venue: string;
  event_date: string;
  event_time: string;
  location: string;
  adults_qty: number;
  package: number,
  kids_qty: number;
  status: string;
  created_at: string;
  menu: any;
  packages?: Packages;
  grazing?: Grazing;
}

// --- Hook ---
export function useUserFetchReservationWithJoins(reservation_id: any) {
  const { profile } = useAuthContext();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReservationsWithJoins = useCallback(async () => {
    if (!profile?.id) {
      setReservations([]);
      setError('User profile not found');
      return;
    }

    setIsFetching(true);
    setError(null);

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

      console.log('Reservation with joins data:', data);

      setReservations(data as Reservation[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
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
                return [...current, newReservation];
              case 'UPDATE':
                fetchReservationsWithJoins()
              case 'DELETE':
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
    };
  }, [fetchReservationsWithJoins, profile?.id, reservation_id]);

  return {
    reservations,
    isFetching,
    error,
    refetch: fetchReservationsWithJoins,
  };
}
