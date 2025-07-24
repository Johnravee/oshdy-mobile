/**
 * @file checkHasProfile.ts
 * @description
 * Checks if a user profile exists in the `profiles` table using the provided auth ID.
 *
 * @param {string} userId - The Supabase Auth user ID
 * @returns {Promise<boolean>} - True if profile exists, otherwise false
 */

import { supabase } from '@/lib/supabase';
import { logError } from '@/utils/logger';

export const checkHasProfile = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('auth_id')
      .eq('auth_id', userId)
      .maybeSingle();

    if (error) throw error;

    return !!data;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    logError('❌ checkHasProfile error:', message);
    return false;
  }
};
