import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import React, { useState, useEffect} from 'react';
import { Link } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export default function ProfileDetails() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
      const fetchUser = async () => {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) {
          setError(error.message);
        } else {
          setName(user?.user_metadata.full_name);
          setEmail(user?.user_metadata.email);
          setPhone(user?.user_metadata.phone);
        }
  
        console.log(user?.user_metadata);
      };
  
      fetchUser();
    }, []);

  const handleSave = () => {
    // TODO: Connect to backend or Supabase
    console.log('Saving:', { name, email, phone });
  };

  return (
    <SafeAreaView className='flex-1 h-screen w-screen bg-white'>
      {/* Header with back button */}
      <View className='w-full flex flex-row'>
        <View className='absolute top-5 left-5'>
          <Link replace href='/(app)/profile'>
            <FontAwesome name="arrow-left" size={20} color="#333" />
          </Link>
        </View>
      </View>

      {/* Title */}
      <View className='w-screen h-1/3 justify-center items-center'>
        <Text className='text-dark font-bold text-2xl'>Profile Details</Text>
      </View>

      {/* Form Container */}
      <View className='w-screen flex-1 items-center bg-primary rounded-3xl '>
        <View className='bg-white relative top-[-10%]  w-[80%] shadow-lg rounded-xl p-5'>

          {/* Name */}
          <View className='mb-4'>
            <Text className='text-dark font-semibold mb-1'>Name</Text>
            <TextInput
              className='border border-gray-300 rounded-lg px-4 py-4 bg-white'
              placeholder="Enter your name"
              value={name}
              onChangeText={setName}
              placeholderTextColor="#999"
            />
          </View>

          {/* Email */}
          <View className='mb-4'>
            <Text className='text-dark font-semibold mb-1'>Email</Text>
            <TextInput
              className='border border-gray-300 rounded-lg px-4 py-4 bg-white'
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              placeholderTextColor="#999"
            />
          </View>

          {/* Phone */}
          <View className='mb-6'>
            <Text className='text-dark font-semibold mb-1'>Phone Number</Text>
            <TextInput
              className='border border-gray-300 rounded-lg px-4 py-4 bg-white'
              placeholder="Enter your phone number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholderTextColor="#999"
            />
          </View>

          {/* Save Button */}
          <TouchableOpacity
            onPress={handleSave}
            className='bg-secondary py-3 rounded-lg items-center'
          >
            <Text className='text-white font-bold text-lg'>Save</Text>
          </TouchableOpacity>

        </View>
      </View>
    </SafeAreaView>
  );
}
