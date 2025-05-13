import { View, Text, TextInput, TouchableOpacity, StatusBar } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Link } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';
import Spinner from '@/components/ui/spinner';
import { useAuthContext } from '@/context/AuthContext';

export default function ProfileDetails() {
  const { profile, setProfile } = useAuthContext();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    uuid: '',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.contact_number || '',
        address: profile.address || '',
        uuid: profile.auth_id || '',
      });
    }
    setLoading(false);
  }, [profile]);

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setError(null);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: form.name,
          contact_number: form.phone,
          address: form.address,
        })
        .eq('auth_id', form.uuid);

      if (error) {
        console.error('Error saving profile:', error.message);
        setError('Failed to update profile. Please try again.');
      } else {
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
    }
  };

  if (loading) return <Spinner />;

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Back Button */}
      <View className="absolute top-5 left-5 z-10">
        <Link replace href="/(app)/profile">
          <FontAwesome name="arrow-left" size={20} color="#333" />
        </Link>
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

      {/* Form */}
      <View className="flex-1 items-center bg-primary rounded-3xl">
        <View className="bg-white relative top-[-10%] w-[80%] shadow-lg rounded-xl p-5">

          {/* Name */}
          <View className="mb-4">
            <Text className="text-dark font-semibold mb-1">Name</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-4 bg-white"
              value={form.name}
              onChangeText={(val) => handleChange('name', val)}
              placeholder="Enter your name"
              placeholderTextColor="#999"
            />
          </View>

          {/* Email (non-editable) */}
          <View className="mb-4">
            <Text className="text-dark font-semibold mb-1">Email</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-4 bg-gray-200"
              value={form.email}
              editable={false}
              keyboardType="email-address"
              placeholder="Enter your email"
              placeholderTextColor="#999"
            />
          </View>

          {/* Phone */}
          <View className="mb-4">
            <Text className="text-dark font-semibold mb-1">Phone Number</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-4 bg-white"
              value={form.phone}
              onChangeText={(val) => handleChange('phone', val)}
              keyboardType="phone-pad"
              placeholder="Enter your phone number"
              placeholderTextColor="#999"
            />
          </View>

          {/* Address */}
          <View className="mb-6">
            <Text className="text-dark font-semibold mb-1">Address</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-4 bg-white h-36"
              value={form.address}
              onChangeText={(val) => handleChange('address', val)}
              multiline
              numberOfLines={10}
              textAlignVertical="top"
              placeholder="Enter your address"
              placeholderTextColor="#999"
            />
          </View>

          {/* Error */}
          {error && (
            <Text className="text-red-600 text-sm mb-2">{error}</Text>
          )}

          {/* Save Button */}
          <TouchableOpacity
            onPress={handleSave}
            className="bg-secondary py-3 rounded-lg items-center"
          >
            <Text className="text-white font-bold text-lg">Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
