import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ImageBackground,
  SafeAreaView,
  TouchableOpacity,
  Animated,
  Pressable,
  TouchableWithoutFeedback,
} from 'react-native';
import { useRouter } from 'expo-router';
import CustomModal from '@/components/ui/custom-modal';

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
  const [selected, setSelected] = useState<any | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Helper: accept both local require(...) and remote URL strings
  const getImageSource = (src: any) => (typeof src === 'string' ? { uri: src } : src);

  // Reusable pulsing skeleton
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
          borderRadius: 24,
        }}
      />
    );
  };

  const AnimatedImageBackground = Animated.createAnimatedComponent(ImageBackground);

  const CarouselCard = ({ item }: { item: any }) => {
    const [imgLoading, setImgLoading] = useState(true);
    const opacity = useRef(new Animated.Value(0)).current;

    const onLoadEnd = () => {
      setImgLoading(false);
      Animated.timing(opacity, { toValue: 1, duration: 250, useNativeDriver: true }).start();
    };

    return (
      <Pressable
        onPress={() => {
          setSelected(item);
          setModalVisible(true);
        }}
        className="w-64 rounded-3xl overflow-hidden shadow-md"
      >
        <View className="w-full aspect-[4/3]">
          {imgLoading && <Skeleton />}
          <AnimatedImageBackground
            source={getImageSource(item[imageKey])}
            onLoadStart={() => setImgLoading(true)}
            onLoadEnd={onLoadEnd}
            onError={onLoadEnd}
            style={{ flex: 1, opacity, borderRadius: 24 }}
            imageStyle={{ borderRadius: 24 }}
          >
            <View className="absolute bottom-0 left-0 w-full bg-black/40 px-4 py-3 rounded-b-3xl">
              <Text className="text-white text-base font-semibold">{item[titleKey]}</Text>
            </View>
          </AnimatedImageBackground>
        </View>
      </Pressable>
    );
  };
  
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
              <Skeleton />
              <View className="w-full aspect-[4/3] rounded-3xl" />
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
          renderItem={({ item }) => <CarouselCard item={item} />}
        />
      )}

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
                      source={getImageSource(selected[imageKey])}
                      resizeMode="cover"
                      style={{ width: '100%', height: '100%' }}
                    />
                  )}
                </View>
                <View className="p-4 flex-row items-center justify-between">
                  <Text className="text-lg font-semibold text-gray-800" numberOfLines={1}>
                    {selected?.[titleKey]}
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
