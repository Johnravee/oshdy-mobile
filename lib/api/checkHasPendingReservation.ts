// @/lib/api/checkHasPendingReservation.ts
import { supabase } from '@/lib/supabase';
import { logError } from '@/utils/logger';

export const checkHasPendingReservation = async (profileId: number): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('reservations')
      .select('id')
      .eq('profile_id', profileId)
      .eq('status', 'pending')
      .limit(1);

    if (error) throw error;

    return data.length > 0;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    logError('❌ checkHasPendingReservation error:', message);
    return false;
  }
};
