import BackButton from '@/components/ui/back-button';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, Animated, Pressable, TouchableWithoutFeedback, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomModal from '@/components/ui/custom-modal';

const menuItems = [
  { id: '1', title: 'Beef Broccoli', image: require('@/assets/images/menus/menu1.jpg') },
  { id: '2', title: 'Beef with mushrooms sauce', image: require('@/assets/images/menus/menu2.jpg') },
  { id: '3', title: 'Pork honey glazed', image: require('@/assets/images/menus/menu3.jpg') },
  { id: '4', title: 'Pork hamonado', image: require('@/assets/images/menus/menu4.jpg') },
  { id: '5', title: 'Chicken buttered', image: require('@/assets/images/menus/menu5.jpg') },
  { id: '6', title: 'Chicken teriyaki', image: require('@/assets/images/menus/menu6.jpg') },
  { id: '7', title: 'Fish fillet with mushrooms sauce', image: require('@/assets/images/menus/menu7.jpg') },
  { id: '8', title: 'Fish fillet tartar sauce', image: require('@/assets/images/menus/menu8.jpg') },
  { id: '9', title: 'Steam mixed veggies', image: require('@/assets/images/menus/menu9.jpg') },
  { id: '10', title: 'Mixed veggies with quail eggs', image: require('@/assets/images/menus/menu10.jpg') },
  { id: '11', title: 'Tuna creamy carbonara', image: require('@/assets/images/menus/menu11.jpg') },
  { id: '12', title: 'Cheesy macaroni', image: require('@/assets/images/menus/menu12.jpg') },
  { id: '13', title: 'Mango jelly float', image: require('@/assets/images/menus/menu13.jpg') },
  { id: '14', title: 'Coffee jelly', image: require('@/assets/images/menus/menu14.jpg') },
  { id: '15', title: 'Red tea', image: require('@/assets/images/menus/menu15.jpg') },
  { id: '16', title: 'Cucumber lemonade', image: require('@/assets/images/menus/menu16.jpg') },
];

// Reusable pulsing skeleton component
const Skeleton = () => {
  const opacity = useRef(new Animated.Value(0.6)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.6, duration: 700, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);
  return (
    <Animated.View
      style={{
        opacity,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#e5e7eb',
      }}
    />
  );
};

// Accept both local require modules and remote URL strings
const getImageSource = (img: any) => (typeof img === 'string' ? { uri: img } : img);

const MenuCard = ({ item, onPress }: { item: { id: string; title: string; image: any }; onPress: () => void }) => {
  const [loading, setLoading] = useState(true);
  const imageOpacity = useRef(new Animated.Value(0)).current;

  const handleLoadEnd = () => {
    setLoading(false);
    Animated.timing(imageOpacity, { toValue: 1, duration: 250, useNativeDriver: true }).start();
  };

  return (
    <Pressable onPress={onPress} className="flex-1 bg-white rounded-2xl overflow-hidden shadow-md">
      <View className="relative" style={{ height: 128 }}>
        {loading && <Skeleton />}
        <Animated.Image
          source={getImageSource(item.image)}
          resizeMode="cover"
          onLoadStart={() => setLoading(true)}
          onLoadEnd={handleLoadEnd}
          onError={handleLoadEnd}
          style={{ width: '100%', height: '100%', opacity: imageOpacity }}
        />
      </View>
      <View className="p-3">
        <Text className="text-sm font-semibold text-gray-800 text-center">{item.title}</Text>
      </View>
    </Pressable>
  );
};

export default function Menus() {
  const [selected, setSelected] = useState<{ id: string; title: string; image: any } | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const Footer = () => (
    <View className="  px-1 mt-4">
      <View className="h-[1px] bg-gray-200 mb-2" />
      <Text className="text-gray-800 font-semibold mb-1">Note</Text>
      <Text className="text-gray-600 mb-4">
        Additional charges for additional food. Lechon Chop with charge ₱500.00
      </Text>

    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white px-4 pt-6">
      <BackButton variant='dark' />
      <Text className="text-3xl font-extrabold text-gray-800 mb-2">Our Menus</Text>
      <Text className="text-gray-500 text-base mb-5">Hand-picked dishes for every occasion.</Text>

      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={{ gap: 12, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <MenuCard
            item={item}
            onPress={() => {
              setSelected(item);
              setModalVisible(true);
            }}
          />
        )}
        ListFooterComponent={() => <Footer />}
        ListFooterComponentStyle={{ marginTop: 0 }}
      />

      {/* Full-screen image modal */}
      <CustomModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setSelected(null);
        }}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            setModalVisible(false);
            setSelected(null);
          }}
        >
          <View className="flex-1 justify-center items-center bg-black/60">
            <TouchableWithoutFeedback>
              <View className="bg-white rounded-2xl overflow-hidden w-11/12">
                <View style={{ height: 340 }}>
                  {selected && (
                    <Animated.Image
                      source={getImageSource(selected.image)}
                      resizeMode="cover"
                      style={{ width: '100%', height: '100%' }}
                    />
                  )}
                </View>
                <View className="p-4 flex-row items-center justify-between">
                  <Text className="text-lg font-semibold text-gray-800" numberOfLines={1}>
                    {selected?.title}
                  </Text>
                  <Pressable
                    onPress={() => {
                      setModalVisible(false);
                      setSelected(null);
                    }}
                    className="px-4 py-2 rounded-lg bg-primary"
                  >
                    <Text className="text-white font-semibold">Close</Text>
                  </Pressable>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </CustomModal>
    </SafeAreaView>
  );
}
