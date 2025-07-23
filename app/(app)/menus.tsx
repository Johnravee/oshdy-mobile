import BackButton from '@/components/ui/back-button';
import React from 'react';
import { View, Text, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const menuItems = [
  {
    id: '1',
    title: 'Classic Buffet',
    image: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092',
  },
  {
    id: '2',
    title: 'Elegant Setup',
    image: 'https://images.unsplash.com/photo-1555992336-cbf8f3f32b35',
  },
  {
    id: '3',
    title: 'Outdoor Dining',
    image: 'https://images.unsplash.com/photo-1604147706288-9c1b3c43b27b',
  },
  {
    id: '4',
    title: 'Dessert Corner',
    image: 'https://images.unsplash.com/photo-1600891964099-6d012d7f87aa',
  },
];

export default function Menus() {
  return (
    <SafeAreaView className="flex-1 bg-white px-4 pt-6">
      <BackButton variant='dark' />
      <Text className="text-3xl font-extrabold text-gray-800 mb-2">🍽️ Our Menus</Text>
      <Text className="text-gray-500 text-base mb-5">Hand-picked dishes for every occasion.</Text>

      <FlatList
        data={menuItems}
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
