/**
 * @file reservation.tsx
 * @component Reservation
 * @description
 * Multi-step reservation form using react-native-progress-steps.
 * Allows users to enter and preview personal, event, guest, and menu details,
 * and submit a reservation with real-time feedback and success modal.
 *
 * @features
 * - Autofill from user profile
 * - Validation per step
 * - Preview final reservation
 * - Submit with Supabase insert query
 *
 * @author John Rave Mimay
 * @created 2025-06-15
 */

import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';
import { Link, router } from 'expo-router';
import LottieView from 'lottie-react-native';

// Contexts & Hooks
import { useAuthContext } from '@/context/AuthContext';
import { useInsertReservation } from '@/hooks/useReservationQuery';

// Components
import CustomAlert from '@/components/ui/alert';
import Spinner from '@/components/ui/spinner';
import CustomModal from '@/components/ui/custom-modal';
import PersonalInfoForm from '@/components/reservationforms/personal-info';
import EventDetailsForm from '@/components/reservationforms/event-details';
import GuestDetailsForm from '@/components/reservationforms/guest-details';
import MenuDetailsForm from '@/components/reservationforms/menu-details';
import ReservationPreview from '@/components/reservationforms/reservation-preview';
import CountdownTimer from '@/components/coundown-timer';

// Types
import { ReservationData } from '@/types/reservation-types';


const initialReservationData: ReservationData = {
  personal: { name: '', email: '', contact: '', address: '' },
  event: { celebrant: '', pkg: '', theme: '', venue: '', eventDate: '', eventTime: '', location: '' },
  guests: { pax: '', adults: '', kids: '' },
  menu: { beef: '', chicken: '', vegetable: '', pork: '', pasta: '', fillet: '', dessert: '', juice: '' },
};

export default function Reservation() {
  const { profile, init } = useAuthContext();
  const [reservationData, setReservationData] = useState<ReservationData>(initialReservationData);
  const [alertVisible, setAlertVisible] = useState({ firstForm: false, secondForm: false });
  const [isFilled, setIsFilled] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isCooldown, setIsCooldown] = useState(false); // Track cooldown state
  const { insertReservation, loading, error: insertError, success } = useInsertReservation();


  const [stepErrors, setStepErrors] = useState({
    personal: false,
    event: false,
    guests: false,
  });


 

  useEffect(() => {
    if (profile && !isFilled) {
      setAlertVisible(prev => ({ ...prev, firstForm: true }));
    }
  }, [profile]);

  

  const validatePersonalInfo = () => {
    const { name, email, contact, address } = reservationData.personal;
    const hasError = !name || !email || !contact || !address;
    setStepErrors(prev => ({ ...prev, personal: hasError }));
    if (hasError) {
      Alert.alert('Missing Info', 'Please complete all personal information fields.');
      return false;
    }
    return true;
  };

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
    if (!loading || result || success) {
      setModalVisible(true);
      setIsCooldown(true)
    }
  };

  useEffect(() => {
    if (success && modalVisible) {
      const timer = setTimeout(() => {
        router.replace('/(app)/reservation-status');
      }, 10000);
      return () => clearTimeout(timer); 
    }
  }, [success, modalVisible]);

  const handleTimeStop = () =>{
    setIsCooldown(false);
  }

  if (init) return <Spinner />;

  return (
    <View className="flex-1 bg-white">
   
      {/* Loading Spinner */}
      {loading && <Spinner />}

      {/* Success Modal */}
      {modalVisible && (
        <CustomModal visible={modalVisible} onClose={() => setModalVisible(false)}>
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="bg-white rounded-2xl p-5 w-11/12 items-center">
              <Pressable onPress={() => setModalVisible(false)} className="absolute top-2 right-2 p-2">
                <FontAwesome name="close" size={20} color="#333" />
              </Pressable>
              <LottieView
                source={require('../../assets/images/lottie/check.json')}
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
               You will be redirected to the event status in <CountdownTimer second={10} handleTimeStop={handleTimeStop} />
              </Text>
              <Text className="text-base text-gray-600 text-center">
                Need to make changes? Contact our team or wait for the confirmation email.
              </Text>
            </View>
          </View>
        </CustomModal>
      )}

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
