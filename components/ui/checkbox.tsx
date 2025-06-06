import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

type CheckboxProps = {
  label: string;
  setValue: (label: string, checked: boolean) => void;
};

export default function Checkbox({ label, setValue }: CheckboxProps) {
  const [checked, setChecked] = useState(false);

  const handleToggle = () => {
    const newChecked = !checked;
    setChecked(newChecked);
    setValue(label, newChecked); 
  };

  return (
    <Pressable
      className="flex-row items-center space-x-2"
      onPress={handleToggle}
    >
      <View
        className={`h-5 w-5 border-2 rounded items-center justify-center ${
          checked ? 'bg-blue-600 border-blue-600' : 'border-gray-400'
        }`}
      >
        {checked && <FontAwesome name="check" size={12} color="white" />}
      </View>
      <Text className="text-base text-black px-2">{label}</Text>
    </Pressable>
  );
}
