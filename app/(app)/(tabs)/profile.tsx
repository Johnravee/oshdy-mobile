/**
 * @file Profile.tsx
 * @description
 * Displays the user's profile screen in the OSHDY Catering app. Includes:
 * - Avatar and profile details
 * - Summary stats (e.g., bookings)
 * - Navigation shortcuts to key screens
 *
 * @usedIn
 * - Tabs navigation (likely /account or /profile tab)
 *
 * @features
 * - Shows user's metadata from Supabase
 * - Navigation to dashboard, profile details, and receipt
 * - UI placeholder for dynamic booking counts and deletion
 *
 * @todo
 * - Fetch real booking and ongoing count from Supabase
 * - Implement delete account functionality
 *
 * @author
 * John Rave Mimay
 * @created
 * 2025-06-15
 */

import { View, Text, Image, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Spinner from '@/components/ui/spinner';
import { useAuthContext } from '@/context/AuthContext';
import Avatar from '@/components/ui/avatar';
import BackButton from '@/components/ui/back-button';
import { supabase } from '@/lib/supabase';

export default function Profile() {
  const router = useRouter();
  const { session } = useAuthContext();
  const [error, setError] = useState<string | null>(null);

  if (!session) {
    return <Spinner />;
  }

  const handleLogout = async () =>{
    const { error } = await supabase.auth.signOut()
  }

  return (
    <SafeAreaView className="flex-1 h-screen w-screen">
      <StatusBar hidden={true} />

      {/* Top Section (Background with Avatar & Stats Card) */}
      <View className="bg-primary h-1/2 w-screen">
        {/* Back Button */}
        <View className="w-full flex flex-row">
          <View className="absolute top-5 left-5">
            <BackButton variant="white" />
          </View>
        </View>

        {/* Avatar Section */}
        <View className="w-screen h-full items-center justify-center flex-col gap-10">
          <Avatar
            avatarUrl={session?.user?.user_metadata?.avatar_url}
            name={session?.user?.user_metadata?.name}
          />
        </View>

        {/* Stats Summary Card */}
        <View className="relative top-[-15%] w-screen h-1/3 flex justify-center items-center z-50">
          <View className="bg-white shadow-lg w-[90%] h-full rounded-lg flex justify-evenly items-center flex-row">
            
            {/* Total Bookings */}
            <View className="flex-row gap-3">
              <View className="flex justify-center items-center">
                <FontAwesome name="book" size={40} color="#2E3A8C" />
              </View>
              <View className="flex justify-center items-start">
                <Text className="text-2xl text-dark font-bold">01</Text>
                <Text className="text-base text-gray-400">Total Bookings</Text>
              </View>
            </View>

            {/* Ongoing Bookings */}
            <View className="flex-row gap-3">
              <View className="flex justify-center items-center">
                <FontAwesome name="percent" size={40} color="#000" />
              </View>
              <View className="flex justify-center items-start">
                <Text className="text-2xl text-dark font-bold">01</Text>
                <Text className="text-base text-gray-400">Ongoing</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Lower Section (Navigation Options) */}
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

          {/* Receipt (Placeholder) */}
          <TouchableOpacity className="w-full bg-white px-4 py-4 rounded-lg items-center border shadow-md flex-row space-x-3 gap-2">
            <FontAwesome name="file-text" size={20} color="#000" />
            <Text className="text-dark font-bold">Receipt</Text>
          </TouchableOpacity>

          {/* Delete Account (Placeholder) */}
          <TouchableOpacity className="w-full bg-white px-4 py-4 rounded-lg items-center border shadow-md flex-row space-x-3 gap-2"
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
