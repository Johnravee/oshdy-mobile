/**
 * @file ProfileDetails.tsx
 * @component ProfileDetails
 * @description
 * A clean, professional user profile screen allowing editable name, phone, and address.
 * Email is read-only. Integrates with Supabase.
 *
 * @features
 * - Fetches profile from context and pre-fills form
 * - Updates Supabase profile on save
 * - Inline validation and feedback
 * - Smooth UX with loading and saving indicators
 *
 * @author John Rave Mimay
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';
import Spinner from '@/components/ui/spinner';
import InputComponent from '@/components/ui/inputText';
import BackButton from '@/components/ui/back-button';
import { useProfileContext } from '@/context/ProfileContext';
import { logError, logInfo, logSuccess } from '@/utils/logger';

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

  useEffect(() => {
    if (profile) {
      const updatedForm = {
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.contact_number || '',
        address: profile.address || '',
        uuid: profile.auth_id || '',
      };
      setForm(updatedForm);
      logInfo('Profile synced from context', updatedForm);
    }
    setLoading(false);
  }, [profile]);

  const handleChange = (key: keyof ProfileForm, value: string) => {
    setForm((prev) => {
      const updated = { ...prev, [key]: value };
      logInfo(`Field changed: ${key}`, { old: prev[key], new: value });
      return updated;
    });
  };

  const handleSave = async () => {
    setError(null);
    setIsSaving(true);
    logInfo('Attempting to save profile...', form);

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
        logError('Supabase update error', updateError);
        setError('Failed to update profile. Please try again.');
      } else {
        const updated = {
          ...profile!,
          name: form.name,
          contact_number: form.phone,
          address: form.address,
        };
        setProfile(updated);
        logSuccess('Profile updated successfully', updated);
      }
    } catch (err: any) {
      logError('Unexpected error while saving profile', err);
      setError('An unexpected error occurred.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      <View className="absolute top-5 left-5 z-10">
        <BackButton variant="dark" />
      </View>

      {/* Decorative Background Circles */}
      <View className="absolute left-[-10%] top-[-10%]">
        <View className="h-40 w-40 bg-primary rounded-full opacity-40" />
        <View className="h-20 w-20 bg-primary rounded-full opacity-30 top-[-20] left-[60] absolute" />
      </View>
      <View className="absolute right-[-10%] bottom-[-10%]">
        <View className="h-48 w-48 bg-primary rounded-full opacity-40" />
        <View className="h-24 w-24 bg-primary rounded-full opacity-30 top-[-30] right-[50] absolute" />
      </View>

      <View className="h-1/4 justify-center items-center">
        <Text className="text-dark font-bold text-3xl">Edit Your Profile</Text>
        <Text className="text-muted mt-1">Help us personalize your experience</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ paddingBottom: 40 }}
          className="px-6"
          keyboardShouldPersistTaps="handled"
        >
          <View className="bg-white rounded-2xl shadow-md p-5">

            {/* Name */}
            <InputComponent
              label="Name"
              value={form.name}
              onChangeText={(val) => handleChange('name', val)}
              placeholder="Enter your full name"
              placeholderTextColor="#999"
            />

            {/* Phone */}
            <InputComponent
              label="Phone Number"
              value={form.phone}
              onChangeText={(val) => handleChange('phone', val)}
              keyboardType="phone-pad"
              placeholder="Enter your phone number"
              placeholderTextColor="#999"
            />

            {/* Address */}
            <InputComponent
              label="Address"
              value={form.address}
              onChangeText={(val) => handleChange('address', val)}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              placeholder="Enter your address"
              placeholderTextColor="#999"
              className="h-32"
            />

            {/* Error */}
            {error && (
              <Text className="text-red-600 text-sm mb-2 text-center">
                {error}
              </Text>
            )}

            {/* Save Button */}
            <TouchableOpacity
              onPress={handleSave}
              className="bg-secondary py-3 rounded-xl items-center mt-4"
              disabled={isSaving}
            >
              <Text className="text-white font-semibold text-lg">
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
