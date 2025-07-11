import React from 'react';
import { View, Text, ImageBackground } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { IMAGES } from '@/constants/Images';

interface StatusBox {
  label: string;
  count: number;
}

interface StatusSummaryProps {
  topStats: [StatusBox, StatusBox];
  bottomStat: StatusBox;
}

export default function StatusSummary({ topStats, bottomStat }: StatusSummaryProps) {
  const topIcons: (keyof typeof FontAwesome.glyphMap)[] = ['clock-o', 'times-circle'];
  const topBackgrounds = [IMAGES.yellowcardbg, IMAGES.yellowredcardbg];
  const bottomIcon: keyof typeof FontAwesome.glyphMap = 'list-alt';

  return (
    <View className="w-full px-4 space-y-4">
      {/* Top Two Boxes */}
      <View className="flex-row flex-wrap justify-between gap-x-3 gap-y-4">
        {topStats.map((item, index) => (
          <View
            key={index}
            className="flex-1 min-w-[48%] rounded-xl overflow-hidden shadow aspect-[3/2]"
          >
            <ImageBackground
              source={topBackgrounds[index]}
              resizeMode="cover"
              imageStyle={{ borderRadius: 16 }}
              className="w-full h-full"
            >
              <View className="p-4 rounded-xl justify-between flex-1">
                <FontAwesome name={topIcons[index]} size={40} color="#ffffff" />
                <View className="flex-row justify-between items-end">
                  <Text className="text-[15px] font-semibold text-white">{item.label}</Text>
                  <Text className="text-4xl font-extrabold text-white">{item.count}</Text>
                </View>
              </View>
            </ImageBackground>
          </View>
        ))}
      </View>

      {/* Bottom Full-Width Stat Box */}
      <View className="w-full rounded-xl overflow-hidden shadow mt-3">
        <ImageBackground
          source={IMAGES.tealroundedcardbg}
          resizeMode="cover"
          imageStyle={{ borderRadius: 16 }}
          className="w-full"
        >
          <View className="p-5 rounded-xl justify-between space-y-4">
            <FontAwesome name={bottomIcon} size={26} color="#fff" />
            <View className="flex-row justify-between items-end">
              <Text className="text-base font-bold text-white">{bottomStat.label}</Text>
              <Text className="text-4xl font-extrabold text-white">{bottomStat.count}</Text>
            </View>
          </View>
        </ImageBackground>
      </View>
    </View>
  );
}
