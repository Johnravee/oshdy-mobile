import messaging from '@react-native-firebase/messaging';
import { PermissionsAndroid, Platform } from 'react-native';
import { logError, logInfo } from '@/utils/logger';

export async function requestFCMPermission() {
  try {
    // Android 13+ requires runtime permission
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        {
          title: 'Notification Permission',
          message: 'We need permission to send you push notifications.',
          buttonPositive: 'Allow',
          buttonNegative: 'Deny',
        }
      );

      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        logError('Push Notification permission denied by system', null);
        return;
      }
    }

    // iOS permission prompt
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      logInfo('✅ Notification permission granted:', authStatus);
    } else {
      logError('❌ iOS Push Notification permission denied', null);
    }
  } catch (error) {
    logError('Error requesting notification permission', error);
  }
}
