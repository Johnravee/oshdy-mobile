import { View, Text, ScrollView } from 'react-native'
import React, { useEffect, useMemo } from 'react'
import Spinner from '../ui/spinner';
import Dropdown from '../ui/dropdown';
import { MenuSelection, ReservationData, Menu } from '@/types/reservation-types';
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
  const filterByCategory = (category: string) => {
    return pgmtData.menu
      .filter((item) => item.category === category)
  };

  const PastaMenu = useMemo(() => filterByCategory('pasta'), [pgmtData.menu]);
  const VegetableMenu = useMemo(() => filterByCategory('vegetable'), [pgmtData.menu]);
  const ChickenMenu = useMemo(() => filterByCategory('chicken'), [pgmtData.menu]);
  const PorkMenu = useMemo(() => filterByCategory('pork'), [pgmtData.menu]);
  const BeefMenu = useMemo(() => filterByCategory('beef'), [pgmtData.menu]);
  const FishMenu = useMemo(() => filterByCategory('fish'), [pgmtData.menu]);
  const Dessert = useMemo(() => filterByCategory('dessert'), [pgmtData.menu]);
  const Drinks = useMemo(() => filterByCategory('drinks'), [pgmtData.menu]);

  if(pgmtLoading || !pgmtData) return <Spinner />;

  return (
    <ScrollView>
      <View className="h-full w-full flex justify-evenly gap-5">
        <Text className="text-dark font-bold text-2xl">Menu (Pick One)</Text>
        <Text className="text-sm text-gray-500 w-[90%]">
          Welcome back! Select your preferred dishes—one from each category. Favorites from past events are welcome!
        </Text>

        {/* 🧺 Categories */}
        {[
          { label: 'Pasta', key: 'pasta', items: PastaMenu },
          { label: 'Vegetables', key: 'vegetable', items: VegetableMenu },
          { label: 'Chicken', key: 'chicken', items: ChickenMenu },
          { label: 'Pork', key: 'pork', items: PorkMenu },
          { label: 'Beef', key: 'beef', items: BeefMenu },
          { label: 'Fillet', key: 'fillet', items: FishMenu },
          { label: 'Dessert', key: 'dessert', items: Dessert },
          { label: 'Juice Drinks', key: 'juice', items: Drinks },
        ].map(({ label, key, items }) => (
          <View className="relative bg-white mt-4" key={key}>
            <Text className="absolute -top-2 left-6 bg-white px-1 text-sm text-zinc-500 z-10">
              {label}
            </Text>
            <Dropdown<Menu>
              value={data[key as keyof MenuSelection]}
              items={items}
              onSelect={(selected) =>
                setReservationData((prev) => ({
                  ...prev,
                  menu: {
                    ...prev.menu,
                    [key]: selected.name,
                  },
                }))
              }
              labelExtractor={(item) => item.name}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
