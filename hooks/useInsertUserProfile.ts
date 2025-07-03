// lib/insertUserProfile.ts or hooks/insertUserProfile.ts (if you prefer)

import { supabase } from '@/lib/supabase';
import { registerForPushNotificationsAsync } from '@/lib/notifications';

export const useInsertUserProfile = async (
  name: string,
  address: string,
  contactNumber: string,
  session: any,
  setProfile: (profile: any) => void
) => {
  const auth_id = session?.user.id;
  const email = session?.user.email;
  const pushToken = await registerForPushNotificationsAsync();

  console.log("Push token", pushToken);
  

  const { data, error } = await supabase
    .from('profiles')
    .upsert(
      {
        auth_id,
        email,
        name,
        address,
        contact_number: contactNumber,
        expo_push_token: pushToken,
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
