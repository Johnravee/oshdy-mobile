import BackButton from '@/components/ui/back-button';
import React from 'react';
import { View, Text, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const designItems = [
  {
    id: '1',
    title: 'Rustic Garden',
    image: 'https://images.unsplash.com/photo-1600628422019-6e6b8a1c87b9',
  },
  {
    id: '2',
    title: 'Classic Elegance',
    image: 'https://images.unsplash.com/photo-1573164574237-cb89e39749b4',
  },
  {
    id: '3',
    title: 'Tropical Vibes',
    image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994',
  },
  {
    id: '4',
    title: 'Modern Chic',
    image: 'https://images.unsplash.com/photo-1529253355930-6a8c8731fb3b',
  },
];

export default function Designs() {
  return (
    <SafeAreaView className="flex-1 bg-white px-4 pt-6">
      <BackButton variant='dark' />
      <Text className="text-3xl font-extrabold text-gray-800 mb-2">🎉 Event Designs</Text>
      <Text className="text-gray-500 text-base mb-5">
        Explore our stunning themes for your special events.
      </Text>

      <FlatList
        data={designItems}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={{ gap: 12, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View className="flex-1 bg-white rounded-2xl overflow-hidden shadow-md">
            <Image
              source={{ uri: item.image }}
              className="w-full h-32"
              resizeMode="cover"
            />
            <View className="p-3">
              <Text className="text-sm font-semibold text-gray-800 text-center">
                {item.title}
              </Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
