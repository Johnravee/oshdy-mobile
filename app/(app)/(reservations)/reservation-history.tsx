/**
 * @file reservation-history.tsx
 * @component ReservationHistory
 * @description
 * Displays a searchable and filterable list of user reservations.
 * Users can filter by status tabs, search by package or celebrant,
 * and navigate back to the previous screen.
 *
 * @features
 * - Fetches reservations using a custom hook
 * - Filter by multiple statuses with emoji indicators
 * - Search functionality for package names and celebrants
 * - Displays loading and error states
 * - Back navigation button included
 *
 * @author John Rave Mimay
 * @created 2025-07-02
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  FlatList,
  ActivityIndicator,
  Pressable
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useFetchUserReservations, Reservation } from '@/hooks/useFetchReservations';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Spinner from '@/components/ui/spinner';

const STATUSES = ['all', 'pending', 'confirmed', 'contract signing', 'ongoing', 'completed', 'revoked'];
const STATUS_EMOJIS = ['🗂️', '⏳', '✅', '📝', '🔄', '🏁', '❌'];



export default function ReservationHistory() {
  const navigation = useNavigation();
  const { reservations, isFetching, error, refetch } = useFetchUserReservations();

  const [selectedStatus, setSelectedStatus] = useState<string>(STATUSES[0]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredByStatus = useMemo(() => {
    if (selectedStatus.toLowerCase() === 'all') {
      return reservations;
    }

    return reservations.filter(
      (res) => res.status?.toLowerCase() === selectedStatus.toLowerCase()
    );
  }, [reservations, selectedStatus]);

  const filteredReservations = useMemo(() => {
    if (!searchTerm.trim()) return filteredByStatus;

    const lowerSearch = searchTerm.toLowerCase();

    return filteredByStatus.filter((res) => {
      const packageStr = String(res.packages?.name || '').toLowerCase();
      const celebrantStr = res.celebrant?.toLowerCase() || '';
      return packageStr.includes(lowerSearch) || celebrantStr.includes(lowerSearch);
    });
  }, [filteredByStatus, searchTerm]);

  const onPressReservation = (reservation: Reservation) => {
    alert(`Go to details for receipt: ${reservation.receipt_number}`);
  };

  if (isFetching) {
    return <Spinner />
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-white px-4">
        <Text className="text-center text-red-600 font-semibold">
          Something went wrong: {error}
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white px-4 pt-4">
      {/* Back Button */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        className="flex-row items-center mb-4"
      >
        <FontAwesome name="arrow-left" size={20} color="#374151" />
        <Text className="ml-2 text-gray-700 text-base">Back</Text>
      </TouchableOpacity>

      {/* Search Bar */}
      <View className="flex-row items-center border border-gray-300 rounded-lg px-3 py-2 mb-4 bg-gray-50">
        <FontAwesome name="search" size={18} color="#6B7280" />
        <TextInput
          className="ml-2 flex-1 text-base"
          placeholder="Search by package or celebrant"
          value={searchTerm}
          onChangeText={setSearchTerm}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      {/* Status Tabs */}
      <View className="flex justify-evenly items-center w-100 flex-row mt-4 mb-4">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex gap-2 w-100">
          {STATUSES.map((status, index) => (
            <Pressable
              key={status}
              onPress={() => setSelectedStatus(status)}
              className={`border border-gray-300 px-5 ${
                selectedStatus === status ? 'bg-white' : 'bg-dark'
              } rounded-md p-2 m-2`}
            >
              <Text
                className={`text-sm font-medium ${
                  selectedStatus === status ? 'text-dark' : 'text-white'
                }`}
              >
                {STATUS_EMOJIS[index]} {status.charAt(0).toUpperCase() + status.slice(1)}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Reservation List */}
      <FlatList
        data={filteredReservations}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="items-center mt-16">
            <Text className="text-gray-500 text-center">
              No {selectedStatus === 'all' ? '' : selectedStatus} reservations found.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            className="flex-row justify-between items-center p-4 bg-gray-50 rounded-lg mb-3 border border-gray-200"
            onPress={() => onPressReservation(item)}
          >
            <View className="flex-1 pr-2">
              <Text className="text-base font-semibold text-gray-800 mb-1">
                Package: {item.packages?.name || 'N/A'}
              </Text>
              <Text className="text-sm text-gray-600">
                Receipt #: {item.receipt_number}
              </Text>
              <Text className="text-sm text-gray-700 mt-1">
                Celebrant: {item.celebrant}
              </Text>

              {/* Status Badge */}
              <View
                className={`mt-2 self-start rounded-full px-3 py-1 shadow-sm
                  ${
                    item.status?.toLowerCase() === 'pending' ? 'bg-yellow-200' :
                    item.status?.toLowerCase() === 'confirmed' ? 'bg-blue-200' :
                    item.status?.toLowerCase() === 'contract signing' ? 'bg-purple-200' :
                    item.status?.toLowerCase() === 'ongoing' ? 'bg-orange-200' :
                    item.status?.toLowerCase() === 'completed' ? 'bg-green-200' :
                    item.status?.toLowerCase() === 'revoked' ? 'bg-red-200' :
                    'bg-gray-300'
                  }`}
              >
                <Text
                  className={`text-xs font-medium
                    ${
                      item.status?.toLowerCase() === 'pending' ? 'text-yellow-900' :
                      item.status?.toLowerCase() === 'confirmed' ? 'text-blue-900' :
                      item.status?.toLowerCase() === 'contract signing' ? 'text-purple-900' :
                      item.status?.toLowerCase() === 'ongoing' ? 'text-orange-900' :
                      item.status?.toLowerCase() === 'completed' ? 'text-green-900' :
                      item.status?.toLowerCase() === 'revoked' ? 'text-red-900' :
                      'text-gray-800'
                    }`}
                >
                  {item.status?.charAt(0).toUpperCase() + item.status?.slice(1)}
                </Text>
              </View>
            </View>
            <Text className="text-gray-400 text-xl">{'›'}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}
