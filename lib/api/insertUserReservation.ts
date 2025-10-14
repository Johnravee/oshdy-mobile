import { supabase } from '@/lib/supabase';
import { ReservationData } from '@/types/reservation-types';
import generateUniqueReceiptId from '@/utils/receipt-generator';
import convertDateTime from '@/utils/convertDateTime';
import { logInfo, logSuccess, logError } from '@/utils/logger';

type InsertReservationResponse = {
  reservation: any | null;
  receiptId: string;
};

/**
 * Inserts a new reservation and related menu orders into the database.
 *
 * @param {number} profileId - The ID of the user making the reservation.
 * @param {ReservationData} reservationData - All event, guest, and menu info.
 * @returns {Promise<InsertReservationResponse>}
 */
export const insertReservation = async (
  profileId: number,
  reservationData: ReservationData
): Promise<InsertReservationResponse> => {
  const receiptId = generateUniqueReceiptId();
  const { event, guests,  selectedMenuIds } = reservationData;
  const { event_date, event_time } = convertDateTime(event.eventDate, event.eventTime);

  // 🧾 Step 1: Prepare main reservation data
  const reservationPayload = {
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
    status: 'pending',
  };

  logInfo('📦 Preparing to insert reservation:', reservationPayload);

  // 🪶 Step 2: Insert into `reservations` and get the new reservation ID
  const { data: reservationDataResult, error: reservationError } = await supabase
    .from('reservations')
    .insert([reservationPayload])
    .select('id')
    .single();

  if (reservationError) {
    logError('❌ Reservation insert failed:', reservationError.message);
    throw new Error(reservationError.message);
  }

  const reservationId = reservationDataResult.id;
  logSuccess(`✅ Reservation created with ID: ${reservationId}`);

  if (selectedMenuIds && selectedMenuIds.length > 0) {
    const menuOrders = selectedMenuIds.map((menuId) => ({
      reservation_id: reservationId,
      menu_option_id: menuId,
    }));

    logInfo('🧩 Bulk inserting menu orders:', menuOrders);

    const { error: menuError } = await supabase
      .from('reservation_menu_orders')
      .insert(menuOrders);

    if (menuError) {
      logError('❌ Menu order insert failed:', menuError.message);
      throw new Error(menuError.message);
    }

    logSuccess(`✅ Inserted ${menuOrders.length} menu selections for reservation ${reservationId}`);
  } else {
    logInfo('⚠️ No menu items selected, skipping menu insert.');
  }

  return {
    reservation: reservationDataResult,
    receiptId,
  };
};
