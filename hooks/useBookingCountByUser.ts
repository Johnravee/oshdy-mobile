import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export const useUserBookingCountByUser = (profile_id: number | null) => {
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loadingTotal, setLoadingTotal] = useState<boolean>(false);
  const [errorTotal, setErrorTotal] = useState<string | null>(null);

  useEffect(() => {
    if (!profile_id) return;

    const fetchBookingCount = async () => {
      setLoadingTotal(true);
      setErrorTotal(null);

      const { count, error } = await supabase
        .from('reservations')
        .select('*', { count: 'exact', head: true })
        .eq('profile_id', profile_id);

      if (error) {
        setErrorTotal(error.message);
        setTotalCount(0);
      } else {
        setTotalCount(count || 0);
      }

      setLoadingTotal(false);
    };

    fetchBookingCount();
  }, [profile_id]);

  return { totalCount, loadingTotal, errorTotal };
};
