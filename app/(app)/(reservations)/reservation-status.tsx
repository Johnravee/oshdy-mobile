/**
 * @file reservation-status.tsx
 * @route ReservationStatus
 * @description
 * Displays a visual progress tracker and supporting detail modals for a user's active reservation.
 * Handles status updates, contextual info (details, staff, menu), and request limitations based on reservation state.
 *
 * @features
 * - Visual progress stepper for reservation lifecycle
 * - Conditional modal views for event details, staff, menu, and request
 * - Responsive to loading and missing state
 * - Built with hooks for auth and reservation data via Supabase
 *
 * @author John Rave Mimay
 * @created 2025-06-29
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  Pressable,
  ScrollView,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { usePendingReservation } from '@/hooks/usePendingReservation';
import { useAuthContext } from '@/context/AuthContext';
import ProgressStep from '@/components/ui/progress-step';

export default function ReservationStatus() {
  const { profile } = useAuthContext();
  const navigation = useNavigation();

  const [modalVisible, setModalVisible] = useState<null | 'details' | 'staff' | 'menu' | 'request'>(null);

 //Guard
  if (!profile) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#2563EB" />
        <Text className="mt-3 text-blue-600 font-medium">Loading your profile...</Text>
      </SafeAreaView>
    );
  }

  const { pendingReservation, pendingLoading } = usePendingReservation(profile?.id);

  const steps = [
    { label: 'Pending', icon: 'hourglass-half', description: 'Waiting for confirmation' },
    { label: 'Confirmed', icon: 'check-circle', description: 'Reservation confirmed' },
    { label: 'Contract Signing', icon: 'pencil-square-o', description: 'Sign the contract' },
    { label: 'Ongoing', icon: 'play-circle', description: 'Reservation in progress' },
    { label: 'Completed', icon: 'check', description: 'Reservation completed' },
  ];

  const stepMap: Record<string, number> = {
    pending: 0,
    confirmed: 1,
    contract_signing: 2,
    ongoing: 3,
    completed: 4,
  };

  const currentStep = stepMap[pendingReservation?.status || 'pending'];

  //Modal contents
  const renderModalContent = () => {
    if (!pendingReservation) return null;
    const menuItems = pendingReservation.menu ? JSON.parse(pendingReservation.menu) : {};

    const InfoRow = ({ icon, label, value }: { icon: string; label: string; value: string | number }) => (
      <View className="flex-row items-center mb-3">
        <Text className="text-xl mr-3">{icon}</Text>
        <View className="flex-1 bg-blue-50 rounded-md px-3 py-2">
          <Text className="text-sm font-semibold text-blue-800">{label}</Text>
          <Text className="text-base text-blue-900">{value}</Text>
        </View>
      </View>
    );

    switch (modalVisible) {
      case 'details':
        return (
          <ScrollView className="p-6" contentContainerStyle={{ paddingBottom: 40 }}>
            <Text className="text-2xl font-extrabold mb-6 text-blue-700 border-b border-blue-200 pb-2">
              🎉 Event Details
            </Text>
            <InfoRow icon="🎉" label="Celebrant" value={pendingReservation.celebrant} />
            <InfoRow icon="📅" label="Date" value={pendingReservation.event_date} />
            <InfoRow icon="⏰" label="Time" value={pendingReservation.event_time} />
            <InfoRow icon="📍" label="Location" value={pendingReservation.location} />
            <InfoRow icon="🏢" label="Venue" value={pendingReservation.venue} />
            <InfoRow icon="👨‍👩‍👧‍👦" label="Adults" value={pendingReservation.adults_qty} />
            <InfoRow icon="🧒" label="Kids" value={pendingReservation.kids_qty} />
          </ScrollView>
        );

      case 'menu':
        return (
          <ScrollView className="p-6" contentContainerStyle={{ paddingBottom: 40 }}>
            <Text className="text-2xl font-extrabold mb-6 text-green-700 border-b border-green-200 pb-2">
              🍽️ Event Menu
            </Text>
            {Object.entries(menuItems).map(([key, value]) => (
              <View
                key={key}
                className="bg-green-50 rounded-md p-3 mb-3 shadow-sm border border-green-100"
              >
                <Text className="text-base font-semibold text-green-900 capitalize">
                  {key.replace('_', ' ')}
                </Text>
                <Text className="text-sm text-green-800 mt-1">{value as string}</Text>
              </View>
            ))}
          </ScrollView>
        );

      case 'staff':
        return (
          <ScrollView className="p-6" contentContainerStyle={{ paddingBottom: 40 }}>
            <Text className="text-2xl font-extrabold mb-6 text-purple-700 border-b border-purple-200 pb-2">
              👥 Event Staff
            </Text>
            <Text className="text-gray-700 text-base leading-relaxed">
              Assigned staff info coming soon or loaded from another API.
            </Text>
          </ScrollView>
        );

      case 'request':
        return (
          <ScrollView className="p-6" contentContainerStyle={{ paddingBottom: 40 }}>
            <Text className="text-2xl font-extrabold mb-6 text-yellow-700 border-b border-yellow-200 pb-2">
              ✉️ Request
            </Text>
            <Text className="text-gray-700 text-base leading-relaxed">
              You can place your custom requests related to your reservation here.
            </Text>
          </ScrollView>
        );

      default:
        return null;
    }
  };

 

  return (
    <SafeAreaView className="flex-1 bg-white pt-10 px-4">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View className="flex-row items-center mb-6">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="mr-4 rounded-full bg-blue-100 p-2"
          >
            <FontAwesome name="arrow-left" size={20} color="#2563EB" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-800">🎯 Reservation Status</Text>
        </View>

        {/* Greeting */}
        <Text className="text-base text-gray-600 mb-1">
          Hello{profile?.name ? `, ${profile.name}` : ''}! 👋
        </Text>
        <Text className="text-gray-500 mb-4">
          Here's the current status of your event reservation.
        </Text>

        {/* Loading & Content */}
        {pendingLoading ? (
          <View className="flex-1 justify-center items-center mt-10">
            <ActivityIndicator size="large" color="#2563EB" />
            <Text className="mt-2 text-blue-600 font-medium">
              Loading reservation details...
            </Text>
          </View>
        ) : !pendingReservation ? (
          <View className="flex-1 justify-center items-center mt-12">
            <FontAwesome name="calendar-times-o" size={48} color="#CBD5E0" />
            <Text className="mt-4 text-lg text-gray-500 text-center">
              You don’t have any active reservations yet.
            </Text>
          </View>
        ) : (
          <>
            {/* Progress Bar */}
            <View className="bg-blue-50 border border-blue-200 rounded-xl p-6 shadow-sm">
              <ProgressStep steps={steps} activeSteps={currentStep} />
              <View className="mt-4 items-center">
                <Text className="text-sm text-blue-700 bg-blue-100 px-3 py-1 rounded-full font-medium">
                  Current Status: {pendingReservation.status.replace('_', ' ').toUpperCase()}
                </Text>
              </View>
            </View>

            {/* Buttons */}
            <View className="mt-8 flex-row flex-wrap justify-between">
              <TouchableOpacity
                onPress={() => setModalVisible('details')}
                className="w-full bg-white border border-gray-300 rounded-md p-4 mb-4 flex-row items-center justify-center gap-2 shadow"
              >
                <FontAwesome name="info-circle" size={24} color="#2563EB" />
                <Text className="text-blue-600 font-semibold text-lg">Event Details</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setModalVisible('staff')}
                className="w-full bg-white border border-gray-300 rounded-md p-4 mb-4 flex-row items-center justify-center gap-2 shadow"
              >
                <FontAwesome name="users" size={24} color="#2563EB" />
                <Text className="text-blue-600 font-semibold text-lg">Event Staff</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setModalVisible('menu')}
                className="w-full bg-white border border-gray-300 rounded-md p-4 mb-4 flex-row items-center justify-center gap-2 shadow"
              >
                <FontAwesome name="cutlery" size={24} color="#2563EB" />
                <Text className="text-blue-600 font-semibold text-lg">Event Menu</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  if (pendingReservation.status !== 'pending') {
                    setModalVisible('request');
                  }
                }}
                className={`w-full border rounded-md p-4 mb-4 flex-row items-center justify-center gap-2 shadow ${
                  pendingReservation.status === 'pending'
                    ? 'bg-gray-100 border-gray-300'
                    : 'bg-white border-gray-300'
                }`}
                disabled={pendingReservation.status === 'pending'}
              >
                <FontAwesome
                  name="envelope"
                  size={24}
                  color={pendingReservation.status === 'pending' ? '#A0AEC0' : '#2563EB'}
                />
                <Text
                  className={`font-semibold text-lg ${
                    pendingReservation.status === 'pending'
                      ? 'text-gray-400'
                      : 'text-blue-600'
                  }`}
                >
                  Request
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible !== null}
        onRequestClose={() => setModalVisible(null)}
      >
        <View className="flex-1 bg-black bg-opacity-50">
          <View className="flex-1 bg-white">
            <Pressable
              onPress={() => setModalVisible(null)}
              className="absolute top-4 right-4 z-10 p-2"
            >
              <FontAwesome name="close" size={24} color="#333" />
            </Pressable>
            {renderModalContent()}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
