
import { supabase } from "../supabase";
import { logError } from "@/utils/logger";

/**
 * Fetches reservations with package details for the current user.
 *
 * @returns {Promise<any[] | undefined>} Array of reservations or undefined on error.
 */
export const getReservationPackages = async (profileId: number): Promise<any[] | undefined> => {


  try {
    if (!profileId) {
      logError('getReservationJoinPackage -> profile id undefined:', null);
      return;
    }

    const { data, error } = await supabase
      .from('reservations')
      .select(`
        id,
        receipt_number,
        celebrant,
        status,
        package (
          id,
          name
        )
      `)
      .eq('profile_id', profileId)
      .order('id', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    logError('getReservationJoinPackage -> fetch error:', error);
  }
};
