import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { ReservationWithPackage } from '@/types/reservation-types';
import { useProfileContext } from '@/context/ProfileContext';
import { logInfo, logSuccess, logError } from '@/utils/logger';
import { getReservationPackages } from '@/lib/api/getReservationJoinPackage';

/**
 * Custom hook to fetch and subscribe to reservation data for the current user.
 * Used in reservation-history.tsx
 *
 * @returns {{
 *   reservations: ReservationWithPackage[],
 *   isFetching: boolean
 * }}
 *
 * - Fetches reservations joined with package info from Supabase.
 * - Subscribes to real-time changes (INSERT, UPDATE, DELETE) on the reservations table.
 * - Returns the current reservation list and loading state.
 */


export const useFetchUserReservations = (): {
  reservations: ReservationWithPackage[];
  isFetching: boolean;
} => {
  const { profile } = useProfileContext();
  const [reservations, setReservations] = useState<ReservationWithPackage[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);


  // Fetch reservations from Supabase for the current user
  const fetchReservationsWithPackage = useCallback(async () => {
    if (!profile?.id) {
      setReservations([]);
      setIsFetching(false);
      logError('Profile not found when fetching reservations', null);
      return;
    }

    logInfo('Fetching reservations with package for user', profile.id);
    setIsFetching(true);


    try {
     
      const data = await getReservationPackages(profile.id);
      logSuccess('Successfully fetched reservations', data);
      setReservations(data as any);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setReservations([]);
      logError('fetchReservationsWithPackage -> Failed to fetch reservations', err);
    } finally {
      setIsFetching(false);
    }
  }, [profile?.id]);


  /**
   * Initializes reservation fetching and sets up a real-time Supabase subscription
   * that listens for changes to the current user's reservations.
   */

  useEffect(() => {
    fetchReservationsWithPackage();

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
          const newReservation = payload.new as ReservationWithPackage;
          const oldReservation = payload.old as ReservationWithPackage;

          logInfo(`Realtime event: ${payload.eventType}`, payload);

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

    logInfo('Subscribed to real-time reservation updates');

    return () => {
      supabase.removeChannel(channel);
      logInfo('Unsubscribed from reservation updates');
    };
  }, [fetchReservationsWithPackage, profile?.id]);

  return { reservations, isFetching };
};
