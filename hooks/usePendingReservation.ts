import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export const usePendingReservation = (profileId: number | null) => {
  const [pendingReservation, setPendingReservation] = useState<any>(null);
  const [pendingLoading, setPendingLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    if (!profileId) {
      setPendingLoading(false);
      return;
    }

    const fetchReservation = async () => {
      setPendingLoading(true);

      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .eq('profile_id', profileId)
        .in('status', ['pending', 'confirmed', 'contract_signing', 'ongoing']) 
        .order('created_at', { ascending: false })
        .limit(1)
        .single(); // assumes only one matching reservation per profile

      if (error && error.code !== 'PGRST116') {
        setError(error);
      } else {
        setPendingReservation(data);
      }

      setPendingLoading(false);
    };

    fetchReservation();
  }, [profileId]);

  return { pendingReservation, pendingLoading, error };
};
