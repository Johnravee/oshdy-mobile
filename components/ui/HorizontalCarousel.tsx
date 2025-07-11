import React from 'react';
import {
  View,
  Text,
  FlatList,
  ImageBackground,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';

interface CarouselProps {
  title: string;
  items: any[];
  imageKey: string;
  titleKey: string;
  seeAllRoute?: any;
}

export default function HorizontalCarousel({
  title,
  items,
  imageKey,
  titleKey,
  seeAllRoute,
}: CarouselProps) {
  const router = useRouter();
  
  return (
    <SafeAreaView className="flex-1 px-4 py-6 bg-white">
      {/* Header */}
      <View className="flex-row justify-between items-center px-3 mb-4">
        <Text className="text-xl font-bold text-gray-800">{title}</Text>
        {seeAllRoute && (
          <TouchableOpacity onPress={() => router.push(seeAllRoute)}>
            <Text className="text-sm font-medium text-[#2E3A8C]">See All</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Horizontal Carousel */}
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={items}
        keyExtractor={(item, index) => `${item?.id || index}`}
        contentContainerStyle={{ gap: 12 }}
        renderItem={({ item }) => (
          <View className="w-64 rounded-3xl overflow-hidden shadow-md">
            <ImageBackground
              source={item[imageKey]} 
              className="w-full aspect-[4/3]"
              imageStyle={{ borderRadius: 24 }}
            >
              <View className="absolute bottom-0 left-0 w-full bg-black/40 px-4 py-3 rounded-b-3xl">
                <Text className="text-white text-base font-semibold">
                  {item[titleKey]}
                </Text>
              </View>
            </ImageBackground>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
