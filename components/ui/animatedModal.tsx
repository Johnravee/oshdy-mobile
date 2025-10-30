// components/ui/AnimatedModal.tsx
import React from 'react';
import { Modal, View, Text, Pressable, TouchableWithoutFeedback } from 'react-native';
import LottieView from 'lottie-react-native';
import { FontAwesome } from '@expo/vector-icons';

interface AnimatedModalProps {
  visible: boolean;
  onClose?: () => void;
  title: string;
  description: string;
  animation: any;
  buttonText: string;
  buttonColor?: string;
  onButtonPress: () => void;
  dismissable?: boolean;
}

export default function AnimatedModal({
  visible,
  onClose = () => {},
  title,
  description,
  animation,
  buttonText,
  buttonColor = '#2563EB',
  onButtonPress,
  dismissable = true,
}: AnimatedModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={dismissable ? onClose : () => {}}
    >
      <TouchableWithoutFeedback onPress={dismissable ? onClose : undefined}>
        <View className="flex-1 justify-center items-center bg-black/50">
          <TouchableWithoutFeedback>
            <View className="bg-white rounded-2xl p-5 w-11/12 items-center">
              {/* Close button top-right */}
              <Pressable
                onPress={dismissable ? onClose : undefined}
                className="absolute right-4 top-4 z-20 p-2 rounded-full"
                hitSlop={10}
              >
                <FontAwesome name="close" size={18} color="#374151" />
              </Pressable>
              <LottieView
                source={animation}
                autoPlay
                loop={false}
                style={{ width: 150, height: 150 }}
              />
              <Text className="text-2xl font-bold mt-4 mb-2 text-center">{title}</Text>
              <Text className="text-base text-gray-600 mb-5 text-center">{description}</Text>
              <Pressable
                onPress={onButtonPress}
                className="mt-4 px-5 py-3 rounded-lg"
                style={{ backgroundColor: buttonColor }}
              >
                <Text className="text-white text-base font-semibold">{buttonText}</Text>
              </Pressable>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
