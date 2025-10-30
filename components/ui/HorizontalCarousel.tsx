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
  seeAllRoute: any;
  loading?: boolean;
}

export default function HorizontalCarousel({
  title,
  items,
  imageKey,
  titleKey,
  seeAllRoute,
  loading,
}: CarouselProps) {
  const router = useRouter();
  const isLoading = Boolean(loading);
  const isEmpty = !isLoading && (!items || items.length === 0);
  
  return (
    <SafeAreaView className="flex-1 px-4 py-6 bg-background">
      {/* Header */}
      <View className="flex-row justify-between items-center px-3 mb-4">
        <Text className="text-xl font-bold text-gray-800">{title}</Text>
        {seeAllRoute && (
          loading ? (
            <View className="h-5 w-20 rounded bg-gray-200" />
          ) : (
            <TouchableOpacity onPress={() => router.push(seeAllRoute)}>
              <Text className="text-sm font-medium text-[#2E3A8C]">See All</Text>
            </TouchableOpacity>
          )
        )}
      </View>

      {/* Horizontal Carousel */}
      {isLoading ? (
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={[1, 2, 3]}
          keyExtractor={(item) => `sk-${item}`}
          contentContainerStyle={{ gap: 12 }}
          renderItem={() => (
            <View className="w-64 rounded-3xl overflow-hidden shadow-md">
              <View className="w-full aspect-[4/3] bg-gray-200 animate-pulse rounded-3xl" />
            </View>
          )}
        />
      ) : isEmpty ? (
        <View className="items-center justify-center py-8 w-full">
          <Text className="text-gray-400 text-base">No items to display.</Text>
        </View>
      ) : (
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
      )}
    </SafeAreaView>
  );
}
