import { supabase } from '@/lib/supabase';
import { logError, logSuccess } from '@/utils/logger';

/**
 * Submit user feedback to the 'feedbacks' table.
 * @param {string} profile_id - User ID
 * @param {string} name - User name
 * @param {string} email - User email
 * @param {string} feedback - Feedback message
 */
export async function insertFeedback(profile_id: number, name: string, email: string, feedback: string, category: string) {
  try {
    const { data, error } = await supabase.from('feedbacks').insert([{ profile_id, name, email, feedback, category }]);
    if (error) return logError('Feedback insert failed:', error);
    logSuccess('Feedback submitted.');
  } catch (err: any) {
    logError('Insert error:', err.message);
  }
}
