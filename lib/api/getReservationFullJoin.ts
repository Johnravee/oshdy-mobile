import { supabase } from "../supabase";
import { logError } from "@/utils/logger";

/**
 * Fetches a reservation by ID with all joined data:
 * packages, grazing, theme_motif, and reservation_menu_orders → menu_options
 *
 * @param {number} reservation_id - Reservation ID to fetch.
 * @param {number} profile_id - Current user's profile ID.
 * @returns {Promise<any[] | undefined>} Reservation data or undefined on error.
 */
export const getReservationFullJoinInformation = async (
  reservation_id: number,
  profile_id: number
): Promise<any[] | undefined> => {
  try {
    if (!profile_id) {
      logError("getReservationFullJoin -> profile id undefined:", null);
      return;
    }

    const { data, error } = await supabase
      .from("reservations")
      .select(`
        *,
        packages (
          id,
          name
        ),
        grazing (
          id,
          name
        ),
        thememotif (
          id,
          name
        ),
        reservation_menu_orders (
          id,
          menu_options (
            id,
            name,
            category
          )
        )
      `)
      .eq("profile_id", profile_id)
      .eq("id", reservation_id)
      .order("id", { ascending: false });

    if (error) throw error;

    return data;
  } catch (error) {
    logError("getReservationFullJoin -> fetch error:", error);
  }
};
