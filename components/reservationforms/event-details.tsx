/**
 * @file event-details.tsx
 * @component EventDetailsForm
 * @description
 * This component renders the "Event Details" step of the multi-step reservation form
 * for OSHDY Catering Services. It captures details such as event package, theme/motif,
 * celebrant, venue, event date and time, and location.
 * 
 * The component conditionally renders dynamic dropdowns based on the selected package
 * and uses native date/time pickers to enhance user experience. It also ensures all data
 * updates are synced to the shared reservation state.
 * 
 * @props {EventDetails} data - The current event-related values from the reservation state.
 * @props {React.Dispatch<React.SetStateAction<ReservationData>>} setReservationData - 
 *   A state setter to update the global reservation object.
 * 
 * @usage
 * This component is intended to be used within a multi-step booking flow, typically wrapped in a 
 * ProgressStep container and placed after the personal information form.
 * 
 * @see personal-info.tsx for user identity input.
 * 
 * @author John Rave Mimay
 * @created 2025-06-15
 */


import { View, Text, Pressable, Alert } from 'react-native'
import React, {useState} from 'react'
import Dropdown from '../ui/dropdown';
import { EventDetails, EventPackagesType, ReservationData } from '@/types/reservation-types';
import InputComponent from '../ui/inputText';
import {EventPackages, BaptismalTheme, WedingTheme, DebutTheme, KiddieTheme, CorporateTheme, BirthdayTheme} from '@/constants/EventData';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function EventDetailsForm({
  data,
  setReservationData,
}: {
  data: EventDetails;
  setReservationData: React.Dispatch<React.SetStateAction<ReservationData>>;
}) {

    const [alertVisible, setAlertVisible] = useState({datepicker: false, timePicker: false});

  return (
    <>
        <View className="h-full w-screen flex justify-evenly gap-5 ">
          <Text className="text-dark font-bold text-2xl">Event Details</Text>

          <Text className="text-sm text-gray-500 w-[90%] ">
          Welcome back! Please review and update your event details below. Make sure the venue, date, time, and event type reflect your latest plans. If you’re repeating a previous setup, that’s okay — just confirm everything is still accurate to avoid delays in processing your reservation.
          </Text>

          <View className="relative bg-white w-[90%] mt-4">
              <Text className="absolute -top-2 left-6 bg-white px-1 text-sm font-regular text-zinc-500 z-10">
                Event Packages
              </Text>
              <Dropdown<EventPackagesType>
                value={data.pkg}
                items={EventPackages}
                onSelect={(selected) =>
                  setReservationData((prev) => ({
                    ...prev,
                    event: { ...prev.event, pkg: selected.title },
                  }))
                }
                labelExtractor={(item) => item.title}
              />
            </View>

            <View className="relative bg-white w-[90%] mt-4">
  <Text className="absolute -top-2 left-5 bg-white px-1 text-sm font-regular text-zinc-500 z-10">
    Theme/Motif
  </Text>

  {data.pkg ? (
    // ✅ Show the dropdown when pkg is selected
    <Dropdown<EventPackagesType>
      value={data.theme}
      items={
        data.pkg === 'Wedding'
          ? WedingTheme
          : data.pkg === 'Baptismal'
          ? BaptismalTheme
          : data.pkg === 'Debut'
          ? DebutTheme
          : data.pkg === 'Kiddie Party'
          ? KiddieTheme
          : data.pkg === 'Birthday'
          ? BirthdayTheme
          : data.pkg === 'Corporate'
          ? CorporateTheme
          : []
      }
      onSelect={(selected) =>
        setReservationData((prev) => ({
          ...prev,
          event: { ...prev.event, theme: selected.title },
        }))
      }
      labelExtractor={(item) => item.title}
    />
  ) : (
    // ❌ Show alert trigger if pkg is empty
    <Pressable
      onPress={() => {
        Alert.alert('Missing Theme', 'Please select a theme based on your event package');
      }}
    >
      <View className="border border-zinc-300 rounded-md px-4 py-3">
        <Text className="text-zinc-400">Select a theme (choose a package first)</Text>
      </View>
    </Pressable>
  )}
</View>

        <View className="relative bg-white w-[90%] mt-4">
          <InputComponent
                label="Celebrant"
                value={data.celebrant}
                placeholderTextColor="#999"
                className='w-full'
                onChangeText={(text) =>
                  setReservationData((prev) => ({
                    ...prev,
                    event: { ...prev.event, celebrant: text },
                  }))
                }
                placeholder="Leave blank if none or not applicable"
              />
            </View>


            <View className='bg-white w-[90%]'>
                <InputComponent
                label="Venue"
                value={data.venue}
                placeholderTextColor="#999"
                className='w-full'
                onChangeText={(text) =>
                  setReservationData((prev) => ({
                    ...prev,
                    event: { ...prev.event, venue: text },
                  }))
                }
                placeholder='e.g. Coral Vine '
              /> 
            </View>
    
            <View className='bg-white w-[90%]'>
            {
              alertVisible.datepicker && 
              <DateTimePicker 
              mode="date" 
              value={new Date()} 
              display='calendar' 
              onChange={(event, selectedDate) => {
                if (event.type === 'set' && selectedDate) {
                  // User confirmed the date
                  setReservationData((prev) => ({
                    ...prev,
                    event: {
                      ...prev.event,
                      eventDate: selectedDate.toLocaleDateString(),
                    },
                  }));
                }
              
                // In both cases (set or dismiss), close the date picker
                setAlertVisible((prev) => ({
                  ...prev,
                  datepicker: false,
                }));
              }}
              
              
               />
            }

                <InputComponent
                label="Date of Function"
                value={data.eventDate}
                placeholderTextColor="#999"
                className='w-full'
                onPress={() => setAlertVisible((prev) => ({
                  ...prev, datepicker: true,} ))}
                
              />
            </View>

            <View className='bg-white w-[90%]'>

            {
              alertVisible.timePicker && 
              <DateTimePicker 
              mode="time" 
              value={new Date()} 
              display='clock' 
              onChange={(event, selectedTime) => {
                if (event.type === 'set' && selectedTime) {
                  // User confirmed the date
                  setReservationData((prev) => ({
                    ...prev,
                    event: {
                      ...prev.event,
                      eventTime: selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    },
                  }));
                }
              
                // In both cases (set or dismiss), close the date picker
                setAlertVisible((prev) => ({
                  ...prev,
                  timePicker: false,
                }));
              }}
              
              
               />
            }

                <InputComponent
                label="Time"
                value={data.eventTime}
                placeholderTextColor="#999"
                className='w-full'
                onPress={() => setAlertVisible((prev) => ({
                  ...prev, timePicker: true,} ))}
              />
            </View>

            <View className='bg-white w-[90%]'>
                <InputComponent
                  label="Location"
                  value={data.location}
                  multiline
                  numberOfLines={10}
                  textAlignVertical="top"
                  placeholderTextColor="#999"
                  className="h-36"
                  onChangeText={(text) =>
                    setReservationData((prev) => ({
                      ...prev,
                      event: { ...prev.event, location: text },
                    }))
                  }
                  placeholder='e.g. 123 Main St, City, Country'
              />
            </View>

            <Text className="text-xs text-gray-400 w-[90%] text-center">
              Note: If you’ve booked with us before, you can keep details similar to your last event, but updating the date and theme is highly recommended.
            </Text>
          </View>
    </>
  )
}