import messaging from '@react-native-firebase/messaging';
import { Alert } from 'react-native';
import { useFcmToken } from '@/hooks/useFcmToken';

export async function requestFCMPermission() {
  const authStatus = await messaging().requestPermission();
    const enabled = 
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      useFcmToken()
      console.log('Notification permission status:', authStatus);
      
    } else {
      Alert.alert('Push Notification permission denied'); 
    }
  };


