import { View, Text, Image } from 'react-native';
import React from 'react';
import { FontAwesome } from '@expo/vector-icons';

interface AvatarProps {
  avatarUrl?: string;

}

export default function Avatar({ avatarUrl }: AvatarProps) {
  const isValidUrl = avatarUrl && avatarUrl.startsWith('http');

  return (
    <View className="flex justify-center items-center gap-3">
      {isValidUrl ? (
        <Image
          source={{ uri: avatarUrl }}
          className="h-32 w-32 rounded-full bg-secondary"
          resizeMode="cover"
        />
      ) : (
        <View className="h-32 w-32 rounded-full bg-secondary items-center justify-center overflow-hidden">
          <FontAwesome name="user" size={64} color="white" />
        </View>
      )}
    </View>
  );
}
