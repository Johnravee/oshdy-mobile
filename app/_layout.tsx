import '../global.css';
import { Slot } from 'expo-router';
import { useEffect } from 'react';
import { getMessaging } from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';

import { AuthProvider } from '@/context/AuthContext';
import { ProfileProvider } from '@/context/ProfileContext';

import { useAuth } from '@/hooks/useAuth';
import { requestFCMPermission } from '@/lib/requestFCMPermission';
import { initLocalNotifications } from '@/lib/notifications/local';
import { logInfo, logSuccess } from '@/utils/logger';
import SplashScreenOverlay from '@/components/ui/splash-screen';
import React, { useState } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import { useProfileContext } from '@/context/ProfileContext';
import { startReservationStatusListener } from '@/lib/realtime/reservation-status-listener';


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
  const [showSplash, setShowSplash] = useState(true);


  useEffect(() => {
  // Initialize push & local notification capability globally
  createNotificationChannel();
  requestFCMPermission();
  initLocalNotifications();


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
          <SplashGate onDone={() => setShowSplash(false)} />
          <SplashScreenOverlay visible={showSplash} />
          <RealtimeGate />
          <Slot />
      </ProfileProvider>
    </AuthProvider>
  );
}

// Small helper that uses contexts (must be inside providers) to determine when app is ready
function SplashGate({ onDone }: { onDone: () => void }) {
  const { init } = useAuthContext();
  const { profileLoading } = useProfileContext();
  useEffect(() => {
    if (!init && !profileLoading) {
      // Delay slightly to allow first screen mount before hiding overlay
      const t = setTimeout(onDone, 400);
      return () => clearTimeout(t);
    }
  }, [init, profileLoading]);
  return null;
}

// Start realtime notifications globally once profile is available
function RealtimeGate() {
  const { profile } = useProfileContext();
  useEffect(() => {
    if (profile?.id) {
      startReservationStatusListener(profile.id);
    }
  }, [profile?.id]);
  return null;
}
