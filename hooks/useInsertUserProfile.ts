/**
 * @file useInsertUserProfile.ts
 * Inserts or updates a user profile in Supabase using the authenticated session.
 *
 * @param name - User's full name
 * @param address - User's address
 * @param contact_number - User's phone number
 * @param session - Supabase auth session
 * @param setProfile - Callback to update profile state
 *
 * @returns Inserted or updated profile data
 * @throws Supabase error if insertion fails
 */

import { supabase } from '@/lib/supabase';
import messaging from '@react-native-firebase/messaging';

export const useInsertUserProfile = async (
  name: string,
  address: string,
  contact_number: string,
  session: any,
  setProfile: (profile: any) => void
) => {
  const auth_id = session?.user.id;
  const email = session?.user.email;
  const fcm_token = await messaging().getToken();

  

  const { data, error } = await supabase
    .from('profiles')
    .upsert(
      {
        auth_id,
        email,
        name,
        address,
        contact_number,
        fcm_token,
        is_admin: false,
      },
      { onConflict: 'auth_id' }
    )
    .select()
    .single();

  if (error) {
    console.error('Profile insert error:', error);
    throw error;
  }

  setProfile(data);
  return data;
};
