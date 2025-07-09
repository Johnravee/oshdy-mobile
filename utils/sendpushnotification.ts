export async function sendPushNotification(expoPushToken: string) {
    const message = {
      to: expoPushToken,
      sound: 'default',
      title: '🔔 Hello from Expo!',
      body: 'This is a push notification 🎉',
      data: { withSome: 'data' },
    };
  
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
  
    const res = await response.json();
    console.log('📨 Push Response:', res);
  }
  