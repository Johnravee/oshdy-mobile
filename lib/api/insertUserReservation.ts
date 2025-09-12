import { supabase } from '@/lib/supabase';
import { ReservationData } from '@/types/reservation-types';
import generateUniqueReceiptId from '@/utils/receipt-generator';
import convertDateTime from '@/utils/convertDateTime';
import { logInfo, logSuccess, logError } from '@/utils/logger';

type InsertReservationResponse = {
  data: any[] | null;
  receiptId: string;
};

/**
 * Inserts a new reservation into the Supabase database.
 *
 * @function insertReservation
 * @param {number} profileId - The ID of the user making the reservation.
 * @param {ReservationData} reservationData - The complete reservation data including event, guests, and menu.
 * @returns {Promise<InsertReservationResponse>} - An object containing the inserted data (or null) and the generated receipt ID.
 * @throws {Error} - Throws an error if the Supabase insert fails.
 */
export const insertReservation = async (
  profileId: number,
  reservationData: ReservationData
): Promise<InsertReservationResponse> => {
  const receiptId = generateUniqueReceiptId();
  const { event, guests, menu } = reservationData;
  const { event_date, event_time } = convertDateTime(event.eventDate, event.eventTime);

  const payload = {
    receipt_number: receiptId,
    profile_id: profileId,
    celebrant: event.celebrant,
    package_id: Number(event.pkg.id),
    theme_motif_id: Number(event.theme.id),
    venue: event.venue,
    event_date,
    event_time,
    location: event.location,
    adults_qty: parseInt(guests.adults),
    kids_qty: parseInt(guests.kids),
    grazing_id: Number(event.grazingTable.id),
    menu: menu ? JSON.stringify(menu) : null,
    status: 'pending',
  };

  logInfo('📦 Preparing to insert reservation with payload:', payload);

  const { data, error } = await supabase.from('reservations').insert([payload]);

  if (error) {
    logError('❌ Supabase insert error:', error.message);
    throw new Error(error.message);
  }

  logSuccess(`✅ Reservation inserted with receipt ID: ${receiptId}`);
  return { data, receiptId };
};
