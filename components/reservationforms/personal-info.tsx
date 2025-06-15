/**
 * @file personal-info.tsx
 * @component PersonalInfoForm
 * @description
 * This component renders the "Personal Information" step of the reservation process.
 * It collects the user's name, email address, contact number, and physical address.
 * All inputs are synced in real-time with the shared reservation state via `setReservationData`.
 *
 * @props {PersonalInfo} data - The current personal information from the reservation state.
 * @props {React.Dispatch<React.SetStateAction<ReservationData>>} setReservationData -
 *   A state setter function to update the global reservation state object.
 *
 * @usage
 * Used as the first step in the reservation flow to gather contact and identity information.
 * Typically placed inside a multi-step form component like `ProgressStep`.
 *
 * @author John Rave Mimay
 * @created 2025-06-15
 */



import { View, Text } from 'react-native';
import React from 'react';
import InputComponent from '../ui/inputText';
import { PersonalInfo, ReservationData } from '@/types/reservation-types';

export default function PersonalInfoForm({
  data,
  setReservationData,
}: {
  data: PersonalInfo;
  setReservationData: React.Dispatch<React.SetStateAction<ReservationData>>;
}) {
  return (
    <View className="h-full w-screen flex justify-evenly gap-5">
      <Text className="text-dark font-bold text-2xl">Personal Info</Text>
      <Text className="text-sm text-gray-500 w-[90%] leading-relaxed">
        If you’ve booked with us before, please review your personal details carefully. Ensure your name, contact number, and address are current — especially if your event will be held at a different location or under a new name. Keeping your information up to date helps us provide a smoother experience.
      </Text>

      <View className="bg-white w-[90%]">
        <InputComponent
          label="Name"
          value={data.name}
          placeholderTextColor="#999"
          className="w-full"
          onChangeText={(text) =>
            setReservationData((prev) => ({
              ...prev,
              personal: { ...prev.personal, name: text },
            }))
          }
        />
      </View>

      <View className="bg-white w-[90%]">
        <InputComponent
          label="Email address"
          value={data.email}
          placeholderTextColor="#999"
          className="w-full"
          onChangeText={(text) =>
            setReservationData((prev) => ({
              ...prev,
              personal: { ...prev.personal, email: text },
            }))
          }
        />
      </View>

      <View className="bg-white w-[90%]">
        <InputComponent
          label="Contact No."
          value={data.contact}
          placeholderTextColor="#999"
          className="w-full"
          onChangeText={(text) =>
            setReservationData((prev ) => ({
              ...prev,
              personal: { ...prev.personal, contact: text },
            }))
          }
        />
      </View>

      <View className="bg-white w-[90%]">
        <InputComponent
          label="Address"
          value={data.address}
          multiline
          numberOfLines={10}
          textAlignVertical="top"
          placeholderTextColor="#999"
          className="h-36"
          onChangeText={(text) =>
            setReservationData((prev) => ({
              ...prev,
              personal: { ...prev.personal, address: text },
            }))
          }
        />
      </View>
    </View>
  );
}
