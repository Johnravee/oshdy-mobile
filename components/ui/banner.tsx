import React from 'react';
import { View, Text, ImageBackground, Dimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { IMAGES } from '@/constants/Images';

interface BannerProps {
  message: string;
  icon?: keyof typeof FontAwesome.glyphMap;
  bgImage?: any;
}

export default function Banner({
  message,
  icon = 'cutlery',
  bgImage = IMAGES.lightblue, 
}: BannerProps) {
  const screenWidth = Dimensions.get('window').width;
  const bannerHeight = screenWidth * 0.42;

  return (
    <View className="w-full px-4">
      <ImageBackground
        source={bgImage}
        resizeMode="cover"
        imageStyle={{ borderRadius: 16 }}
        style={{
          width: '100%',
          height: bannerHeight,
          borderRadius: 16,
          overflow: 'hidden',
        }}
      >
        <View className="flex-1 p-5 justify-start rounded-2xl">
          {/* Icon */}
          <FontAwesome name={icon} size={26} color="#fff" />

          {/* Message */}
          <Text className="text-white text-2xl font-extrabold mt-3 leading-tight">
            {message}
          </Text>

          {/* Optional CTA Subtitle */}
          <Text className="text-white text-sm font-medium mt-1 opacity-80">
            Taste the Difference. Celebrate with Us.
          </Text>
        </View>
      </ImageBackground>
    </View>
  );
}
