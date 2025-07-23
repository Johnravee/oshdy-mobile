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
import { logError, logInfo, logSuccess } from '@/utils/logger';

export function useFcmToken() {
  const { profile } = useProfileContext();
  const [hasSavedToken, setHasSavedToken] = useState(false);

  useEffect(() => {
    const saveToken = async () => {
      try {
        const fcmToken = await messaging().getToken();
        logInfo('🔐 Retrieved FCM token:', fcmToken);

        if (fcmToken && profile?.id) {
          const { error } = await supabase
            .from('profiles')
            .update({ fcm_token: fcmToken })
            .eq('profile_id', profile.id);

          if (!error) {
            logSuccess('✅ FCM token saved to Supabase');
            setHasSavedToken(true);
          } else {
            logError('❌ Failed to save FCM token to Supabase:', error.message);
          }
        } else {
          logInfo('⚠️ No FCM token or profile ID available');
        }
      } catch (error: any) {
        logError('💥 Error getting FCM token:', error.message);
      }
    };

    const requestPermission = async () => {
      try {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        logInfo(`🔔 Notification permission status: ${authStatus}`);

        if (enabled && !hasSavedToken) {
          await saveToken();
        }
      } catch (error: any) {
        logError('🚫 Failed to request notification permission:', error.message);
      }
    };

    requestPermission();
  }, [profile]);

  return { hasSavedToken };
}
