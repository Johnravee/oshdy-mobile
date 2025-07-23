import React, { useState } from 'react';
import { View, Text, Switch, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import BackButton from '@/components/ui/back-button';

export default function NotificationSettings() {
  const [fcmEnabled, setFcmEnabled] = useState(true);

  const toggleFcm = (value: boolean) => {
    setFcmEnabled(value);
    // TODO: Save this preference to Supabase or local storage
    Alert.alert(
      'Notification Setting Updated',
      `Push notifications are now ${value ? 'enabled' : 'disabled'}.`
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="px-5 pt-16 pb-10">
        <BackButton variant="dark" />

        <Text className="text-3xl font-extrabold text-primary mb-6">🔔 Push Notification</Text>

        <View className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex-row items-center justify-between">
          <View className="flex-1 pr-4 gap-1">
            <View className="flex-row items-center space-x-2 mb-1 gap-1">
              <FontAwesome name="bell" size={18} color="#22c55e" />
              <Text className="text-base font-semibold text-gray-800">Enable Notifications</Text>
            </View>
            <Text className="text-sm text-gray-600">
              Turn this on to receive reservation updates.
            </Text>
          </View>
          <Switch
            value={fcmEnabled}
            onValueChange={toggleFcm}
            trackColor={{ false: '#d1d5db', true: '#86efac' }}
            thumbColor={fcmEnabled ? '#22c55e' : '#f4f4f5'}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
