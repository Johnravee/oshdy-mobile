import { supabase } from '@/lib/supabase';

export async function getAssignedWorkersByReservationId(reservationId: number) {
  const { data, error } = await supabase
    .from('scheduling')
    .select(`
      id,
      worker_id,
      created_at,
      workers (
        id,
        name,
        role,
        contact
      )
    `)
    .eq('reservation_id', reservationId);

  if (error) {
    console.error('Error fetching workers:', error);
    throw new Error(error.message);
  }

  return data;
}
