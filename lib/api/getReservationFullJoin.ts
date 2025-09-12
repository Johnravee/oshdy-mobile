import { useProfileContext } from "@/context/ProfileContext";
import { supabase } from "../supabase";
import { logError } from "@/utils/logger";

/**
 * Fetches a reservation by ID with joined package and grazing info.
 *
 * @param {number} reservation_id - Reservation ID to fetch.
 * @returns {Promise<any[] | undefined>} Reservation data or undefined on error.
 */
export const getReservationFullJoinInformation = async (reservation_id: number, profile_id: number): Promise<any[] | undefined> => {
  

  try {
    if (!profile_id) {
      logError('getReservationFullJoin -> profile id undefined:', null);
      return;
    }

    const { data, error } = await supabase
      .from('reservations')
      .select(`
        *,
         package_id,
        packages (
          id,
          name
        )
        grazing(id, name)
      `)
      .eq('profile_id', profile_id)
      .eq('id', reservation_id)
      .order('id', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    logError('getReservationFullJoin -> fetch error:', error);
  }
};
