import '../global.css';
import { Slot } from 'expo-router';
import { AuthProvider } from '@/context/AuthContext';
import { useAuth } from '@/hooks/useAuth';
import { ChatMessageProvider } from '@/context/ChatMessageContext';
import { useEffect } from 'react';
import {getMessaging} from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';



function DeepLinkBootstrapper() {
  useAuth(); // ✅ safe to use auth context
  return null;
}

export default function RootLayout() {


  useEffect(() => {

    createNotificationChannel();

    // Foreground notification handling
    const unsubscribe = getMessaging().onMessage(async remoteMessage => {
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

      console.log('Notification received in foreground:', title, body);
    });

    // App opened from background notification
    getMessaging().onNotificationOpenedApp(remoteMessage => {
      console.log('Notification opened from background state:', remoteMessage.notification);
    });

    // App opened from quit state notification
    getMessaging().getInitialNotification().then(remoteMessage => {
      if (remoteMessage) {
        console.log('Notification caused app to open from quit state:', remoteMessage.notification);
      }
    });

    return unsubscribe;
  }, []);



  // Create Android notification channel (called once)
  const createNotificationChannel = async () => {
    await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
      sound: 'default', // Uses system default sound
    });
    console.log('Notification channel created');
  };



  return (
    <AuthProvider>
      <ChatMessageProvider>
        <DeepLinkBootstrapper />
        <Slot />
      </ChatMessageProvider>
    </AuthProvider>
  );
}
