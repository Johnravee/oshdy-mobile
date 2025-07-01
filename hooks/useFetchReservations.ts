import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthContext } from '@/context/AuthContext';


export interface Package {
    id: number;
    name: string;
    ratings: number;
    created_at: string;
  }

export interface Reservation {
  id: number;
  receipt_number: string;
  profile_id: number;
  celebrant: string;
  theme_motif_id: number;
  venue: string;
  event_date: string;
  event_time: string;
  location: string;
  adults_qty: number;
  kids_qty: number;
  package: number;
  grazing_id: number;
  status: string;
  created_at: string;
  menu: any;
  packages?: Package;
}

export const useFetchUserReservations = () => {
  const { profile } = useAuthContext();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReservations = useCallback(async () => {
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
          *,
          packages(*)
        `)
        .eq('profile_id', profile.id)
        .order('id', { ascending: false });

        
      if (fetchError) throw fetchError;

      setReservations(data as Reservation[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setReservations([]);
    } finally {
      setIsFetching(false);
    }
  }, [profile?.id]);

  useEffect(() => {
    fetchReservations();

    if (!profile?.id) return;

    // Subscribe to realtime changes filtered by profile_id
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
          const newReservation = payload.new as Reservation;
          const oldReservation = payload.old as Reservation;

          setReservations((current) => {
            switch (payload.eventType) {
              case 'INSERT':
                return [...current, newReservation];
                case 'UPDATE':
                    return current.map((res) =>
                      res.id === newReservation.id
                        ? { ...newReservation, packages: res.packages } 
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

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchReservations, profile?.id]);

  return { reservations, isFetching, error, refetch: fetchReservations };
};
