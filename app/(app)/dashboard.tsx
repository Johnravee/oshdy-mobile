import React, { useState, useEffect } from 'react';
import { View, Text, StatusBar, TouchableHighlight, Modal, Pressable, ActivityIndicator, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Calendar from "react-native-calendar-range-picker";
import { FontAwesome } from '@expo/vector-icons';
import FloatingTabBar from '@/components/ui/custom-tab';
import { IMAGES } from '@/constants/Images';
import CustomModal from '@/components/ui/custom-modal';
import LottieView from 'lottie-react-native';
import { insertUserToProfiles } from '@/hooks/useInsertProfile';

export default function Dashboard() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [searchingModal, setSearchingModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [searchResult, setSearchResult] = useState(false); //Modal for search result
  const [schedData, setSchedData] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('home');


  const handleTabPress = (tabName: string) => {
    setActiveTab(tabName);
  };

  insertUserToProfiles(); // lipat sa useauth 
  

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

  const cards = [
    { id: 1, title: 'Schedule Your Event', icon: "calendar-plus-o", background: IMAGES.yellowcardbg },
    { id: 2, title: 'Check Event Status', icon: "clock-o", background: IMAGES.tealroundedcardbg },
    { id: 3, title: 'Review Past Bookings', icon: "history", background: IMAGES.orangecardbg },
    { id: 4, title: 'Explore Event Designs', icon: "magic", background: IMAGES.lighttealboxcardbg },
    { id: 5, title: 'Explore Event Packages', icon: "compass", background: IMAGES.navycardbg },
    { id: 6, title: 'View Menu Options', icon: "delicious", background: IMAGES.yellowredcardbg }
  ];

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <StatusBar hidden={true} />
      
      {/* Header */}
      <View className="flex justify-between items-start mt-5 gap-5 px-5">
        <Text className="text-white text-4xl font-bold">
          Welcome back! Let’s Plan Your Event.
        </Text>
        <TouchableHighlight onPress={() => setModalVisible(true)} underlayColor="#ddd" className="rounded-full">
          <View className="h-16 w-full bg-white rounded-lg flex-row items-center justify-between px-5">
            <Text className="text-[#33333] text-lg font-semibold">Check Available Schedules</Text>
            <FontAwesome name="calendar" size={20} color="#33333" />
          </View>
        </TouchableHighlight>
      </View>

      {/* Modal for Calendar */}
      <Modal animationType="fade" transparent visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View className="flex-1 bg-transparent justify-end">
          <Pressable className="flex-1 w-full" onPress={() => setModalVisible(false)} />
          <View className="w-full h-1/2 bg-white rounded-t-3xl p-5 relative shadow-lg">
            <Pressable onPress={() => setModalVisible(false)} className="absolute top-4 right-4 z-10">
              <FontAwesome name="close" size={24} color="#333" />
            </Pressable>
            <Text className="text-lg font-bold mb-4 text-center">Select a Date</Text>

            {/* Loading Spinner */}
            {!showCalendar && (
              <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#999" />
                <Text className="mt-2 text-gray-600">Loading calendar...</Text>
              </View>
            )}

            {/* Calendar Component */}
            {showCalendar && (
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
                disabledBeforeToday={true}
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
              source={require('../../assets/images/lottie/searching.json')}
              autoPlay
              loop
              style={{ width: 150, height: 150 }}
            />
            <Text className="text-2xl font-bold text-center mt-2 mb-4 text-dark">
              Searching for Available Schedules
            </Text>
            <Text className="text-base text-center text-gray-600 mb-5">
              Please hold while we check our catering calendar for availability on {selectedDate}. This may take a few moments.
            </Text>
            <View className="my-4 border-t border-gray-300 w-full" />
            <Text className="text-base text-center text-gray-600">
              You will be notified as soon as the scheduling results are ready. Please do not refresh or close this window.
            </Text>
          </View>
        </View>
      </CustomModal>

      {/* Available Schedule Modal */}
      <CustomModal visible={searchResult} onClose={() => true}>
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-2xl p-5 w-11/12 h-auto justify-center items-center">
            <Pressable onPress={() => setSearchingModal(false)} className="absolute top-2 right-2 p-2 rounded-full">
              <FontAwesome name="close" size={20} color="#333" />
            </Pressable>
            <LottieView
              source={schedData ? require('../../assets/images/lottie/check.json') : require('../../assets/images/lottie/notfound.json')}
              autoPlay
              loop
              style={{ width: 150, height: 150 }}
            />
            <Text className="text-2xl font-bold text-center mt-2 mb-4 text-dark">
              {schedData ? 'Confirmed Availability' : 'Not Available'}
            </Text>
            <Text className="text-base text-center text-gray-600 mb-5">
              Your selected date is {selectedDate} {schedData ? 'available' : 'not available'}. Please proceed with your reservation or choose a different date if necessary.
            </Text>
            <View className="my-4 border-t border-gray-300 w-full" />
            <Text className="text-base text-center text-gray-600">
              If you need to make any changes or select a different date, please do so now.
            </Text>
          </View>
        </View>
      </CustomModal>

      {/* Main Content */}
      <View className="h-full w-full rounded-t-2xl bg-white mt-10">
        <View className="w-full h-auto flex flex-row flex-wrap justify-center bg-transparent items-center mt-10 py-10 px-4">
          {cards.map((card) => (
            <Pressable className="w-1/2 sm:w-full rounded-3xl overflow-hidden p-3" key={card.id}>
              <ImageBackground
                source={card.background}
                className="w-full aspect-[4/3] overflow-hidden px-5 py-4 justify-start"
                imageStyle={{ borderRadius: 24 }}
              >
                <Text className="text-white font-extrabold mt-2">
                  <FontAwesome name={card.icon as keyof typeof FontAwesome.glyphMap} size={30} color="#ffffff" />
                </Text>
                <Text className="text-white text-xl font-bold mt-4">{card.title}</Text>
              </ImageBackground>
            </Pressable>
          ))}
        </View>

        {/* Floating Tab Bar */}
        <View className="w-full h-auto flex justify-center items-center py-safe-or-10 px-5">
          <View className="border rounded-full py-1 w-auto bg-transparent shadow-lg">
            <FloatingTabBar onTabPress={handleTabPress} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
