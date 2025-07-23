import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { ReservationWithPackage } from '@/types/reservation-types';
import { useProfileContext } from '@/context/ProfileContext';
import { logInfo, logSuccess, logError } from '@/utils/logger';

// Hook to fetch and subscribe to user-specific reservations
export const useFetchUserReservations = () => {
  const { profile } = useProfileContext();
  const [reservations, setReservations] = useState<ReservationWithPackage[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch reservations from Supabase for the current user
  const fetchReservationsWithPackage = useCallback(async () => {
    if (!profile?.id) {
      setReservations([]);
      setError('User profile not found');
      setIsFetching(false);
      logError('Profile not found when fetching reservations', null);
      return;
    }

    logInfo('Fetching reservations with package for user', profile.id);
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

      if (fetchError) throw fetchError;

      logSuccess('Successfully fetched reservations', data);
      setReservations(data as any);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      setReservations([]);
      logError('Failed to fetch reservations', err);
    } finally {
      setIsFetching(false);
    }
  }, [profile?.id]);

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

  return { reservations, isFetching, error };
};
