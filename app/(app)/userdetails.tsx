import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { useInsertUserProfile } from '@/hooks/useInsertUserProfile';
import { useAuthContext } from '@/context/AuthContext';

export default function UserDetailsScreen() {
  const { session, setProfile } = useAuthContext();
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const router = useRouter();

  const handleContinue = async () => {
    if (!name || !contact || !address) {
      Alert.alert('Missing Information', 'Please fill in all fields');
      return;
    }
  
    try {
      await useInsertUserProfile(name, address, contact, session, setProfile); 
      router.replace('/(app)/dashboard'); // or wherever you want to go
    } catch (err) {
      console.log("error profile insert", err)
      Alert.alert('Error', 'Something went wrong while saving your details.');
    }
  };
  

  return (
    <SafeAreaView className="flex-1 bg-[#F9F9F9]">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1">
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 20 }}>
          <View className="bg-white p-6 rounded-2xl shadow-lg">
            <Text className="text-3xl font-bold text-center text-[#2E3A8C] mb-2">
              Welcome!
            </Text>
            <Text className="text-center text-gray-600 text-base mb-6">
              Kindly provide a few details so we can better assist you.
            </Text>

            <Text className="text-base mb-1">👤 Your Full Name</Text>
            <TextInput
              className="border border-gray-300 rounded-xl p-4 mb-4 text-base"
              placeholder="e.g., Juan Dela Cruz"
              value={name}
              onChangeText={setName}
            />

            <Text className="text-base mb-1">📞 Mobile Number</Text>
            <TextInput
              className="border border-gray-300 rounded-xl p-4 mb-4 text-base"
              placeholder="e.g., 09XXXXXXXXX"
              keyboardType="phone-pad"
              value={contact}
              onChangeText={setContact}
            />

            <Text className="text-base mb-1">🏠 Home Address</Text>
            <TextInput
              className="border border-gray-300 rounded-xl p-4 mb-6 text-base"
              placeholder="e.g., 123 Street Name, City"
              value={address}
              onChangeText={setAddress}
            />

            <TouchableOpacity
              className="bg-[#D4A83F] p-4 rounded-xl shadow-md"
              onPress={handleContinue}
            >
              <Text className="text-white font-bold text-center text-lg">Continue</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
