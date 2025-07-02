/**
 * @file useFetchUserReservations.ts
 * @hook useFetchUserReservations
 * @description
 * Custom React hook to fetch and subscribe to a user's reservation data from Supabase.
 * Handles initial data loading, error states, and real-time updates via `supabase.channel`.
 *
 * @features
 * - Fetches reservations for authenticated user
 * - Joins related `packages` data
 * - Subscribes to real-time INSERT, UPDATE, DELETE events
 * - Provides manual refetch method
 *
 * @author John Rave Mimay
 * @created 2025-06-29
 */

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthContext } from '@/context/AuthContext';

// Represents a reservation package
export interface Package {
  id: number;
  name: string;
}

// Represents a user reservation
export interface ReservationWithPackage {
  id: number;
  receipt_number: string;
  celebrant: string;
  status: string;
  package?: Package;
}

// Hook to fetch and subscribe to user-specific reservations
export const useFetchUserReservations = () => {
  const { profile } = useAuthContext();
  const [reservations, setReservations] = useState<ReservationWithPackage[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch reservations from Supabase for the current user
  const fetchReservationsWithPackage = useCallback(async () => {
    if (!profile?.id) {
      setReservations([]);
      setError('User profile not found');
      setIsFetching(false);
      return;
    }

    setIsFetching(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('reservations')
        .select(`
          id,
          receipt_number,
          celebrant,
          status,
          package (
           id,
           name
          )
        `)
        .eq('profile_id', profile.id)
        .order('id', { ascending: false });

        console.log("Reservation With Package:", data);
        

      if (fetchError) throw fetchError;

      setReservations(data as any);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setReservations([]);
    } finally {
      setIsFetching(false);
    }
  }, [profile?.id]);

  useEffect(() => {
    fetchReservationsWithPackage();

    if (!profile?.id) return;

    // Subscribe to real-time reservation changes for the current user
    const channel = supabase
      .channel('public:reservations')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reservations',
          filter: `profile_id=eq.${profile.id}`
        },
        (payload) => {
          const newReservation = payload.new as ReservationWithPackage;
          const oldReservation = payload.old as ReservationWithPackage;

          setReservations((current) => {
            switch (payload.eventType) {
              case 'INSERT':
                return [...current, newReservation];
              case 'UPDATE':
                return current.map((res) =>
                  res.id === newReservation.id
                    ? { ...newReservation, package: res.package }
                    : res
                );
              case 'DELETE':
                return current.filter((res) => res.id !== oldReservation.id);
              default:
                return current;
            }
          });
        }
      )
      .subscribe();

    // Clean up the real-time subscription when unmounted
    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchReservationsWithPackage, profile?.id]);

  // Return reservations and related state/actions
  return { reservations, isFetching, error };
};
