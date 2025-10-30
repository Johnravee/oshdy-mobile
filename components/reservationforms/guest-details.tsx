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



import { View, Text, ScrollView } from 'react-native'
import React, { useEffect } from 'react'
import {GuestDetails, ReservationData } from '@/types/reservation-types';
import InputComponent from '../ui/inputText';

/**
 * @param onValidationChange Optional callback to inform parent if form is valid
 */
export default function GuestDetailsForm({
  data,
  setReservationData,
  onValidationChange,
}: {
  data: GuestDetails;
  setReservationData: React.Dispatch<React.SetStateAction<ReservationData>>;
  onValidationChange?: (valid: boolean) => void;
}) {
  // Convert to numbers for validation
  const pax = parseInt(data.pax || '0', 10);
  const adults = parseInt(data.adults || '0', 10);
  const kids = parseInt(data.kids || '0', 10);
  const sum = adults + kids;

  // Validation logic
  let errorMsg = '';
  let canProceed = true;
  if (pax > 0 && (adults > pax || kids > pax)) {
    errorMsg = 'Adults or kids cannot exceed total Pax.';
    canProceed = false;
  } else if (pax > 0 && sum > pax) {
    errorMsg = 'Sum of adults and kids cannot exceed total Pax.';
    canProceed = false;
  } else if (pax > 0 && sum < pax) {
    errorMsg = 'Sum of adults and kids cannot be less than total Pax.';
    canProceed = false;
  }

  // Inform parent of validation state
  useEffect(() => {
    if (onValidationChange) onValidationChange(canProceed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canProceed, pax, adults, kids]);

  // Helper to clamp value
  const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));

  return (
    <ScrollView>
      <View className="h-full w-full flex justify-evenly gap-5">
        <Text className="text-dark font-bold text-2xl">Guest Details</Text>
        <Text className="text-sm text-gray-500 w-full ">
          Please enter the number of expected guests. This helps us plan your event more accurately and ensure enough food and seating.
        </Text>

        <InputComponent
          label="Pax"
          value={data.pax}
          placeholderTextColor="#999"
          className='w-full'
          onChangeText={(text) => {
            // If pax is reduced, clamp adults/kids
            const newPax = parseInt(text || '0', 10);
            let newAdults = adults;
            let newKids = kids;
            if (newPax > 0) {
              if (adults > newPax) newAdults = newPax;
              if (kids > newPax) newKids = newPax;
              if (newAdults + newKids > newPax) {
                // Reduce kids first
                const overflow = newAdults + newKids - newPax;
                if (newKids >= overflow) newKids -= overflow;
                else newAdults = clamp(newAdults - (overflow - newKids), 0, newPax);
              }
            }
            setReservationData((prev) => ({
              ...prev,
              guests: {
                ...prev.guests,
                pax: text,  
                adults: String(newAdults),
                kids: String(newKids),
              },
            }));
          }}
          keyboardType="phone-pad"
          placeholder='e.g. 100'
        />

        <InputComponent
          label="Number of Adults"
          value={data.adults}
          placeholderTextColor="#999"
          className='w-full'
          onChangeText={(text) => {
            let val = parseInt(text || '0', 10);
            if (val > pax) val = pax;
            // Clamp kids if sum would exceed pax
            let newKids = kids;
            if (val + kids > pax) newKids = clamp(pax - val, 0, pax);
            setReservationData((prev) => ({
              ...prev,
              guests: {
                ...prev.guests,
                adults: String(val),
                kids: String(newKids),
              },
            }));
          }}
          keyboardType="phone-pad"
          placeholder='e.g. 50'
        />

        <InputComponent
          label="Number of Kids"
          value={data.kids}
          placeholderTextColor="#999"
          className='w-full'
          onChangeText={(text) => {
            let val = parseInt(text || '0', 10);
            if (val > pax) val = pax;
            // Clamp adults if sum would exceed pax
            let newAdults = adults;
            if (val + adults > pax) newAdults = clamp(pax - val, 0, pax);
            setReservationData((prev) => ({
              ...prev,
              guests: {
                ...prev.guests,
                kids: String(val),
                adults: String(newAdults),
              },
            }));
          }}
          keyboardType="phone-pad"
          placeholder='e.g. 50'
        />

        {errorMsg ? (
          <Text className="text-xs text-red-500 w-full py-2 text-center">{errorMsg}</Text>
        ) : (
          <Text className="text-xs text-gray-400 w-full py-5 text-center">
            Tip: Total Pax should equal the number of Adults + Kids.
          </Text>
        )}

        {/* Example Next button (parent should use canProceed to enable/disable navigation) */}
        {/*
        <TouchableOpacity
          className={`mt-4 rounded-md py-3 px-4 items-center ${canProceed ? 'bg-blue-600' : 'bg-gray-300'}`}
          disabled={!canProceed}
          onPress={...}
        >
          <Text className="text-white font-bold">Next</Text>
        </TouchableOpacity>
        */}
      </View>
    </ScrollView>
  );
}