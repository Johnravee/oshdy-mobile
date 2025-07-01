/**
 * @file Reservation.tsx
 * @component Reservation
 * @description
 * A clean, modular multi-step reservation form using `react-native-progress-steps`. 
 * Handles event, guest, and menu input, previews the reservation, and submits via Supabase.
 *
 * @features
 * - Per-step validation
 * - Prevents duplicate pending reservations
 * - Displays real-time feedback via modals and Lottie animations
 * - Uses Supabase for data insertion
 *
 * @author John Rave Mimay
 * @created 2025-06-15
 */


import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Alert, Modal } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';
import { Link, router } from 'expo-router';
import LottieView from 'lottie-react-native';

// Contexts & Hooks
import { useAuthContext } from '@/context/AuthContext';
import { useInsertReservation } from '@/hooks/useInsertReservation';
import { usePendingReservation } from '@/hooks/usePendingReservation';  

// Components
import Spinner from '@/components/ui/spinner';
import CustomModal from '@/components/ui/custom-modal';
import EventDetailsForm from '@/components/reservationforms/event-details';
import GuestDetailsForm from '@/components/reservationforms/guest-details';
import MenuDetailsForm from '@/components/reservationforms/menu-details';
import ReservationPreview from '@/components/reservationforms/reservation-preview';

// Types
import { ReservationData } from '@/types/reservation-types';


const initialReservationData: ReservationData = {
  event: {receiptId: '', celebrant: '', pkg: {id: 0, name: ''}, theme: {id: 0, name: ''}, venue: '', eventDate: '', eventTime: '', grazingTable: {id: 0, name: ''} , location: '' },
  guests: { pax: '', adults: '', kids: '' },
  menu: { beef: '', chicken: '', vegetable: '', pork: '', pasta: '', fillet: '', dessert: '', juice: '' },
};

export default function Reservation() {
  const { init, profile } = useAuthContext();
  const [reservationData, setReservationData] = useState<ReservationData>(initialReservationData);
  const [modalVisible, setModalVisible] = useState(false);
  const [showPendingModal, setShowPendingModal] = useState(false);

  
  
  if (!profile?.id) {
    return <Spinner />; 
  }
  
  
  const { insertReservation, loading, error: insertError, success } = useInsertReservation();
  const { pendingReservation, pendingLoading, error } = usePendingReservation(profile.id);




  

  const [stepErrors, setStepErrors] = useState({
    personal: false,
    event: false,
    guests: false,
  });


 
  
  const validateEventDetails = () => {
    const { venue, pkg, theme, eventDate, eventTime, location } = reservationData.event;
    const hasError = !venue || !pkg || !theme || !eventDate || !eventTime || !location;
    setStepErrors(prev => ({ ...prev, event: hasError }));
    if (hasError) {
      Alert.alert('Missing Info', 'Please complete all event detail fields.');
      return false;
    }
    return true;
  };

  const validateGuestDetails = () => {
    const { pax, adults, kids } = reservationData.guests;
    const totalGuests = parseInt(adults || '0') + parseInt(kids || '0');
    const hasError = !pax || !adults || !kids || totalGuests > parseInt(pax || '0');
    setStepErrors(prev => ({ ...prev, guests: hasError }));

    if (!pax || !adults || !kids) {
      Alert.alert('Missing Info', 'Please complete all guest fields.');
      return false;
    }

    if (totalGuests > parseInt(pax)) {
      Alert.alert('Invalid Guest Count', 'Adults and kids exceed the total number of guests (Pax).');
      return false;
    }

    return true;
  };

  const handleReservationSubmit = async () => {
    const result = await insertReservation(reservationData);
    if (result) {
      setModalVisible(true);

    }
  };

useEffect(() => {
  if (pendingReservation) {
    setShowPendingModal(true);
  }
}, [pendingReservation]);


  useEffect(() => {
    if (success && modalVisible) {
      const timer = setTimeout(() => {
        router.replace('/(app)/(reservations)/reservation-history');
      }, 10000);
      return () => clearTimeout(timer); 
    }
  }, [success, modalVisible]);

 


  if (init || pendingLoading) return <Spinner />;

  return (
    <View className="flex-1 bg-white">
   
        {/* Loading Spinner */}
        {loading && <Spinner />}

        {/* Success Modal */}
        <CustomModal visible={modalVisible} onClose={() => setModalVisible(false)}>
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="bg-white rounded-2xl p-5 w-11/12 items-center">
              <Pressable onPress={() => setModalVisible(false)} className="absolute top-2 right-2 p-2">
                <FontAwesome name="close" size={20} color="#333" />
              </Pressable>
              <LottieView
                source={require('../../../assets/images/lottie/success.json')}
                autoPlay
                loop={false}
                style={{ width: 150, height: 150 }}
              />
              <Text className="text-2xl font-bold mt-2 mb-4 text-dark text-center">🎉 Reservation Submitted!</Text>
              <Text className="text-base text-gray-600 mb-5 text-center">
                Thank you for booking with OSHDY Catering Services.
                We’ll contact you shortly with confirmation.
              </Text>
              <View className="my-4 border-t border-gray-300 w-full" />
              <Text className="text-base text-gray-600 text-center mb-2">
               You will be redirected to the event status soon...
              </Text>
              <Text className="text-base text-gray-600 text-center">
                Need to make changes? Contact our team or wait for the confirmation email.
              </Text>
            </View>
          </View>
        </CustomModal>
        
      {/* Reservation Modal */}
      <Modal visible={showPendingModal} transparent animationType="fade">
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white rounded-2xl p-5 w-11/12 items-center">
          <LottieView
            source={require('../../../assets/images/lottie/warning.json')}
            autoPlay
            loop={false}
            style={{ width: 150, height: 150 }}
          />

          <Text className="text-2xl font-bold mt-4 mb-2 text-center text-yellow-600">
            Reservation Already in Progress
          </Text>

          <Text className="text-base text-gray-600 mb-5 text-center">
            You already have a pending reservation in process.
            Please wait for confirmation before submitting another.
          </Text>

          <Pressable
            onPress={() => {
              setShowPendingModal(false);
              router.replace('/(app)/(reservations)/reservation-history');
            }}
            className="mt-4 bg-yellow-500 px-5 py-3 rounded-lg"
          >
            <Text className="text-white text-base font-semibold">
              Go to Reservation Status
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>





      {/* Form Navigation */}
      <View className="flex-1 justify-center items-center">
        {/* Back to Dashboard */}
        <View className="absolute top-5 left-5">
          <Link replace href="/(app)/(tabs)/dashboard">
            <FontAwesome name="arrow-left" size={20} color="#333" />
          </Link>
        </View>

        <View className='flex-1 w-screen '>
        <ProgressSteps
          activeStepIconBorderColor="#D4A83F"
          completedStepIconColor="#2E3A8C"
          completedProgressBarColor="#2E3A8C"
          activeLabelColor="#D4A83F"
        >
          <ProgressStep
            label="Event Details" 
            onNext={validateEventDetails}
            errors={stepErrors.event || !reservationData.event.pkg || !reservationData.event.celebrant || !reservationData.event.eventDate || !reservationData.event.eventTime || !reservationData.event.location || !reservationData.event.theme || !reservationData.event.venue}
            buttonNextText='Next'
            buttonNextTextColor='#333333'
          >
            <EventDetailsForm data={reservationData.event} setReservationData={setReservationData} />
          </ProgressStep>

          <ProgressStep
            label="Guests"
            onNext={validateGuestDetails}
            errors={stepErrors.guests || !reservationData.guests.pax || !reservationData.guests.adults || !reservationData.guests.kids }
            buttonNextText='Next'
            buttonNextTextColor='#333333'
          >
            <GuestDetailsForm data={reservationData.guests} setReservationData={setReservationData} />
          </ProgressStep>

          <ProgressStep 
            label="Menu"
            buttonNextText='Next'
            buttonNextTextColor='#333333'
            errors={!reservationData.menu.beef || !reservationData.menu.chicken || !reservationData.menu.dessert || !reservationData.menu.fillet || !reservationData.menu.juice || !reservationData.menu.pasta || !reservationData.menu.pork || !reservationData.menu.vegetable}
          >
            <MenuDetailsForm data={reservationData.menu} setReservationData={setReservationData} />
          </ProgressStep>

          <ProgressStep 
            label="Review" 
            onSubmit={handleReservationSubmit}
            buttonFinishText='Submit'
            buttonFinishTextColor='#D4A83F'
          >
            <View className="w-full mx-auto">
              <ReservationPreview reservationData={reservationData} />
            </View>
          </ProgressStep>
        </ProgressSteps>
        </View>
      </View>
    </View>
  );
}
