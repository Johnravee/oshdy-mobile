/**
 * @file Dashboard.tsx
 * @description
 * Dashboard screen with embedded User Profile Modal if no profile exists.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  Modal,
  Pressable,
  ImageBackground,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  ActivityIndicator,
  Platform,
  TouchableOpacity,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Calendar from 'react-native-calendar-range-picker';
import { FontAwesome } from '@expo/vector-icons';
import { IMAGES } from '@/constants/Images';
import CustomModal from '@/components/ui/custom-modal';
import LottieView from 'lottie-react-native';
import { useAvailableSchedules } from '@/hooks/useAvailableSchedules';
import { useHasProfile } from '@/hooks/useHasProfile';
import Spinner from '@/components/ui/spinner';
import { useInsertUserProfile } from '@/hooks/useInsertUserProfile';
import { useAuthContext } from '@/context/AuthContext';
import { useProfileContext } from '@/context/ProfileContext';
import HorizontalCarousel from '@/components/ui/HorizontalCarousel';


interface Card {
  id: number;
  title: string;
  icon: string;
  background: any;
  path: string;
}

const sampleMenus = [
  {
    id: 1,
    title: 'Beef Mushroom Stroganoff ',
    background: IMAGES.beefMushroom,
    path: '',
  },
  {
    id: 2,
    title: 'Pork Caldereta',
    background: IMAGES.porkCaldereta,
    path: '',
  },
  {
    id: 3,
    title: 'Chicken Cordon Bleu',
    background: IMAGES.cordon,
    path: '',
  },
  {
    id: 4,
    title: 'Fish Fillet in Sweet & Sour Sauce',
    background: IMAGES.fishFillet,
    path: '',
  },
  {
    id: 5,
    title: 'Buttered Mixed Vegies',
    background: IMAGES.misvegie,
    path: '',
  },
  {
    id: 6,
    title: 'Creamy Carbonara',
    background: IMAGES.carbonara,
    path: '',
  },
];

export default function Dashboard() {
  const router = useRouter();
  const { session } = useAuthContext();
  const { setProfile } = useProfileContext();
  const { isAvailable, checkingAvailability, error, checkDateAvailability } = useAvailableSchedules();
  const { hasProfile, hasProfileLoading } = useHasProfile();

  // Profile Modal
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');

  const [modalVisible, setModalVisible] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [searchingModal, setSearchingModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    if (!hasProfile && !hasProfileLoading) {
      setShowProfileModal(true);
    }else{
      setShowProfileModal(false);
    }
  }, [hasProfile, hasProfileLoading]);

  useEffect(() => {
    if (modalVisible) {
      const timeout = setTimeout(() => {
        setShowCalendar(true);
      }, 200);
      return () => clearTimeout(timeout);
    } else {
      setShowCalendar(false);
    }
  }, [modalVisible]);

  const handleSaveProfile = async () => {
    if (!name || !contact || !address) {
      Alert.alert('Missing Information', 'Please fill in all fields');
      return;
    }
    try {
      await useInsertUserProfile(name, address, contact, session, setProfile);
      setShowProfileModal(false);
    } catch (err) {
      console.log('Profile insert error', err);
      Alert.alert('Error', 'Failed to save profile');
    }
  };

  if (hasProfileLoading) return <Spinner />;

  const cards: Card[] = [
    {
      id: 1,
      title: 'Create Event Reservation',
      icon: 'calendar-plus-o',
      background: IMAGES.yellowcardbg,
      path: '/(app)/(reservations)/reservation',
    },
    {
      id: 2,
      title: 'Review Past Bookings',
      icon: 'history',
      background: IMAGES.orangecardbg,
      path: '/(app)/(reservations)/reservation-history',
    },
    {
      id: 3,
      title: 'Explore Event Designs',
      icon: 'magic',
      background: IMAGES.lighttealboxcardbg,
      path: '',
    },
    {
      id: 4,
      title: 'Explore Event Packages',
      icon: 'compass',
      background: IMAGES.navycardbg,
      path: '',
    },
    {
      id: 5,
      title: 'View Menu Options',
      icon: 'delicious',
      background: IMAGES.yellowredcardbg,
      path: '',
    },
  ];

  return (
    <SafeAreaView className="flex-1 h-full relative flex justify-center">


      {/* Searching Modal */}
      <Modal animationType="fade" transparent visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View className="flex-1 bg-transparent justify-end">
          <Pressable className="flex-1 w-full" onPress={() => setModalVisible(false)} />
          <View className="w-full h-1/2 bg-white rounded-t-3xl p-5 relative shadow-lg">
            <Pressable onPress={() => setModalVisible(false)} className="absolute top-4 right-4 z-10">
              <FontAwesome name="close" size={24} color="#333" />
            </Pressable>
            <Text className="text-lg font-bold mb-4 text-center">Select a Date</Text>
            {!showCalendar ? (
              <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#999" />
                <Text className="mt-2 text-gray-600">Loading calendar...</Text>
              </View>
            ) : (
              <Calendar
                singleSelectMode
                onChange={async (date) => {
                  setSelectedDate(date);
                  setModalVisible(false);
                  setShowCalendar(false);
                  setSearchingModal(true);
                  await checkDateAvailability(date);
                }}
                pastYearRange={0}
                startDate={new Date().toISOString().split('T')[0]}
                disabledBeforeToday
              />
            )}
          </View>
        </View>
      </Modal>

    {/*Availability of schedule Modal  */}
      <CustomModal visible={searchingModal} onClose={() => true}>
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-2xl p-5 w-11/12 h-auto justify-center items-center">
            <Pressable onPress={() => setSearchingModal(false)} className="absolute top-2 right-2 p-2 rounded-full">
              <FontAwesome name="close" size={20} color="#333" />
            </Pressable>

            {checkingAvailability ? (
              <>
                <LottieView
                  source={require('../../../assets/images/lottie/searching.json')}
                  autoPlay
                  loop
                  style={{ width: 150, height: 150 }}
                />
                <Text className="text-2xl font-bold text-center mt-2 mb-4 text-dark">
                  Searching for Available Schedules
                </Text>
                <Text className="text-base text-center text-gray-600 mb-5">
                  Please hold while we check availability on {selectedDate}.
                </Text>
              </>
            ) : isAvailable !== null ? (
              <>
                <FontAwesome
                  name={isAvailable ? 'check-circle' : 'times-circle'}
                  size={50}
                  color={isAvailable ? 'green' : 'red'}
                />
                <Text className="text-2xl font-bold text-center mt-2 mb-4 text-dark">
                  {isAvailable ? 'Date Available!' : 'Date Not Available'}
                </Text>
                <Text className="text-base text-center text-gray-600 mb-5">
                  {isAvailable
                    ? `Great news! You can reserve for ${selectedDate}.`
                    : `Sorry, there's already a reservation on ${selectedDate}.`}
                </Text>
              </>
            ) : error ? (
              <>
                <FontAwesome name="exclamation-circle" size={50} color="orange" />
                <Text className="text-xl font-bold mt-3 text-red-600">Error</Text>
                <Text className="text-base text-center text-gray-600 mb-5">
                  {error}
                </Text>
              </>
            ) : null}
          </View>
        </View>
      </CustomModal>



        <View className="flex justify-between items-start  
          px-5 bg-primary p-5">
          <Text className="text-white text-4xl font-bold">
            Welcome back! Let’s Plan Your Event.
          </Text>
          <TouchableHighlight
            onPress={() => setModalVisible(true)}
            underlayColor="#ddd"
            className="rounded-full mt-5"
          >
            <View className="h-16 w-full bg-white rounded-lg flex-row items-center justify-between px-5">
              <Text className="text-[#33333] text-lg font-semibold">
                Check Available Schedules
              </Text>
              <FontAwesome name="calendar" size={20} color="#33333" />
            </View>
          </TouchableHighlight>
        </View>

        <View className="flex-1 justify-center items-center rounded-t-2xl bg-white shadow-lg relative overflow-hidden py-5">
        <ScrollView>
          <View className="w-full flex-row flex-wrap justify-between items-start px-4 gap-y-5">
            {cards.map((card) => (
              <Pressable
                key={card.id}
                onPress={() => card.path && router.push(card.path as any)}
                className="w-[48%] rounded-3xl overflow-hidden"
              >
                <ImageBackground
                  source={card.background}
                  className="w-full aspect-[4/3] px-5 py-4 justify-start"
                  imageStyle={{ borderRadius: 24 }}
                >
                  <Text className="text-white font-extrabold mt-2">
                    <FontAwesome name={card.icon as keyof typeof FontAwesome.glyphMap} size={30} color="#ffffff" />
                  </Text>
                  <Text className="text-white text-lg font-bold mt-4">{card.title}</Text>
                </ImageBackground>
              </Pressable>
            ))}
          </View>
          <HorizontalCarousel
            title="Gourmet Selections"
            items={sampleMenus}
            imageKey="background"  
            titleKey="title"
            seeAllRoute="/(app)/menus"
          />
        </ScrollView>

      </View>

      {/* Profile Modal */}
      <Modal visible={showProfileModal} transparent animationType="slide">
        <View className="flex-1 bg-black/60 justify-center items-center px-5">
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            className="w-full"
          >
            <View className="bg-white rounded-2xl p-6 w-full shadow-lg">
              <Text className="text-2xl font-bold text-center mb-4">Set Up Your Profile</Text>
              <Text className="text-center text-gray-600 text-base mb-6">
                Kindly provide a few details so we can better assist you.
             </Text>

              <Text className="mb-1">Full Name</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
                placeholder="e.g., Juan Dela Cruz"
                value={name}
                onChangeText={setName}
              />

              <Text className="mb-1">Contact Number</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
                placeholder="e.g., 09XXXXXXXXX"
                keyboardType="phone-pad"
                value={contact}
                onChangeText={setContact}
              />

              <Text className="mb-1">Address</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 mb-6"
                placeholder="e.g., 123 Street Name, City"
                value={address}
                onChangeText={setAddress}
              />

              <TouchableOpacity
                className="bg-[#D4A83F] py-4 rounded-lg mb-2"
                onPress={handleSaveProfile}
              >
                <Text className="text-white text-center font-bold text-lg">Save</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
