export const sendPushNotification = async (expoPushToken: string, message: string) => {
    const payload = {
      to: expoPushToken,
      sound: 'default',
      title: '📨 New Message',
      body: message,
      data: { type: 'chat' },
    };
  
    try {
      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-Encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();
      console.log('📬 Push API Response:', data);
    } catch (error) {
      console.error('❌ Failed to send push notification:', error);
    }
  };
  