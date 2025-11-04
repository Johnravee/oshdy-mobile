import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  Platform,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuthContext } from '@/context/AuthContext';
import { useProfileContext } from '@/context/ProfileContext';
import Avatar from '@/components/ui/avatar';
import { Linking } from 'react-native';


export default function Profile() {
  const router = useRouter();
  const { session, logout } = useAuthContext();
  const { profile, setProfile } = useProfileContext();
  const [errorModalVisible, setErrorModalVisible] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/login');
      setProfile(null);
    } catch (error) {
      console.error("Logout error:", error);
      setErrorModalVisible(true);
    }
  };




  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Error Modal */}
      <Modal
        animationType="fade"
        transparent
        visible={errorModalVisible}
        onRequestClose={() => setErrorModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/30">
          <Pressable className="flex-1" onPress={() => setErrorModalVisible(false)} />
          <View className="w-full h-1/3 bg-white rounded-t-3xl p-6 shadow-lg">
            <Pressable
              onPress={() => setErrorModalVisible(false)}
              className="absolute top-4 right-4"
            >
              <FontAwesome name="close" size={22} color="#333" />
            </Pressable>
            <Text className="text-center text-lg font-bold text-red-600 mt-6">
              Something went wrong. Please try again.
            </Text>
          </View>
        </View>
      </Modal>

      {/* Header with avatar and info */}
      <View className="bg-secondary px-5 pt-6 pb-4 rounded-b-3xl">
        <View className="flex-row items-center gap-3">
          {/* Avatar */}
          <View className="justify-center items-center">
            <Avatar
              avatarUrl={session?.user?.user_metadata?.avatar_url}
            />
          </View>

          {/* Name & Email */}
          <View className="flex-1 justify-center">
            <Text className="text-lg font-bold text-white leading-tight">
              {profile?.name || 'Guest'}
            </Text>
            <Text className="text-sm text-gray-200">
              {session?.user?.email}
            </Text>
          </View>
        </View>
      </View>

      <View className="h-px bg-gray-200 mx-5 mb-4" />

      {/* Options */}
      <View className="flex-1 px-5 space-y-10">

        {/* Account Section */}
        <View className="space-y-4 mt-3">
          <Text className="text-sm font-bold text-gray-500 uppercase">Account</Text>
          <OptionItem icon="user" text="Edit Profile" onPress={() => router.push('/(app)/profile')} />
        </View>

        {/* My Events Section */}
        <View className="space-y-4 mt-3">
          <Text className="text-sm font-bold text-gray-500 uppercase">My Events</Text>
          <OptionItem icon="history" text="My Reservations" onPress={() => router.push('/(app)/(reservations)/reservation-history')} />
          <OptionItem icon="calendar" text="Event Calendar" onPress={() => router.push('/(app)/calendar')} />
        </View>

        {/* App Section */}
        <View className="space-y-4 mt-3">
          <Text className="text-sm font-bold text-gray-500 uppercase">App</Text>
          <OptionItem icon="comment" text="Feedback" onPress={() => router.push('/(app)/feedback')} />
          <OptionItem icon="info-circle" text="About App" onPress={() => router.push('/(app)/about')}  />
        </View>

        {/* Logout Section */}
        <View className="space-y-4 pt-4">
          <OptionItem icon="sign-out" text="Log Out" onPress={handleLogout} color="red" />
        </View>

      </View>
    </SafeAreaView>
  );
}

// Reusable option component
function OptionItem({
  icon,
  text,
  onPress,
  color = "#1F2937"
}: {
  icon: any;
  text: string;
  onPress: () => void;
  color?: string;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="w-full flex-row items-center justify-between bg-gray-100 rounded-2xl px-4 py-4 mt-2 shadow-sm"
    >
      <View className="flex-row items-center gap-3">
        <FontAwesome name={icon} size={20} color={icon === 'star' ? '#FFD700' : color} />
        <Text className="text-base font-medium" style={{ color }}>{text}</Text>
      </View>
      <FontAwesome name="angle-right" size={20} color={color} />
    </TouchableOpacity>
  );
}
