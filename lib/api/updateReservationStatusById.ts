import { supabase } from '@/lib/supabase';
import { logError, logInfo, logSuccess } from '@/utils/logger';

/**
 * Updates the status of a reservation by its ID.
 *
 * @param reservationId - The UUID of the reservation
 * @param newStatus - The new status to set (e.g. 'cancelled', 'approved', 'completed')
 * @returns Supabase response or error
 */
export async function updateReservationStatusById(reservationId: string, status: string) {
  logInfo(`🛠️ Attempting to update reservation [${reservationId}] to status: "${status}"`);

  if(!reservationId) return logError(`updateReservationStatusById -> Reservation id undefined:`, null);


  try {
    const { data, error } = await supabase
      .from('reservations')
      .update({ status })
      .eq('id', Number(reservationId))
      .single();
      
      

    if (error) {
      throw error;
    }

    logSuccess(`updateReservationStatusById -> Successfully updated reservation [${reservationId}] to "${status}"`, data);
    return { data };
  } catch (error: any) {
    logError(`updateReservationStatusById -> Error updating reservation [${reservationId}]:`, error);
    return { error };
  }
}
