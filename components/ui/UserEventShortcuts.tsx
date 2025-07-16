import React from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const actions = [
  {
    label: 'Reserve',
    icon: 'calendar-plus-o',
    backgroundColor: '#E7F9EF',
    iconColor: '#80D1A1',
    path: '/(app)/(reservations)/reservation',
  },
  {
    label: 'History',
    icon: 'history',
    backgroundColor: '#FAEEF1',
    iconColor: '#EDA8BB',
    path: '/(app)/(reservations)/reservation-history',
  },
  {
    label: 'Packages',
    icon: 'gift',
    backgroundColor: '#FDF7E9',
    iconColor: '#F1C76E',
    path: '/(app)/packages',
  },
  {
    label: 'Dates',
    icon: 'search',
    backgroundColor: '#EAF6FB',
    iconColor: '#73C8EE',
    path: '/(app)/calendar',
  },
];

export default function EventActions() {
  const router = useRouter();

  return (
    <View className="w-full px-4 py-4">
      {/* Card Container */}
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
        {/* Section Title */}
        <Text className="text-base font-bold text-gray-800 mb-4">Quick Access</Text>

        {/* Action Buttons */}
        <View className="flex-row justify-between">
          {actions.map((action, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => router.push(action.path as any)}
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
