import { supabase } from "../supabase";

/**
 * Gets total number of 'pending' reservations for the given profile ID.
 *
 * @param {number} profileId - User's profile ID
 * @returns {Promise<number | undefined>} Total count or undefined on error.
 */

export const getPendingReservationCount = async (
  profileId: number
): Promise<number | undefined> => {
  try {
    const { count, error } = await supabase
      .from('reservations')
      .select('*', { count: 'exact', head: true })
      .eq('profile_id', profileId)
      .eq('status', 'pending');

    if (error) throw error;

    const total = typeof count === 'number' ? count : 0;
    return total;
  } catch (error) {
    console.error('❌ getPendingReservationCount -> counting error:', error);
  }
};

