import ProgressStep from '@/components/ui/progress-step';
import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';



export default function ReservationStatus() {

  const steps = [
    { label: 'Pending', icon: 'hourglass-half' },        
    { label: 'Confirmed', icon: 'check-circle' },        
    { label: 'Contract Signing', icon: 'pencil-square-o' }, 
    { label: 'Ongoing', icon: 'play-circle' },          
    { label: 'Completed', icon: 'check' },           
  ];

  return (
    <SafeAreaView className="flex-1 bg-white pt-10 px-4">

        {/* Back to Dashboard */}
        <View className="absolute top-5 left-5">
          <Link replace href="/(app)/(tabs)/dashboard">
            <FontAwesome name="arrow-left" size={20} color="#333" />
          </Link>
        </View>

     <ProgressStep steps={steps} activeSteps={0} />
    </SafeAreaView>
  );
}
