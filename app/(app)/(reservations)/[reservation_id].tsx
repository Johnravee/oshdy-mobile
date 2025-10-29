/**
 * @file reservation-status.tsx
 * @route ReservationStatus
 * @description
 * Visual tracker for a user's active reservation with detail modals.
 *
 * @features
 * - Stepper UI for reservation lifecycle
 * - Modals for event, staff, menu, and requests
 * - Handles loading, empty, and Supabase-driven states
 *
 * @author John Rave Mimay
 * @created 2025-06-29
 */

import React, { useState } from 'react';
import AnimatedModal from '@/components/ui/animatedModal';
import successAnim from '@/assets/images/lottie/success.json';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  ScrollView,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import VerticalProgressStep from '@/components/ui/vertical-progressStep';
import { useLocalSearchParams } from 'expo-router';
import Spinner from '@/components/ui/spinner';
import { useUserFetchReservationWithJoins } from '@/hooks/useUserFetchResevationWithJoins';
import BackButton from '@/components/ui/back-button';
import { updateReservationStatusById } from '@/lib/api/updateReservationStatusById';
import MenuDetailsForm from '@/components/reservationforms/menu-details';
import { updateReservationMenu } from '@/lib/api/updateReservationMenu';
import { getAssignedWorkersByReservationId } from '@/lib/api/getAssignedWorkersByReservationId';



export default function ReservationStatus() {
  const { reservation_id } = useLocalSearchParams<{ reservation_id?: string }>();
  const [modalVisible, setModalVisible] = useState<null | 'details' | 'staff' | 'menu' | 'request' | 'editMenu'>(null);
  const [editMenuState, setEditMenuState] = useState<any>(null);
  const [savingMenu, setSavingMenu] = useState(false);
  const [assignedWorkers, setAssignedWorkers] = useState<any[]>([]);
  const [loadingWorkers, setLoadingWorkers] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  if (!reservation_id) return <Spinner />;

  const parseId = parseInt(reservation_id);
  const { reservations, isFetching } = useUserFetchReservationWithJoins(parseId);
  const pendingReservation = reservations && reservations.length > 0 ? reservations[0] : null;
  const pendingLoading = isFetching;

  // Steps excluding "Canceled"
  const steps = [
    { label: 'Pending', icon: 'hourglass-half', description: 'Waiting for confirmation' },
    { label: 'Confirmed', icon: 'check-circle', description: 'Reservation confirmed' },
    { label: 'Contract Signing', icon: 'pencil-square-o', description: 'Sign the contract' },
    { label: 'Completed', icon: 'check', description: 'Reservation completed' },
    { label: 'Done', icon: 'check-circle', description: 'All tasks finalized' },
  ];

  const stepMap: Record<string, number> = {
    pending: 0,
    confirmed: 1,
    contract_signing: 2,
    completed: 3,
    done: 4,
  };

  const rawStatus = pendingReservation?.status ?? 'pending';
  const normalizedStatus = (() => {
    const s = String(rawStatus).trim().toLowerCase();
    // Handle DB variant without underscore
    if (s === 'contractsigning') return 'contract_signing';
    return s.replace(/\s+/g, '_');
  })();
  const currentStep = stepMap[normalizedStatus] ?? 0;
  const isCanceled = normalizedStatus === 'canceled';

  const renderModalContent = () => {
    if (!pendingReservation) return null;

    const menuItems = pendingReservation.menu ? JSON.parse(pendingReservation.menu) : {};

    const InfoRow = ({ icon, label, value }: { icon: string; label: string; value: string | number }) => (
      <View className="flex-row items-center mb-3">
        <Text className="text-xl mr-3">{icon}</Text>
        <View className="flex-1 bg-blue-50 rounded-md px-3 py-2">
          <Text className="text-sm font-semibold text-secondary">{label}</Text>
          <Text className="text-base text-secondary">{value}</Text>
        </View>
      </View>
    );

    switch (modalVisible) {
      case 'details':
        return (
          <ScrollView className="p-6">
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
        // Only allow edit for these statuses
        const canEditMenu = [
          'pending',
          'confirmed',
          'contract_signing',
          'contractsigning',
          'completed',
        ].includes(normalizedStatus);
        return (
          <ScrollView className="p-6">
            <Text className="text-2xl font-extrabold mb-6 text-green-700 border-b border-green-200 pb-2">
              🍽️ Event Menu
            </Text>

            {!pendingReservation.reservation_menu_orders ||
            pendingReservation.reservation_menu_orders.length === 0 ? (
              <Text className="text-gray-500 text-center mt-6">
                No menu selected for this reservation.
              </Text>
            ) : (
              pendingReservation.reservation_menu_orders.map((order) => (
                <View
                  key={order.id}
                  className="bg-green-50 rounded-md p-3 mb-3 shadow-sm border border-green-100"
                >
                  <Text className="text-base font-semibold text-green-900 capitalize">
                    {order.menu_options?.category}
                  </Text>
                  <Text className="text-sm text-green-800 mt-1">
                    {order.menu_options?.name}
                  </Text>
                </View>
              ))
            )}
            <TouchableOpacity
              className={`mt-4 rounded-md py-3 px-4 items-center ${canEditMenu ? 'bg-blue-600' : 'bg-gray-300'}`}
              disabled={!canEditMenu}
              onPress={() => {
                if (!canEditMenu) return;
                // Build initial state from current menu selection
                const menuSelection: any = {};
                if (pendingReservation.reservation_menu_orders) {
                  pendingReservation.reservation_menu_orders.forEach((order) => {
                    if (order.menu_options?.category && order.menu_options?.id) {
                      // Lowercase and match keys to MenuDetailsForm
                      const key = order.menu_options.category.toLowerCase();
                      menuSelection[key] = String(order.menu_options.id);
                    }
                  });
                }
                setEditMenuState({
                  menu: menuSelection,
                  selectedMenuIds: Object.values(menuSelection).map(Number),
                });
                setModalVisible('editMenu');
              }}
            >
              <Text className="text-white font-bold">Edit Menu</Text>
            </TouchableOpacity>
            {!canEditMenu && (
              <Text className="text-xs text-gray-500 mt-2 text-center">Menu can only be edited if status is Pending, Confirmed, Contract Signing, or Completed.</Text>
            )}
          </ScrollView>
        );

      case 'editMenu':
        // Only allow edit if canEditMenu
        if (![
          'pending',
          'confirmed',
          'contract_signing',
          'contractsigning',
          'completed',
        ].includes(normalizedStatus)) {
          setModalVisible('menu');
          return null;
        }
        return (
          <View className="flex-1 p-6">
            <Text className="text-2xl font-extrabold mb-6 text-blue-700 border-b border-blue-200 pb-2">
              ✏️ Edit Event Menu
            </Text>
            <MenuDetailsForm
              data={editMenuState?.menu || {}}
              setReservationData={(updater) => {
                setEditMenuState((prev : any) => {
                  if (typeof updater === 'function') {
                    return updater(prev);
                  }
                  return updater;
                });
              }}
            />
            <TouchableOpacity
              className="mt-6 bg-green-600 rounded-md py-3 px-4 items-center"
              disabled={savingMenu}
              onPress={async () => {
                setSavingMenu(true);
                const menuIds = editMenuState?.selectedMenuIds?.filter(Boolean) || [];
                const { error } = await updateReservationMenu(parseId, menuIds);
                setSavingMenu(false);
                if (!error) {
                  setShowSuccessModal(true);
                } else {
                  alert('Failed to update menu. Please try again.');
                }
              }}
            >
              <Text className="text-white font-bold">{savingMenu ? 'Saving...' : 'Save Menu'}</Text>
            </TouchableOpacity>
      {/* Success Modal */}
      <AnimatedModal
        visible={showSuccessModal}
        title="Menu Updated!"
        description="Your reservation menu was updated successfully."
        animation={successAnim}
        buttonText="OK"
        onButtonPress={() => {
          setShowSuccessModal(false);
          setModalVisible(null);
        }}
      />
            <TouchableOpacity
              className="mt-3 bg-gray-200 rounded-md py-2 px-4 items-center"
              onPress={() => setModalVisible('menu')}
            >
              <Text className="text-gray-700 font-semibold">Cancel</Text>
            </TouchableOpacity>
          </View>
        );

     case 'staff':
  return (
    <ScrollView className="p-6">
      <Text className="text-2xl font-extrabold mb-6 text-purple-700 border-b border-purple-200 pb-2">
        👥 Event Staff
      </Text>

      {loadingWorkers ? (
        <Spinner />
      ) : assignedWorkers.length === 0 ? (
        <Text className="text-dark text-base">No staff assigned yet.</Text>
      ) : (
        assignedWorkers.map((assignment) => (
          <View
            key={assignment.id}
            className="bg-purple-50 rounded-md p-4 mb-3 border border-purple-100 shadow-sm"
          >
            <Text className="text-lg font-bold text-purple-900">
              {assignment.workers?.name}
            </Text>
            <Text className="text-sm text-purple-800">Role: {assignment.workers?.role}</Text>
            <Text className="text-sm text-purple-800">Contact: {assignment.workers?.contact}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );

      default:
        return null;
    }
  };


  const fetchAssignedWorkers = async () => {
  try {
    setLoadingWorkers(true);
    const workers = await getAssignedWorkersByReservationId(parseId);
    setAssignedWorkers(workers);
  } catch (err) {
    console.error('Failed to load assigned workers:', err);
  } finally {
    setLoadingWorkers(false);
  }
};


  return (
    <SafeAreaView className="flex-1 bg-white pt-10 px-4">
      <ScrollView showsVerticalScrollIndicator={false}>
        <BackButton variant="dark" />
        <Text className="text-gray-500 mb-4">
          Here's the current status of your event reservation.
        </Text>

        {pendingLoading ? (
          <Spinner />
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
            <View
              className={`rounded-xl p-6 shadow-sm border ${
                isCanceled ? 'bg-red-50 border-red-200' : 'bg-white border-blue-200'
              }`}
            >
              {!isCanceled ? (
                <VerticalProgressStep steps={steps} activeSteps={currentStep} />
              ) : (
                <View className="items-center">
                  <FontAwesome name="times-circle" size={48} color="#DC2626" />
                  <Text className="mt-4 text-xl font-bold text-red-600">Reservation Canceled</Text>
                </View>
              )}
              <View className="mt-4 items-center">
                <Text
                  className={`text-sm px-3 py-1 rounded-full font-medium ${
                    isCanceled
                      ? 'bg-red-100 text-red-600'
                      : 'bg-blue-100 text-secondary'
                  }`}
                >
                  Current Status: {normalizedStatus.replace(/_/g, ' ').toUpperCase()}
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
                <Text className="text-secondary font-semibold text-lg">Event Details</Text>
              </TouchableOpacity>

              

              <TouchableOpacity
                onPress={() => setModalVisible('menu')}
                className="w-full bg-white border border-gray-300 rounded-md p-4 mb-4 flex-row items-center justify-center gap-2 shadow"
              >
                <FontAwesome name="cutlery" size={24} color="#2563EB" />
                <Text className="text-secondary font-semibold text-lg">Event Menu</Text>
              </TouchableOpacity>


              <TouchableOpacity
                 onPress={() => {
                  setModalVisible('staff');
                  fetchAssignedWorkers(); 
                }}
                 className={`w-full border rounded-md p-4 mb-4 flex-row items-center justify-center gap-2 shadow ${
                  normalizedStatus === 'pending'
                  ? 'bg-gray-100 border-gray-300'
                  : 'bg-white border-red-300'
                }`}
                disabled={normalizedStatus === 'pending'}
              >
                <FontAwesome name="users" size={24} color="#2563EB" />
                <Text className="text-secondary font-semibold text-lg">Event Staff</Text>
              </TouchableOpacity>
           

              {/* Cancel button */}
              <TouchableOpacity
                onPress={() => updateReservationStatusById(reservation_id, 'canceled')}
                className={`w-full border rounded-md p-4 mb-4 flex-row items-center justify-center gap-2 shadow ${
                  normalizedStatus === 'pending'
                    ? 'bg-white border-red-300'
                    : 'bg-gray-100 border-gray-300'
                }`}
                disabled={normalizedStatus !== 'pending'}
              >
                <FontAwesome
                  name="times-circle"
                  size={24}
                  color={normalizedStatus === 'pending' ? '#DC2626' : '#A0AEC0'}
                />
                <Text
                  className={`font-semibold text-lg ${
                    normalizedStatus === 'pending' ? 'text-red-600' : 'text-gray-400'
                  }`}
                >
                  Cancel
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
        <View className="flex-1 bg-dark bg-opacity-50">
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
