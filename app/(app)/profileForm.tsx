import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useProfileContext } from '@/context/ProfileContext';
import { useAuthContext } from '@/context/AuthContext';
import { InserUserProfile } from '@/lib/api/insertUserProfile';

export default function ProfileForm() {
  const { profile, setProfile, profileLoading } = useProfileContext();
  const { session } = useAuthContext();
  const router = useRouter();

  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [errors, setErrors] = useState({ name: '', contact: '', address: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!profileLoading && profile) {
      router.replace('/(app)/(tabs)/dashboard');
    }
  }, [profile, profileLoading]);

 
  if (profileLoading || profile) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#F3C663" />
      </View>
    );
  }

  const validateFields = () => {
    const newErrors: typeof errors = { name: '', contact: '', address: '' };
    let isValid = true;

    if (!name.trim()) {
      newErrors.name = 'Full name is required.';
      isValid = false;
    }

    if (!contact.trim()) {
      newErrors.contact = 'Contact number is required.';
      isValid = false;
    } else if (!/^\d{10,}$/.test(contact)) {
      newErrors.contact = 'Enter a valid phone number.';
      isValid = false;
    }

    if (!address.trim()) {
      newErrors.address = 'Address is required.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = async () => {
    if (!validateFields()) return;

    try {
      setLoading(true);
      const data = await InserUserProfile(
        name,
        address,
        contact,
        session,
        setProfile
      );
      if (data) {
        router.replace('/(app)/(tabs)/dashboard');
      }
    } catch (err) {
      console.error('Insert profile error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-white"
    >
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text className="text-xl font-bold text-gray-800 mb-6">Profile Information</Text>

        {/* Full Name */}
        <View className="mb-4">
          <Text className="text-sm text-gray-600 mb-1">Full Name</Text>
          <TextInput
            className={`border rounded-xl p-3 text-base ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your full name"
            value={name}
            onChangeText={setName}
          />
          {errors.name ? <Text className="text-xs text-red-500 mt-1">{errors.name}</Text> : null}
        </View>

        {/* Contact Number */}
        <View className="mb-4">
          <Text className="text-sm text-gray-600 mb-1">Contact Number</Text>
          <TextInput
            className={`border rounded-xl p-3 text-base ${
              errors.contact ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your contact number"
            keyboardType="phone-pad"
            value={contact}
            onChangeText={setContact}
          />
          {errors.contact ? (
            <Text className="text-xs text-red-500 mt-1">{errors.contact}</Text>
          ) : null}
        </View>

        {/* Address */}
        <View className="mb-6">
          <Text className="text-sm text-gray-600 mb-1">Address</Text>
          <TextInput
            className={`border rounded-xl p-3 text-base ${
              errors.address ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your address"
            multiline
            numberOfLines={4}
            value={address}
            onChangeText={setAddress}
            textAlignVertical="top"
          />
          {errors.address ? (
            <Text className="text-xs text-red-500 mt-1">{errors.address}</Text>
          ) : null}
        </View>

        {/* Save Button */}
        <TouchableOpacity
          onPress={handleSave}
          disabled={loading}
          className="bg-[#F3C663] rounded-xl py-3 items-center"
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-base font-bold text-white">Save Profile</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
