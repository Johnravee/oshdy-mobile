import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export const useCompletedBookByUser = (profile_id: number | null) => {
  const [completedCount, setCompletedCount] = useState<number>(0);
  const [loadingCompleted, setLoadingCompleted] = useState<boolean>(false);
  const [errorCompleted, setErrorCompleted] = useState<string | null>(null);

  useEffect(() => {
    if (!profile_id) return;

    const fetchCompletedCount = async () => {
      setLoadingCompleted(true);
      setErrorCompleted(null);

      const { count, error } = await supabase
        .from('reservations')
        .select('*', { count: 'exact', head: true })
        .eq('profile_id', profile_id)
        .eq('status', 'completed'); // Make sure 'completed' matches your schema

      if (error) {
        setErrorCompleted(error.message);
        setCompletedCount(0);
      } else {
        setCompletedCount(count || 0);
      }

      setLoadingCompleted(false);
    };

    fetchCompletedCount();
  }, [profile_id]);

  return { completedCount, loadingCompleted, errorCompleted };
};
