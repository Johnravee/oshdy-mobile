/**
 * @file menu-details.tsx
 * @component MenuDetailsForm
 * @description
 * This component allows users to select their event menu items—one from each category.
 * Users can choose dishes from predefined options such as pasta, vegetables, chicken,
 * pork, beef, fillet (fish), dessert, and drinks. Each selection updates the corresponding
 * field in the shared `ReservationData` state.
 *
 * The form ensures a personalized and streamlined experience for both new and returning
 * users by letting them pick their preferred dishes in advance.
 *
 * @props {MenuSelection} data - The current selected menu items.
 * @props {React.Dispatch<React.SetStateAction<ReservationData>>} setReservationData -
 *   Function to update the reservation state with selected menu items.
 *
 * @usage
 * Typically used after guest details and before review/confirmation. It ensures that all
 * food categories are represented in the reservation to support accurate catering preparation.
 *
 * @see guest-details.tsx for expected guest count.
 * @see event-details.tsx for event-specific configurations.
 * @see personal-info.tsx for user identity input.
 * 
 * @tip Ensure that users select only one item from each category to avoid overbooking resources.
 * 
 * @author John Rave Mimay
 * @created 2025-06-15
 */


import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { BeefMenu, ChickenMenu, Dessert, Drinks, FishMenu, PastaMenu, PorkMenu, VegetableMenu } from '@/constants/EventData';
import Dropdown from '../ui/dropdown';
import { MenuSelection, ReservationData, Menu } from '@/types/reservation-types';

export default function MenuDetailsForm({
  data,
  setReservationData,
}: {
  data: MenuSelection;
  setReservationData: React.Dispatch<React.SetStateAction<ReservationData>>;
}) {
  return (
    <ScrollView>
        <View className="h-full w-full flex justify-evenly gap-5">
    
    <Text className="text-dark font-bold text-2xl">Menu (Pick One)</Text>
    <Text className="text-sm text-gray-500 w-[90%]">
      Welcome back! As a returning guest, feel free to select your preferred dishes—one from each category. If you have favorite items from a previous event, you’re welcome to choose them again or try something new. Make sure your selections match your current event's preferences.
    </Text>

    {/* 🍗 Main Course */}
    <Text className="text-lg font-semibold text-gray-700 mt-3">Main Course</Text>

    <View className="relative bg-white mt-4">
      <Text className="absolute -top-2 left-6 bg-white px-1 text-sm text-zinc-500 z-10">
        Pasta
      </Text>
      <Dropdown<Menu>
        value={data.pasta}
        items={PastaMenu}
        onSelect={(selected) =>
          setReservationData((prev) => ({
            ...prev,
            menu: { ...prev.menu, pasta: selected.title },
          }))
        }
        labelExtractor={(item) => item.title}
      />
    </View>

    <View className="relative bg-white mt-4">
      <Text className="absolute -top-2 left-6 bg-white px-1 text-sm text-zinc-500 z-10">
        Vegetables
      </Text>
      <Dropdown<Menu>
        value={data.vegetable}
        items={VegetableMenu}
        onSelect={(selected) =>
          setReservationData((prev) => ({
            ...prev,
            menu: { ...prev.menu, vegetable: selected.title },
          }))
        }
        labelExtractor={(item) => item.title}
      />
    </View>

    <View className="relative bg-white mt-4">
      <Text className="absolute -top-2 left-6 bg-white px-1 text-sm text-zinc-500 z-10">
        Chicken
      </Text>
      <Dropdown<Menu>
        value={data.chicken}
        items={ChickenMenu}
        onSelect={(selected) =>
          setReservationData((prev) => ({
            ...prev,
            menu: { ...prev.menu, chicken: selected.title },
          }))
        }
        labelExtractor={(item) => item.title}
      />
    </View>

    <View className="relative bg-white mt-4">
      <Text className="absolute -top-2 left-6 bg-white px-1 text-sm text-zinc-500 z-10">
        Pork
      </Text>
      <Dropdown<Menu>
        value={data.pork}
        items={PorkMenu}
        onSelect={(selected) =>
          setReservationData((prev) => ({
            ...prev,
            menu: { ...prev.menu, pork: selected.title },
          }))
        }
        labelExtractor={(item) => item.title}
      />
    </View>

    <View className="relative bg-white mt-4">
      <Text className="absolute -top-2 left-6 bg-white px-1 text-sm text-zinc-500 z-10">
        Beef
      </Text>
      <Dropdown<Menu>
        value={data.beef}
        items={BeefMenu}
        onSelect={(selected) =>
          setReservationData((prev) => ({
            ...prev,
            menu: { ...prev.menu, beef: selected.title },
          })) 
        }
        labelExtractor={(item) => item.title}
      />
    </View>

    <View className="relative bg-white mt-4">
      <Text className="absolute -top-2 left-6 bg-white px-1 text-sm text-zinc-500 z-10">
        Fillet
      </Text>
      <Dropdown<Menu>
        value={data.fillet}
        items={FishMenu}
        onSelect={(selected) =>
          setReservationData((prev) => ({
            ...prev,
            menu: { ...prev.menu, fillet: selected.title },
          }))
        }
        labelExtractor={(item) => item.title}
      />
    </View>

    {/* 🍰 Dessert */}
    <Text className="text-lg font-semibold text-gray-700 px-4 mt-6">Dessert</Text>

    <View className="relative bg-white mt-4">
      <Text className="absolute -top-2 left-6 bg-white px-1 text-sm text-zinc-500 z-10">
        Dessert
      </Text>
      <Dropdown<Menu>
        value={data.dessert}
        items={Dessert}
        onSelect={(selected) =>
          setReservationData((prev) => ({
            ...prev,
            menu: { ...prev.menu, dessert: selected.title },
          }))
        }
        labelExtractor={(item) => item.title}
      />
    </View>

    {/* 🥤 Drinks */}
    <Text className="text-lg font-semibold text-gray-700 px-4 mt-6">Drinks</Text>

    <View className="relative bg-white mt-4 mb-8">
      <Text className="absolute -top-2 left-6 bg-white px-1 text-sm text-zinc-500 z-10">
        Juice Drinks
      </Text>
      <Dropdown<Menu>
        value={data.juice}
        items={Drinks}
        onSelect={(selected) =>
          setReservationData((prev) => ({
            ...prev,
            menu: { ...prev.menu, juice: selected.title },
          }))
        }
        labelExtractor={(item) => item.title}
      />
    </View>
  </View>
    </ScrollView>
  )
}