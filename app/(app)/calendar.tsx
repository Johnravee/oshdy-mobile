import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import dayjs from 'dayjs';

import BackButton from '@/components/ui/back-button';
import { supabase } from '@/lib/supabase';

export default function Calendar() {
  const [loading, setLoading] = useState(true);
  const [dates, setDates] = useState<
    { date: string; status: 'available' | 'unavailable' }[]
  >([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Generate all days in current year (future only)
  const generateAllDatesInYear = (): string[] => {
    const year = dayjs().year();
    const today = dayjs();
    const dates: string[] = [];

    for (let month = 0; month < 12; month++) {
      const daysInMonth = dayjs(new Date(year, month)).daysInMonth();
      for (let day = 1; day <= daysInMonth; day++) {
        const current = dayjs(new Date(year, month, day));
        if (current.isSame(today, 'day') || current.isAfter(today, 'day')) {
          dates.push(current.format('YYYY-MM-DD'));
        }
      }
    }

    return dates;
  };

  useEffect(() => {
    const fetchData = async () => {
      const start = dayjs().startOf('year').format('YYYY-MM-DD');
      const end = dayjs().endOf('year').format('YYYY-MM-DD');

      const { data, error } = await supabase
        .from('reservations')
        .select('event_date')
        .gte('event_date', start)
        .lte('event_date', end);

      if (error) {
        console.error('Error:', error.message);
        setLoading(false);
        return;
      }

      const dateCounts: Record<string, number> = {};
      data?.forEach(({ event_date }) => {
        const key = dayjs(event_date).format('YYYY-MM-DD');
        dateCounts[key] = (dateCounts[key] || 0) + 1;
      });

      const allDates = generateAllDatesInYear();
      const results = allDates.map((date) => ({
        date,
        status: (dateCounts[date] || 0) >= 2 ? 'unavailable' : 'available',
      }));

      setDates(results as { date: string; status: 'available' | 'unavailable' }[]);
      setLoading(false);
    };

    fetchData();
  }, []);

  // Filtered based on search query
  const filteredDates = dates.filter(({ date }) =>
    dayjs(date)
      .format('MMMM D, YYYY')
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView className="flex-1 bg-background px-5 pt-6">
      <BackButton variant="dark" />

      <View className="mb-4">
        <Text className="text-2xl font-extrabold text-center text-[#4b3f2f]">
          Yearly Event Availability
        </Text>
        <Text className="text-base text-center text-gray-500">
          Browse available and fully booked dates
        </Text>
      </View>

      {/* 🔍 Search Bar */}
      <TextInput
        className="bg-white border border-gray-300 rounded-xl px-4 py-3 mb-4 text-base text-gray-800"
        placeholder="Search date (e.g. August, 2025, 25)"
        placeholderTextColor="#999"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* 📆 Date List */}
      {loading ? (
        <ActivityIndicator size="large" color="#F3C663" className="mt-4" />
      ) : filteredDates.length === 0 ? (
        <Text className="text-center text-gray-500 mt-10">No matching dates.</Text>
      ) : (
        <ScrollView className="space-y-3 mb-10">
          {filteredDates.map(({ date, status }, index) => {
            const isToday = dayjs(date).isSame(dayjs(), 'day');
            return (
              <View
                key={index}
                className={`p-4 rounded-xl shadow-sm border mt-2 ${
                  status === 'unavailable'
                    ? 'bg-red-50 border-red-300'
                    : 'bg-green-50 border-green-300'
                } ${isToday ? 'bg-yellow-50 border-yellow-300' : ''}`}
              >
                <View className="flex-row justify-between items-center">
                  <View>
                    <Text className="text-base font-bold text-gray-800">
                      {dayjs(date).format('MMMM D, YYYY')}
                      {isToday && ' (Today)'}
                    </Text>
                    <Text
                      className={`text-sm mt-1 ${
                        status === 'unavailable'
                          ? 'text-red-600'
                          : 'text-green-600'
                      }`}
                    >
                      {status === 'unavailable'
                        ? 'Fully Booked'
                        : 'Available'}
                    </Text>
                  </View>
                  <FontAwesome5
                    name={
                      status === 'unavailable'
                        ? 'calendar-times'
                        : 'calendar-check'
                    }
                    size={22}
                    color={status === 'unavailable' ? '#DC2626' : '#16A34A'}
                  />
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
