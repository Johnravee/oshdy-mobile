import notifee, { AndroidImportance, TimestampTrigger, TriggerType } from '@notifee/react-native';
import { PermissionsAndroid, Platform } from 'react-native';
import { logInfo, logError } from '@/utils/logger';

let initialized = false;

export async function initLocalNotifications() {
  if (initialized) return;
  try {
    // Request runtime permission on Android 13+ and iOS
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        logError('Local notifications permission denied by system', null);
      }
    }

    if (Platform.OS === 'ios') {
      const settings = await notifee.requestPermission();
      if (!settings.authorizationStatus) {
        logError('iOS local notifications permission not granted', null);
      }
    }

    // Create default channel on Android
    if (Platform.OS === 'android') {
      await notifee.createChannel({
        id: 'default',
        name: 'Default',
        importance: AndroidImportance.HIGH,
        sound: 'default',
      });
    }

    initialized = true;
    logInfo('🔔 Local notifications initialized');
  } catch (e) {
    logError('Failed to initialize local notifications', e);
  }
}

export async function showLocalNotification(opts: {
  title: string;
  body: string;
  androidChannelId?: string;
}) {
  await initLocalNotifications();
  return notifee.displayNotification({
    title: opts.title,
    body: opts.body,
    android: {
      channelId: opts.androidChannelId || 'default',
      importance: AndroidImportance.HIGH,
      sound: 'default',
      pressAction: { id: 'default' },
    },
  });
}

export async function scheduleLocalNotificationAt(date: Date, opts: {
  title: string;
  body: string;
  androidChannelId?: string;
}) {
  await initLocalNotifications();
  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: date.getTime(),
    alarmManager: true,
  };
  return notifee.createTriggerNotification(
    {
      title: opts.title,
      body: opts.body,
      android: {
        channelId: opts.androidChannelId || 'default',
        importance: AndroidImportance.HIGH,
        sound: 'default',
        pressAction: { id: 'default' },
      },
    },
    trigger,
  );
}
