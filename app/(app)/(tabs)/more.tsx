/**
 * @file Profile.tsx
 * @component Profile
 * @description
 * User profile screen displaying avatar, booking stats, navigation options, and logout functionality.
 *
 * @features
 * - Shows total and completed bookings using custom hooks
 * - Displays user avatar and name
 * - Provides navigation to dashboard and profile details
 * - Includes error modal for failed fetches and logout handling
 *
 * @author John Rave Mimay
 * @created 2025-07-09
 */


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


import { useProfileContext } from '@/context/ProfileContext';

export default function Profile() {
  const router = useRouter();
  const { session, logout } = useAuthContext();
  const { profile, setProfile } = useProfileContext();
  

  const [errorModalVisible, setErrorModalVisible] = useState(false);

  // if(!profile?.id || !session) return <Spinner />;


  // if (!profile || !session ) {
  //   return <Spinner />;
  // }

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/login');
      setProfile(null); // Clear profile context on logout
    } catch (error) {
      console.error("Logout error:", error);
      setErrorModalVisible(true);
    }
  };

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
