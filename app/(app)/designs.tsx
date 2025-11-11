import BackButton from '@/components/ui/back-button';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, Animated, Pressable, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomModal from '@/components/ui/custom-modal';

const designItems = [
  { id: '1', title: 'Kiddie Birthday', image: require('@/assets/images/designs/design1.jpg') },
  { id: '2', title: 'Kiddie Birthday', image: require('@/assets/images/designs/design2.jpg') },
  { id: '3', title: 'Kiddie Birthday', image: require('@/assets/images/designs/design3.jpg') },
  { id: '4', title: 'Kiddie Birthday', image: require('@/assets/images/designs/design4.jpg') },
  { id: '5', title: 'Wedding', image: require('@/assets/images/designs/design5.jpg') },
  { id: '6', title: 'Wedding', image: require('@/assets/images/designs/design6.jpg') },
  { id: '7', title: 'Wedding', image: require('@/assets/images/designs/design7.jpg') },
  { id: '8', title: 'Wedding', image: require('@/assets/images/designs/design8.jpg') },
  { id: '9', title: 'Debut', image: require('@/assets/images/designs/design10.jpg') },
  { id: '10', title: 'Debut', image: require('@/assets/images/designs/design11.jpg') },
  { id: '11', title: 'Debut', image: require('@/assets/images/designs/design12.jpg') },
  { id: '12', title: 'Debut', image: require('@/assets/images/designs/design13.jpg') },
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
        backgroundColor: '#e5e7eb', // Tailwind gray-200
      }}
    />
  );
};

const DesignCard = ({ item, onPress }: { item: { id: string; title: string; image: any }; onPress: () => void }) => {
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
          source={item.image}
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

export default function Designs() {
  const [selected, setSelected] = useState<{ id: string; title: string; image: any } | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <SafeAreaView className="flex-1 bg-white px-4 pt-6">
      <BackButton variant='dark' />
      <Text className="text-3xl font-extrabold text-gray-800 mb-2">Event Designs</Text>
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
          <DesignCard
            item={item}
            onPress={() => {
              setSelected(item);
              setModalVisible(true);
            }}
          />
        )}
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
                      source={selected.image}
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
