import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Spinner from '@/components/ui/spinner';
import { useAuthContext } from '@/context/AuthContext';
import Avatar from '@/components/ui/avatar';
import BackButton from '@/components/ui/back-button';
import { supabase } from '@/lib/supabase';
import { useUserBookingCountByUser } from '@/hooks/useBookingCountByUser';
import { useCompletedBookByUser } from '@/hooks/useCompletedBookByUser';

export default function Profile() {
  const router = useRouter();
  const { session, profile } = useAuthContext();

  const [errorModalVisible, setErrorModalVisible] = useState(false);

  if(!profile?.id || !session) return <Spinner />;

  const {
    totalCount,
    loadingTotal,
    errorTotal,
  } = useUserBookingCountByUser(profile?.id);

  const {
    completedCount,
    loadingCompleted,
    errorCompleted,
  } = useCompletedBookByUser(profile?.id);

  useEffect(() => {
    if (errorTotal || errorCompleted) {
      setErrorModalVisible(true);
    }
  }, [errorTotal, errorCompleted]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (!profile || !session || loadingTotal || loadingCompleted) {
    return <Spinner />;
  }

  return (
    <SafeAreaView className="flex-1 h-screen w-screen">
      <StatusBar hidden={true} />

      {/* Error Modal */}
      <Modal
        animationType="fade"
        transparent
        visible={errorModalVisible}
        onRequestClose={() => setErrorModalVisible(false)}
      >
        <View className="flex-1 bg-transparent justify-end">
          <Pressable className="flex-1 w-full" onPress={() => setErrorModalVisible(false)} />
          <View className="w-full h-1/3 bg-white rounded-t-3xl p-5 relative shadow-lg">
            <Pressable
              onPress={() => setErrorModalVisible(false)}
              className="absolute top-4 right-4 z-10"
            >
              <FontAwesome name="close" size={24} color="#333" />
            </Pressable>
            <Text className="text-lg font-bold mb-4 text-center text-red-600">
              Something went wrong
            </Text>
            <Text className="text-base text-gray-700 text-center">
              {errorTotal || errorCompleted}
            </Text>
          </View>
        </View>
      </Modal>

      {/* Top Section */}
      <View className="bg-primary h-1/2 w-screen">
        <View className="absolute top-5 left-5">
          <BackButton variant="white" />
        </View>

        {/* Avatar */}
        <View className="w-screen h-full items-center justify-center flex-col gap-10">
          <Avatar
            avatarUrl={session?.user?.user_metadata?.avatar_url}
            name={profile?.name || session?.user?.user_metadata?.full_name}
          />
        </View>

        {/* Stats */}
        <View className="relative top-[-15%] w-screen h-1/3 flex justify-center items-center z-50">
          <View className="bg-white shadow-lg w-[90%] h-full rounded-lg flex justify-evenly items-center flex-row">
            {/* Total Bookings */}
            <View className="flex-row gap-3">
              <View className="flex justify-center items-center">
                <FontAwesome name="book" size={40} color="#2E3A8C" />
              </View>
              <View className="flex justify-center items-start">
                <Text className="text-2xl text-dark font-bold">
                  {totalCount >= 10 || totalCount === 0 ? totalCount : `0${totalCount}`}
                </Text>
                <Text className="text-base text-gray-400">Total Bookings</Text>
              </View>
            </View>

            {/* Completed Bookings */}
            <View className="flex-row gap-3">
              <View className="flex justify-center items-center">
                <FontAwesome name="check-circle" size={40} color="#4CAF50" />
              </View>
              <View className="flex justify-center items-start">
                <Text className="text-2xl text-dark font-bold">
                  {completedCount >= 10 || completedCount === 0 ? completedCount : `0${completedCount}`}
                </Text>
                <Text className="text-base text-gray-400">Completed</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Navigation Section */}
      <View className="h-1/2 w-screen bg-white justify-center items-center flex-col">
        <View className="flex-col justify-center items-center space-y-4 w-2/3 gap-5">
          {/* Home */}
          <TouchableOpacity
            className="w-full bg-white px-4 py-4 rounded-lg items-center border shadow-md flex-row space-x-3 gap-2"
            onPress={() => router.push('/(app)/(tabs)/dashboard')}
          >
            <FontAwesome name="home" size={20} color="#000" />
            <Text className="text-dark font-bold">Home</Text>
          </TouchableOpacity>

          {/* Profile Details */}
          <TouchableOpacity
            className="w-full bg-white px-4 py-4 rounded-lg items-center border shadow-md flex-row space-x-3 gap-2"
            onPress={() => router.push('/(app)/pDetails')}
          >
            <FontAwesome name="user" size={20} color="#000" />
            <Text className="text-dark font-bold">Profile Details</Text>
          </TouchableOpacity>

          {/* Logout */}
          <TouchableOpacity
            className="w-full bg-white px-4 py-4 rounded-lg items-center border shadow-md flex-row space-x-3 gap-2"
            onPress={handleLogout}
          >
            <FontAwesome name="sign-out" size={20} color="red" />
            <Text className="text-red-600 font-bold">Log out</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
