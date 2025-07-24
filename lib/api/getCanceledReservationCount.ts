import { supabase } from "../supabase";
import { logError } from "@/utils/logger";

export const getCanceledReservation = async (profileId: number) =>{
    try {
         const { count, error } = await supabase
        .from('reservations')
        .select('*', { count: 'exact', head: true })
        .eq('profile_id', profileId)
        .eq('status', 'canceled');

        if(error) throw error

        const total =  typeof count === 'number' ? count : 0;

        return total;
    } catch (error) {
       logError('getCanceledReservation ->', error);
    }
}