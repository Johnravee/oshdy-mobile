import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import { FontAwesome } from '@expo/vector-icons';
import { useAuthContext } from '@/context/AuthContext';
import { IMAGES } from '@/constants/Images';


export default function DashboardHeader() {
  const { session } = useAuthContext();
  const avatarUrl = session?.user?.user_metadata?.avatar_url;
  const router = useRouter();

  const isValidAvatar = avatarUrl && avatarUrl.startsWith('http');

  return (
    <View className="w-full rounded-b-3xl overflow-hidden">
      {/* Header Top: Logo, Title, Avatar */}
      <View className="px-4 pt-10 pb-4 flex-row justify-between items-center z-10 bg-secondary">
        <View className="flex-row items-center gap-2">
          <Image
            source={IMAGES.oshdyLogo}
            className="w-12 h-12 rounded-full"
            resizeMode="contain"
          />
          <Text className="text-white text-2xl font-bold">Dashboard</Text>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go to profile"
          onPress={() => router.push('/(tabs)/more')}
          className="flex-row items-center gap-3"
        >
          {isValidAvatar ? (
            <Image
              source={{ uri: avatarUrl }}
              className="w-8 h-8 rounded-full border border-white"
            />
          ) : (
            <View className="w-8 h-8 rounded-full bg-white items-center justify-center">
              <FontAwesome name="user" size={18} color="#999" />
            </View>
          )}
        </Pressable>
      </View>

      {/* Wave SVG at Bottom */}
      <Svg
        width="100%"
        height="80"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <Path
          fill="#2E3A8C"
          d="M0,96L21.8,117.3C43.6,139,87,181,131,202.7C174.5,224,218,224,262,192C305.5,160,349,96,393,96C436.4,96,480,160,524,165.3C567.3,171,611,117,655,96C698.2,75,742,85,785,106.7C829.1,128,873,160,916,192C960,224,1004,256,1047,250.7C1090.9,245,1135,203,1178,165.3C1221.8,128,1265,96,1309,85.3C1352.7,75,1396,85,1418,90.7L1440,96L1440,0L0,0Z"
        />
      </Svg>
    </View>
  );
}
