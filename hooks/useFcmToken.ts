/**
 * @file useFcmToken.ts
 * Saves the Firebase Cloud Messaging (FCM) token to Supabase for the logged-in user.
 *
 * @returns hasSavedToken - Whether the token was successfully saved.
 */

import { useEffect, useState } from 'react';
import messaging from '@react-native-firebase/messaging';
import { supabase } from '@/lib/supabase';
import { useProfileContext } from '@/context/ProfileContext';

export function useFcmToken() {
  const { profile } = useProfileContext();
  const [hasSavedToken, setHasSavedToken] = useState(false);

  useEffect(() => {
    const saveToken = async () => {
      try {
        const fcmToken = await messaging().getToken();
        if (fcmToken && profile?.id) {
          const { error } = await supabase
            .from('profiles')
            .update({ fcm_token: fcmToken })
            .eq('profile_id', profile.id);

          if (!error) {
            console.log('✅ FCM token saved');
            setHasSavedToken(true);
          }
        }
      } catch (error) {
        console.error('❌ Error getting FCM token:', error);
      }
    };

    const requestPermission = async () => {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled && !hasSavedToken) {
        await saveToken();
      }
    };

    requestPermission();
  }, [profile]);

  return { hasSavedToken };
}
