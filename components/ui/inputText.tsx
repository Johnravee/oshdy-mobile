import React from 'react';
import { View, TextInput, Text, TextInputProps } from 'react-native';

interface FancyInputProps extends TextInputProps {
  label: string;
}

export default function InputComponent(props: FancyInputProps) {
  const { label, value, onChangeText, secureTextEntry = false, ...rest } = props;

  return (
    <View className="relative mt-5 bg-transparent">
      
      <View className="p-3 border border-zinc-300 rounded-lg bg-white">
      <Text className="absolute -top-2 left-5 bg-white px-1 text-sm font-regular text-zinc-500 z-10 ">
          {label}
        </Text>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          className="text-base text-zinc-800 z-50"
          {...rest}
        />
      </View>
    </View>
  );
}
