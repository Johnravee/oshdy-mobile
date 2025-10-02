import '../global.css';
import { Slot } from 'expo-router';
import { useEffect } from 'react';
import { getMessaging } from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';

import { AuthProvider } from '@/context/AuthContext';
import { ProfileProvider } from '@/context/ProfileContext';

import { useAuth } from '@/hooks/useAuth';
import { requestFCMPermission } from '@/lib/requestFCMPermission';
import { logError, logInfo, logSuccess } from '@/utils/logger';


/**
 * Initializes the useAuth hook to ensure session is ready
 * Useful for deep linking or early auth access in layouts.
 */
function DeepLinkBootstrapper() {
  useAuth();
  return null;
}

/**
 * Sets up root-level context providers and handles push notifications.
 */
export default function RootLayout() {



  useEffect(() => {
    // Initialize FCM & Notifee notification channel
    createNotificationChannel();
    requestFCMPermission();


    // Handle foreground messages
    const unsubscribe = getMessaging().onMessage(async (remoteMessage) => {
      const { title, body } = remoteMessage.notification || {};

      await notifee.displayNotification({
        title: title || '📩 New Message',
        body: body || '',
        android: {
          channelId: 'default',
          importance: AndroidImportance.HIGH,
          sound: 'default',
        },
      });

        logInfo('🔔 Foreground Notification');
    });

    // Background state notification handler
    getMessaging().onNotificationOpenedApp((remoteMessage) => {
      logInfo('📲 Opened from background:', remoteMessage.notification);
    });

    // Quit state notification handler
    getMessaging().getInitialNotification().then((remoteMessage) => {
      if (remoteMessage) {
        logInfo('🚀 Opened from quit state:', remoteMessage.notification);
      }
    });

    return unsubscribe;
  }, []);

  /**
   * Creates a default notification channel for Android.
   * Required for showing notifications with sound.
   */
  const createNotificationChannel = async () => {
    await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
      sound: 'default',
    });
    logSuccess(' Notification channel created');
  };

  return (
    <AuthProvider>
    <ProfileProvider>
          <DeepLinkBootstrapper />
          <Slot />
      </ProfileProvider>
    </AuthProvider>
  );
}
