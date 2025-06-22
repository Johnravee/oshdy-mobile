import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StatusBar,
  TouchableHighlight,
  Modal,
  Pressable,
  ActivityIndicator,
  ImageBackground,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Calendar from 'react-native-calendar-range-picker';
import { FontAwesome } from '@expo/vector-icons';
import { IMAGES } from '@/constants/Images';
import CustomModal from '@/components/ui/custom-modal';
import LottieView from 'lottie-react-native';


interface Card {
  id: number;
  title: string;
  icon: string;
  background: any;
  path: string;
}

export default function Dashboard() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 400;

  const [modalVisible, setModalVisible] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [searchingModal, setSearchingModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [searchResult, setSearchResult] = useState(false);
  const [schedData, setSchedData] = useState(true);


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

  const cards: Card[] = [
    { id: 1, title: 'Schedule Your Event', icon: 'calendar-plus-o', background: IMAGES.yellowcardbg, path: '/(app)/reservation' },
    { id: 2, title: 'Check Reservation Status', icon: 'clock-o', background: IMAGES.tealroundedcardbg, path: '/(app)/reservation-status' },
    { id: 3, title: 'Review Past Bookings', icon: 'history', background: IMAGES.orangecardbg, path: '/(app)/reservation-history' },
    { id: 4, title: 'Explore Event Designs', icon: 'magic', background: IMAGES.lighttealboxcardbg, path: '' },
    { id: 5, title: 'Explore Event Packages', icon: 'compass', background: IMAGES.navycardbg, path: '' },
    { id: 6, title: 'View Menu Options', icon: 'delicious', background: IMAGES.yellowredcardbg, path: '' },
  ];

  return (
    <SafeAreaView className="flex-1 h-full bg-primary relative flex justify-center">
      <View className="flex justify-between items-start mt-5 mb-5  px-5 bg-primary p-5">
        <Text className="text-white text-4xl font-bold">
          Welcome back! Let’s Plan Your Event.
        </Text>
        <TouchableHighlight
          onPress={() => setModalVisible(true)}
          underlayColor="#ddd"
          className="rounded-full mt-5"
        >
          <View className="h-16 w-full bg-white rounded-lg flex-row items-center justify-between px-5">
            <Text className="text-[#33333] text-lg font-semibold">Check Available Schedules</Text>
            <FontAwesome name="calendar" size={20} color="#33333" />
          </View>
        </TouchableHighlight>
      </View>

      {/* Calendar Modal */}
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
                onChange={(date) => {
                  setSelectedDate(date);
                  setModalVisible(false);
                  setShowCalendar(false);
                  setSearchingModal(true);
                }}
                pastYearRange={0}
                startDate={new Date().toISOString().split('T')[0]}
                disabledBeforeToday
              />
            )}
          </View>
        </View>
      </Modal>

      {/* Searching Modal */}
      <CustomModal visible={searchingModal} onClose={() => true}>
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-2xl p-5 w-11/12 h-auto justify-center items-center">
            <Pressable onPress={() => setSearchingModal(false)} className="absolute top-2 right-2 p-2 rounded-full">
              <FontAwesome name="close" size={20} color="#333" />
            </Pressable>
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
              Please hold while we check our catering calendar for availability on {selectedDate}.
            </Text>
            <View className="my-4 border-t border-gray-300 w-full" />
            <Text className="text-base text-center text-gray-600">
              You will be notified once results are ready.
            </Text>
          </View>
        </View>
      </CustomModal>

      {/* Schedule Result Modal */}
      <CustomModal visible={searchResult} onClose={() => true}>
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-2xl p-5 w-11/12 h-auto justify-center items-center">
            <Pressable onPress={() => setSearchingModal(false)} className="absolute top-2 right-2 p-2 rounded-full">
              <FontAwesome name="close" size={20} color="#333" />
            </Pressable>
            <LottieView
              source={schedData
                ? require('../../../assets/images/lottie/check.json')
                : require('../../../assets/images/lottie/notfound.json')}
              autoPlay
              loop
              style={{ width: 150, height: 150 }}
            />
            <Text className="text-2xl font-bold text-center mt-2 mb-4 text-dark">
              {schedData ? 'Confirmed Availability' : 'Not Available'}
            </Text>
            <Text className="text-base text-center text-gray-600 mb-5">
              Your selected date is {selectedDate} {schedData ? 'available' : 'not available'}.
            </Text>
            <View className="my-4 border-t border-gray-300 w-full" />
            <Text className="text-base text-center text-gray-600">
              Make changes if needed.
            </Text>
          </View>
        </View>
      </CustomModal>

      {/* Main Content */}
      <View className="flex-1 justify-center items-center  rounded-t-2xl bg-white shadow-lg relative overflow-hidden py-5">
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
        </ScrollView>
        
      </View>
    </SafeAreaView>
  );
}
