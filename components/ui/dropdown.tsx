import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';

type DropdownProps<T> = {
  items: T[];
  onSelect: (selectedItem: T) => void;
  labelExtractor: (item: T) => string;
  placeholder?: string;
  value?: string; // the selected value's label
};

export default function Dropdown<T>({
  items,
  onSelect,
  labelExtractor,
  placeholder = 'Select an option',
  value,
}: DropdownProps<T>) {
  // Memoize finding the default item so it doesn't recalc on every render
  const defaultItem = useMemo(() => {
    if (value == null) return undefined;
    // Find the item whose label matches the given value
    return items.find((item) => labelExtractor(item) === value);
  }, [value, items, labelExtractor]);

  return (
    <View>
      <SelectDropdown
        data={items}
        onSelect={onSelect}
        defaultValue={defaultItem}
        renderButton={(selectedItem?: T) => (
          <View className="p-3 border border-zinc-300 rounded-lg bg-white">
            <Text
              className={`text-base ${
                selectedItem ? 'text-zinc-800' : 'text-zinc-500'
              }`}
            >
              {selectedItem
                ? labelExtractor(selectedItem)
                : placeholder}
            </Text>
          </View>
        )}
        renderItem={(item: T, index: number, isSelected: boolean) => (
          <View
            key={index}
            className={`p-3 ${isSelected ? 'bg-zinc-100' : 'bg-white'}`}
          >
            <Text className="text-base text-zinc-600 font-medium">
              {labelExtractor(item)}
            </Text>
          </View>
        )}
        dropdownStyle={{
          borderRadius: 8,
        }}
      />
    </View>
  );
}
