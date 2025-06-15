/**
 * @file guest-details.tsx
 * @component GuestDetailsForm
 * @description
 * This component captures the number of guests expected for the event, including the
 * total number of attendees (Pax), as well as a breakdown between adults and kids.
 * This information is important for accurate event planning and resource allocation.
 *
 * The input values are stored in the shared `ReservationData` state under the `guests` key.
 *
 * @props {GuestDetails} data - The current guest information from the reservation state.
 * @props {React.Dispatch<React.SetStateAction<ReservationData>>} setReservationData -
 *   State setter to update the reservation form with new guest values.
 *
 * @usage
 * This component is typically used in the middle steps of a multi-step reservation
 * process following `PersonalInfoForm` and `EventDetailsForm`. The guest count influences 
 * decisions for seating, catering, and package costs.
 *
 * @see personal-info.tsx for user identity input.
 * @see event-details.tsx for event-specific configurations.
 * 
 * @tip Pax (total guests) should match the sum of adults and kids to avoid inconsistencies.
 * 
 * @author John Rave Mimay
 * @created 2025-06-15
 */



import { View, Text } from 'react-native'
import React from 'react'
import {GuestDetails, ReservationData } from '@/types/reservation-types';
import InputComponent from '../ui/inputText';

export default function GuestDetailsForm({
  data,
  setReservationData,
}: {
  data: GuestDetails;
  setReservationData: React.Dispatch<React.SetStateAction<ReservationData>>;
}) {
  return (
    <>
        <View className="h-full w-screen flex justify-evenly gap-5 ">
          <Text className="text-dark font-bold text-2xl">Guest Details</Text>
              <Text className="text-sm text-gray-500 w-full ">
                Please enter the number of expected guests. This helps us plan your event more accurately and ensure enough food and seating.
              </Text>
            <View className='bg-white w-[90%]'>
            
                <InputComponent
                label="Pax"
                value={data.pax}
                placeholderTextColor="#999"
                className='w-full'
                onChangeText={(text) =>
                  setReservationData((prev) => ({
                    ...prev,
                    guests: { ...prev.guests, pax: text },
                  }))
                }
                keyboardType="phone-pad"
                placeholder='e.g. 100'
              />

              <InputComponent
                label="Number of Adults"
                value={data.adults}
                placeholderTextColor="#999"
                className='w-full'
                onChangeText={(text) =>
                  setReservationData((prev) => ({
                    ...prev,
                    guests: { ...prev.guests, adults: text },
                  }))
                }
                keyboardType="phone-pad"
                placeholder='e.g. 50'
              />

              <InputComponent
                label="Number of Kids"
                value={data.kids}
                placeholderTextColor="#999"
                className='w-full'
                onChangeText={(text) =>
                  setReservationData((prev) => ({
                    ...prev,
                    guests: { ...prev.guests, kids: text },
                  }))
                }
                keyboardType="phone-pad"
                placeholder='e.g. 50'
              />
            
            <Text className="text-xs text-gray-400 w-full py-5 text-center">
              Tip: Total Pax should equal the number of Adults + Kids.
            </Text>
            </View>
           </View> 
    </>
  )
}