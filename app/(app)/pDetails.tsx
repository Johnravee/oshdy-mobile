/**
 * @file ProfileDetails.tsx
 * @component ProfileDetails
 * @description
 * Editable user profile screen for updating name, phone, and address. Email is read-only.
 *
 * @features
 * - Loads and pre-fills profile data from context
 * - Updates user profile in Supabase
 * - Shows loading spinner during fetch
 * - Displays error feedback on failure
 *
 * @author John Rave Mimay
 */


import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';
import Spinner from '@/components/ui/spinner';
import InputComponent from '@/components/ui/inputText';

import BackButton from '@/components/ui/back-button';
import { useProfileContext } from '@/context/ProfileContext';

type ProfileForm = {
  name: string;
  email: string;
  phone: string;
  address: string;
  uuid: string;
};

export default function ProfileDetails() {
  const { profile, setProfile } = useProfileContext();

  const [form, setForm] = useState<ProfileForm>({
    name: '',
    email: '',
    phone: '',
    address: '',
    uuid: '',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Sync profile data to local form state on mount or profile change
  useEffect(() => {
    if (profile) {
      setForm({
        name: profile?.name || '',
        email: profile?.email || '',
        phone: profile?.contact_number || '',
        address: profile?.address || '',
        uuid: profile?.auth_id || '',
      });
    }
    setLoading(false);
  }, [profile]);

  /**
   * Handles updating individual form fields.
   */
  const handleChange = (key: keyof ProfileForm, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  /**
   * Submits the updated profile data to Supabase.
   */
  const handleSave = async () => {
    setError(null);
    setIsSaving(true);

    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          name: form.name,
          contact_number: form.phone,
          address: form.address,
        })
        .eq('auth_id', form.uuid);

      if (updateError) {
        console.error('Error saving profile:', updateError.message);
        setError('Failed to update profile. Please try again.');
      } else {
        // Update context
        setProfile({
          ...profile!,
          name: form.name,
          contact_number: form.phone,
          address: form.address,
        });
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      {/* Back Button */}
      <View className="absolute top-5 left-5 z-10">
        <BackButton variant='white' />
      </View>

      {/* Background Circles */}
      <View className="absolute left-[-5%]">
        <View className="h-48 w-48 bg-primary rounded-full opacity-55 top-[-30%] left-[-15%]" />
        <View className="h-40 w-40 bg-primary rounded-full opacity-50 top-[-50%] left-[-30%]" />
      </View>
      <View className="absolute right-[-10%]">
        <View className="h-48 w-48 bg-primary rounded-full opacity-55 top-[-30%] right-[-10%]" />
        <View className="h-20 w-20 bg-primary rounded-full opacity-50 top-[-45%] right-[-50%]" />
      </View>

      {/* Title */}
      <View className="h-1/3 justify-center items-center">
        <Text className="text-dark font-bold text-2xl">Profile Details</Text>
      </View>

      {/* Form Container */}
      <View className="flex-1 items-center bg-primary rounded-3xl">
        <View className="bg-white relative top-[-10%] w-[80%] shadow-lg rounded-xl p-5">
          <InputComponent
            label="Name"
            value={form.name}
            onChangeText={(val) => handleChange('name', val)}
            placeholder="Enter your name"
            placeholderTextColor="#999"
          />

          <InputComponent
            label="Email"
            value={form.email}
            editable={false}
            keyboardType="email-address"
            placeholder="Your email address"
            placeholderTextColor="#999"
            className="bg-gray-200"
          />

          <InputComponent
            label="Phone Number"
            value={form.phone}
            onChangeText={(val) => handleChange('phone', val)}
            keyboardType="phone-pad"
            placeholder="Enter your phone number"
            placeholderTextColor="#999"
          />

          <InputComponent
            label="Address"
            value={form.address}
            onChangeText={(val) => handleChange('address', val)}
            multiline
            numberOfLines={10}
            textAlignVertical="top"
            placeholder="Enter your address"
            placeholderTextColor="#999"
            className="h-36"
          />

          {error && (
            <Text className="text-red-600 text-sm mb-2">{error}</Text>
          )}

          <TouchableOpacity
            onPress={handleSave}
            className="bg-secondary py-3 rounded-lg items-center mt-4"
            disabled={isSaving}
          >
            <Text className="text-white font-bold text-lg">
              {isSaving ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
