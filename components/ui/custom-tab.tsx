import React, { useState } from 'react';
import { View, TouchableOpacity, } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';




const FloatingTabBar = ({ onTabPress }: any) => {
  const router = useRouter();

  const tabs = [
  { key: 'send', icon: 'send' },
  { key: 'bell', icon: 'bell' },
  { key: 'power', icon: 'power-off' },
  { key: 'search', icon: 'question' },
  { key: 'profile', icon: 'user' },
];

  const [selectedTab, setSelectedTab] = useState('power'); // default selected tab

  const handlePress = async (key: string) => {
    setSelectedTab(key);
    onTabPress(key);
    
    if(key === 'power') {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('Error signing out:', error.message);
        return
      }
      console.log("Logging out")
      console.log("Logged out successfully")
    }

      if(key === "profile"){
        router.push('/(app)/profile')
      }

      
  };

   

  return (
    <View className="w-full flex-row justify-around items-center mt-4 h-auto bg-none mb-5 rounded-xl">
      {tabs.map((tab) => {
        const isActive = selectedTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            onPress={() => handlePress(tab.key)}
            className={`flex-1 items-center p-2 rounded-full ${
              isActive ? 'bg-[#33333]' : ''
            }`}
          >
            <FontAwesome
              name={tab.icon as keyof typeof FontAwesome.glyphMap}
              size={24}
              color={isActive ? '#1e40af' : '#333333'}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default FloatingTabBar;