
import { supabase } from "../supabase";
import { logError, logInfo } from "@/utils/logger";

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
        package_id,
        packages (
          id,
          name
        )
      `)
      .eq('profile_id', profileId)
      .order('id', { ascending: false });

      logInfo('getReservationJoinPackage -> fetched data:', data);

    if (error) throw error;
    return data;
  } catch (error) {
    logError('getReservationJoinPackage -> fetch error:', error);
  }
};
