// components/ui/checkbox.tsx
import React from 'react';
import { Pressable, View } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

interface CheckboxProps {
  checked: boolean;
  onPress?: () => void;
}

export default function Checkbox({ checked, onPress }: CheckboxProps) {
  return (
    <Pressable onPress={onPress}>
      <View
        className={`h-5 w-5 rounded border border-gray-400 items-center justify-center ${
          checked ? 'bg-blue-600' : 'bg-white'
        }`}
      >
        {checked && <FontAwesome name="check" size={12} color="white" />}
      </View>
    </Pressable>
  );
}
