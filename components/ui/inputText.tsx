import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, Animated, TextInputProps } from 'react-native';

interface FancyInputProps extends TextInputProps {
  label: string;
}

function InputComponent(props: FancyInputProps) {
  const { label, value, onChangeText, secureTextEntry = false, ...rest } = props;

  const [isFocused, setIsFocused] = useState(false);
  const animatedLabel = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedLabel, {
      toValue: isFocused || !!value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value]);

  const labelStyle = {
    position: 'absolute' as const,
    left: 16,
    top: animatedLabel.interpolate({
      inputRange: [0, 1],
      outputRange: [18, -8],
    }),
    fontSize: animatedLabel.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    color: isFocused ? '#7c3aed' : '#71717a', // violet-500 / zinc-500
    backgroundColor: 'white',
    paddingHorizontal: 4,
  };

  return (
    <View className="relative mt-5">
      <View className="border border-zinc-300 bg-white rounded-xl px-4 pt-5 pb-5  shadow-sm">
        <Animated.Text style={labelStyle}>{label}</Animated.Text>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={secureTextEntry}
          className="h-10 text-base text-black "
          {...rest}
        />
      </View>
    </View>
  );
}

export default InputComponent;
