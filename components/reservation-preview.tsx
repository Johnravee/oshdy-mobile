import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import { ReservationData } from '../types/reservation';

export default function ReservationPreview({ reservationData }: { reservationData: ReservationData }) {
    
  const renderSection = (
    title: string,
    emoji: string,
    data: { label: string; value: string | number | undefined }[],
  ) => (
    <View className="bg-white rounded-3xl p-6 mb-6 shadow border border-gray-200">
      <Text className="text-xl font-semibold text-indigo-600 mb-4">{`${emoji} ${title}`}</Text>
      {data.map((item, i) => (
        <View
          key={i}
          className={`flex-row justify-between ${i < data.length - 1 ? 'border-b border-gray-100' : ''} py-2`}
        >
          <Text className="text-gray-500">{item.label}</Text>
          <View className="flex-1 items-end">
            <Text className="font-medium text-gray-800 text-right">{item.value || 'N/A'}</Text>
          </View>
        </View>
      ))}
    </View>
  );

  return (
    <ScrollView className="p-4 bg-white">
      <Text className="text-3xl font-extrabold text-center text-gray-700 mb-6">🎉 Reservation Preview</Text>

      {renderSection('Personal Information', '👤', [
        { label: 'Name', value: reservationData.personal.name },
        { label: 'Email', value: reservationData.personal.email },
        { label: 'Contact', value: reservationData.personal.contact },
        { label: 'Address', value: reservationData.personal.address },
      ])}

      {renderSection('Event Details', '📅', [
        { label: 'Celebrant', value: reservationData.event.celebrant },
        { label: 'Package', value: reservationData.event.pkg },
        { label: 'Theme', value: reservationData.event.theme },
        { label: 'Venue', value: reservationData.event.venue },
        { label: 'Date', value: reservationData.event.eventDate },
        { label: 'Time', value: reservationData.event.eventTime },
        { label: 'Location', value: reservationData.event.location },
      ])}

      {renderSection('Guest Details', '👥', [
        { label: 'Total Pax', value: reservationData.guests.pax },
        { label: 'Adults', value: reservationData.guests.adults },
        { label: 'Kids', value: reservationData.guests.kids },
      ])}

      {renderSection('Menu', '🍽️', [
        { label: 'Beef', value: reservationData.menu.beef },
        { label: 'Chicken', value: reservationData.menu.chicken },
        { label: 'Pork', value: reservationData.menu.pork },
        { label: 'Fillet', value: reservationData.menu.fillet },
        { label: 'Vegetable', value: reservationData.menu.vegetable },
        { label: 'Pasta', value: reservationData.menu.pasta },
        { label: 'Dessert', value: reservationData.menu.dessert },
        { label: 'Juice', value: reservationData.menu.juice },
      ])}
    </ScrollView>
  );
}
