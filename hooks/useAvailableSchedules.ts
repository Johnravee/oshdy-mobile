/**
 * @file useAvailableSchedules.ts
 * Custom React hook to check if a reservation date is available in Supabase.
 *
 * @returns isAvailable - Whether the date is free (true), taken (false), or unknown (null).
 * @returns checkingAvailability - Loading state.
 * @returns error - Error message if fetch fails.
 * @returns checkDateAvailability - Function to trigger the availability check.
 */


import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export function useAvailableSchedules() {
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [checkingAvailability, isCheckingAvailability] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkDateAvailability = async (date: string) => {
    isCheckingAvailability(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('reservations') 
        .select('id')
        .eq('event_date', date);

      if (error) throw error;

      // Assume the date is available if no existing reservation
      setIsAvailable(data.length === 0);
    } catch (err: any) {
      setError(err.message);
      setIsAvailable(null);
    } finally {
        isCheckingAvailability(false);
    }
  };

  return { isAvailable, checkingAvailability, error, checkDateAvailability };
}
