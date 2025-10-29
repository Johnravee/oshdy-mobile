import { View, Text, ScrollView } from 'react-native';
import React, { useMemo } from 'react';
import Spinner from '../ui/spinner';
import Dropdown from '../ui/dropdown';
import { Menu, MenuSelection, ReservationData } from '@/types/reservation-types';
import { usePGMTData } from '@/hooks/useFetchPGMT';

export default function MenuDetailsForm({
  data,
  setReservationData,
}: {
  data: MenuSelection;
  setReservationData: React.Dispatch<React.SetStateAction<ReservationData>>;
}) {
  const { pgmtData, pgmtLoading } = usePGMTData();

  // 🔍 Filter menu by category
  const filterByCategory = (category: string) => pgmtData.menu.filter((item) => item.category === category);

  const PastaMenu = useMemo(() => filterByCategory('Pasta'), [pgmtData.menu]);
  const VegetableMenu = useMemo(() => filterByCategory('Vegetable'), [pgmtData.menu]);
  const ChickenMenu = useMemo(() => filterByCategory('Chicken'), [pgmtData.menu]);
  const PorkMenu = useMemo(() => filterByCategory('Pork'), [pgmtData.menu]);
  const BeefMenu = useMemo(() => filterByCategory('Beef'), [pgmtData.menu]);
  const FilletMenu = useMemo(() => filterByCategory('Fish'), [pgmtData.menu]);
  const DessertMenu = useMemo(() => filterByCategory('Dessert'), [pgmtData.menu]);
  const DrinksMenu = useMemo(() => filterByCategory('Drinks'), [pgmtData.menu]);

  if (pgmtLoading || !pgmtData) return <Spinner />;

  const categories = [
    { label: 'Pasta', key: 'pasta', items: PastaMenu },
    { label: 'Vegetables', key: 'vegetable', items: VegetableMenu },
    { label: 'Chicken', key: 'chicken', items: ChickenMenu },
    { label: 'Pork', key: 'pork', items: PorkMenu },
    { label: 'Beef', key: 'beef', items: BeefMenu },
    { label: 'Fillet', key: 'fillet', items: FilletMenu },
    { label: 'Dessert', key: 'dessert', items: DessertMenu },
    { label: 'Juice Drinks', key: 'juice', items: DrinksMenu }, // ✅ fixed key
  ];

  return (
    <ScrollView>
      <View className="h-full w-full flex justify-evenly gap-5">
        <Text className="text-dark font-bold text-2xl">Menu (Pick One)</Text>
        <Text className="text-sm text-gray-500 w-[90%]">
          Select your preferred dishes — one from each category.
        </Text>

        {categories.map(({ label, key, items }) => (
          <View className="relative bg-white mt-4" key={key}>
            <Text className="absolute -top-2 left-6 bg-white px-1 text-sm text-zinc-500 z-10">
              {label}
            </Text>

            <Dropdown<Menu>
              value={items.find((item) => String(item.id) === data[key])}
              items={items}
              onSelect={(selected) =>
                setReservationData((prev) => {
                  const updatedMenu = { ...prev.menu, [key]: String(selected.id) };

                  // Extract numeric IDs for bulk insert
                  const selectedIds = Object.values(updatedMenu)
                    .filter((v) => v !== '')
                    .map((v) => Number(v));

                  return {
                    ...prev,
                    menu: updatedMenu,
                    selectedMenuIds: selectedIds, //  store IDs
                  };
                })
              }
              labelExtractor={(item) => item.name}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
