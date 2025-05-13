import { View, Text, Image } from 'react-native';
import React from 'react';


interface AvatarProps {
  avatarUrl: string; 
  name: string;        
}

export default function Avatar({ avatarUrl, name }: AvatarProps) {
  return (
    <View className=' flex justify-center items-center gap-3'>
      <Image
        source={{ uri: avatarUrl }}
        className='h-32 w-32 rounded-full'
      />
      <Text className='font-bold text-white text-xl'>
        {name}
      </Text>
      <Text className='font-normal text-base text-white text-center'>Guest</Text>
    </View>
  );
}
