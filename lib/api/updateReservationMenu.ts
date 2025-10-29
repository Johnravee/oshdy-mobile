import { supabase } from '../supabase';

/**
 * Updates the menu selection for a reservation.
 * @param reservationId Reservation ID
 * @param menuIds Array of menu option IDs
 * @returns Promise with error or null
 */
export async function updateReservationMenu(reservationId: number, menuIds: number[]): Promise<{ error: any }> {
  
  // delete lang recent menu
  const { error: deleteError } = await supabase
    .from('reservation_menu_orders')
    .delete()
    .eq('reservation_id', reservationId);

  if (deleteError) return { error: deleteError };

  // Insert new menu orders
  const inserts = menuIds.map((menu_option_id) => ({ reservation_id: reservationId, menu_option_id }));
  const { error: insertError } = await supabase
    .from('reservation_menu_orders')
    .insert(inserts);

  return { error: insertError };
}
