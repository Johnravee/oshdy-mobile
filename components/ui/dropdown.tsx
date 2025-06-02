import React from 'react';
import { View, Text } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';

type DropdownProps<T> = {
  items: T[];
  onSelect: (selectedItem: T) => void;
  labelExtractor: (item: T) => string;
  placeholder?: string;
};

export default function Dropdown<T>({
  items,
  onSelect,
  labelExtractor,
  placeholder = 'Select an option',
}: DropdownProps<T>) {
  return (
    <View>
      <SelectDropdown
        data={items}
        onSelect={onSelect}
        renderButton={(selectedItem?: T) => (
          <View
            style={{
              padding: 12,
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 8,
              backgroundColor: '#fff',
            }}
          >
            <Text className='text-md text-zinc-600'>
              {selectedItem ? labelExtractor(selectedItem) : placeholder}
            </Text>
          </View>
        )}
        renderItem={(item: T, index: number, isSelected: boolean) => (
          <View
            key={index}
            style={{
              padding: 12,
              backgroundColor: isSelected ? '#eee' : '#fff',
            }}
          >
            <Text className='font-semibold text-md text-dark'>{labelExtractor(item)}</Text>
          </View>
        )}
        dropdownStyle={{
          borderRadius: 8,
        }}
      />
    </View>
  );
}
