import { supabase } from '@/lib/supabase';
import messaging from '@react-native-firebase/messaging';
import { requestFCMPermission } from '@/lib/requestFCMPermission';

const getFcmToken = async (): Promise<string | null> => {
  try {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      console.log('FCM Token:', fcmToken);
      return fcmToken;
    } else {
      console.log('Failed to get FCM token');
      return null;
    }
  } catch (error) {
    console.error('Error fetching FCM token:', error);
    return null;
  }
};

export const saveFcmTokenToSupabase = async (userId: number) => {
  const fcm_token = await getFcmToken();

  console.log('🔔 Saving FCM token to Supabase for user:', userId, fcm_token);
  if (!fcm_token) {
    console.warn('No FCM token to save.');
    return;
  }

  const { data, error } = await supabase
    .from('profiles')
    .update({ fcm_token })      // ✅ Only update fcm_token
    .eq('id', userId);          // ✅ Use id as WHERE condition

  if (error) {
    console.error('Failed to update FCM token:', error.message);
  } else {
    console.log('✅ FCM token updated in Supabase:', data);
  }
};
