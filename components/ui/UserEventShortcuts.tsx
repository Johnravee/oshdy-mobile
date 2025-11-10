import React from 'react';
import { View, Text, TouchableOpacity, Platform, Linking, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const actions = [
  {
    label: 'Reserve',
    icon: 'calendar-plus-o',
    backgroundColor: '#E7F9EF',
    iconColor: '#80D1A1',
    path: '/(app)/(reservations)/reservation',
    isExternal: false,
  },
  {
    label: 'History',
    icon: 'history',
    backgroundColor: '#FAEEF1',
    iconColor: '#EDA8BB',
    path: '/(app)/(reservations)/reservation-history',
    isExternal: false,
  },
  {
    label: 'Dates',
    icon: 'search',
    backgroundColor: '#EAF6FB',
    iconColor: '#73C8EE',
    path: '/(app)/calendar',
    isExternal: false,
  },
  {
    label: 'Website',
    icon: 'external-link',
    backgroundColor: '#FDF7E9',
    iconColor: '#F1C76E',
    path: 'https://oshdywebsite.vercel.app/',
    isExternal: true,
  },
];

export default function EventActions() {
  const router = useRouter();

  const handlePress = (action: (typeof actions)[0]) => {
    if (action.isExternal) {
      Linking.openURL(action.path).catch(() =>
        Alert.alert('Failed to open link', 'Please try again later.')
      );
    } else {
      router.push(action.path as any);
    }
  };

  return (
    <View className="w-full px-4 py-4">
      <View
        className="rounded-2xl bg-white p-4"
        style={{
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 6,
            },
            android: {
              elevation: 5,
            },
          }),
        }}
      >
        <Text className="text-base font-bold text-gray-800 mb-4">Quick Access</Text>

        <View className="flex-row justify-between">
          {actions.map((action, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handlePress(action)}
              className="w-[22%] aspect-square rounded-xl items-center justify-center"
              style={{
                backgroundColor: action.backgroundColor,
              }}
            >
              <FontAwesome
                name={action.icon as any}
                size={22}
                color={action.iconColor}
              />
              <Text
                className="text-xs font-semibold text-center mt-2"
                style={{ color: action.iconColor }}
              >
                {action.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}
