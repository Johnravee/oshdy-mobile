/**
 * @file useInsertUserProfile.ts
 * Inserts or updates a user profile in Supabase using the authenticated session.
 */

import { supabase } from '@/lib/supabase';
import messaging from '@react-native-firebase/messaging';
import { logInfo, logSuccess, logError } from '@/utils/logger';

export const InserUserProfile = async (
  name: string,
  address: string,
  contact_number: string,
  session: any,
  setProfile: (profile: any) => void
) => {
  const auth_id = session?.user.id;
  const email = session?.user.email;

  if (!auth_id || !email) {
    logError('❌ Invalid session data. Cannot insert user profile.', null)
    return null;
  }

  const fcm_token = await messaging().getToken();

  const payload = {
    auth_id,
    email,
    name,
    address,
    contact_number,
    fcm_token,
    is_admin: false,
  };

  logInfo('👤 Inserting/updating user profile with payload:', payload);

  const { data, error } = await supabase
    .from('profiles')
    .upsert(payload, { onConflict: 'auth_id' })
    .select()
    .single();

  if (error) {
    logError('❌ Profile insert error:', error.message);
    return null;
  }

  logSuccess(`✅ User profile inserted/updated for ${auth_id}`);
  setProfile(data);
  return data;
};
