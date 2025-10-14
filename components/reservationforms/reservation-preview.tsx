/**
 * @file reservation-preview.tsx
 * @component ReservationPreview
 * @description
 * Read-only summary view of reservation data, showing readable menu names
 * (instead of numeric IDs) by fetching from Supabase `menu_options`.
 *
 * @author
 * John Rave Mimay
 * @updated 2025-10-13
 */

import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, ActivityIndicator } from 'react-native';
import { ReservationData } from '../../types/reservation-types';
import { useProfileContext } from '@/context/ProfileContext';
import { supabase } from '@/lib/supabase';

export default function ReservationPreview({ reservationData }: { reservationData: ReservationData }) {
  const { profile } = useProfileContext();
  const [menuNames, setMenuNames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenus = async () => {
      setLoading(true);

      const { data, error } = await supabase.from('menu_options').select('id, name');
      if (error) {
        console.error('Error loading menu options:', error);
        setLoading(false);
        return;
      }

      //Dictionary for quick lookup
      const map: Record<string, string> = {};
      data?.forEach((item) => {
        map[item.id] = item.name;
      });

      setMenuNames(map);
      setLoading(false);
    };

    fetchMenus();
  }, []);

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

  // Helper to get menu name by ID
  const getMenuName = (id: number | string | undefined) => {
    if (!id) return 'N/A';
    return menuNames[id] || `ID: ${id}`; // fallback if still loading
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center p-6">
        <ActivityIndicator size="large" color="#6366f1" />
        <Text className="text-gray-500 mt-3">Loading menu options...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="p-4 bg-white">
      <Text className="text-3xl font-extrabold text-center text-gray-700 mb-6">🎉 Reservation Preview</Text>

      {renderSection('Personal Information', '👤', [
        { label: 'Name', value: profile?.name },
        { label: 'Email', value: profile?.email },
        { label: 'Contact', value: profile?.contact_number },
        { label: 'Address', value: profile?.address },
      ])}

      {renderSection('Event Details', '📅', [
        { label: 'Celebrant', value: reservationData.event.celebrant },
        { label: 'Package', value: reservationData.event.pkg?.name },
        { label: 'Theme', value: reservationData.event.theme?.name },
        { label: 'Venue', value: reservationData.event.venue },
        { label: 'Date', value: reservationData.event.eventDate },
        { label: 'Time', value: reservationData.event.eventTime },
        { label: 'Grazing Table', value: reservationData.event.grazingTable?.name },
        { label: 'Location', value: reservationData.event.location },
      ])}

      {renderSection('Guest Details', '👥', [
        { label: 'Total Pax', value: reservationData.guests.pax },
        { label: 'Adults', value: reservationData.guests.adults },
        { label: 'Kids', value: reservationData.guests.kids },
      ])}

      {renderSection('Menu', '🍽️', [
        { label: 'Beef', value: getMenuName(reservationData.menu.beef) },
        { label: 'Chicken', value: getMenuName(reservationData.menu.chicken) },
        { label: 'Pork', value: getMenuName(reservationData.menu.pork) },
        { label: 'Fillet', value: getMenuName(reservationData.menu.fillet) },
        { label: 'Vegetable', value: getMenuName(reservationData.menu.vegetable) },
        { label: 'Pasta', value: getMenuName(reservationData.menu.pasta) },
        { label: 'Dessert', value: getMenuName(reservationData.menu.dessert) },
        { label: 'Juice', value: getMenuName(reservationData.menu.juice) },
      ])}
    </ScrollView>
  );
}
