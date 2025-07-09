import { View, Text, Pressable, Alert, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import Dropdown from '../ui/dropdown';
import InputComponent from '../ui/inputText';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuthContext } from '@/context/AuthContext';

import {
  EventDetails,
  EventPackagesType,
  ReservationData,
} from '@/types/reservation-types';
import { usePGMTData } from '@/hooks/useFetchPGMT';

export default function EventDetailsForm({
  data,
  setReservationData,
}: {
  data: EventDetails;
  setReservationData: React.Dispatch<React.SetStateAction<ReservationData>>;
}) {
  const [alertVisible, setAlertVisible] = useState({
    datepicker: false,
    timePicker: false,
  });

  const { init } = useAuthContext();
  const { pgmtData, pgmtLoading } = usePGMTData();

  const [packages, setPackages] = useState<EventPackagesType[]>([]);
  const [grazing, setGrazing] = useState<EventPackagesType[]>([]);
  const [thememotif, setThememotif] = useState<EventPackagesType[]>([]);

  useEffect(() => {
    if (!init && !pgmtLoading && pgmtData) {
      setPackages(pgmtData.packages);
      setGrazing(pgmtData.grazing);
      setThememotif(pgmtData.thememotif);
    }
  }, [init, pgmtLoading, pgmtData]);

  return (
    <ScrollView>
      <View className="gap-5">
        <Text className="text-dark font-bold text-2xl">Event Details</Text>

        <Text className="text-sm text-gray-500 leading-relaxed">
          Welcome back! Please review and update your event details below. Make
          sure the venue, date, time, and event type reflect your latest plans.
          If you’re repeating a previous setup, that’s okay — just confirm
          everything is still accurate to avoid delays in processing your
          reservation.
        </Text>

        {/* Event Package Dropdown */}
        <View className="relative bg-white mt-4">
          <Text className="absolute -top-2 left-6 bg-white px-1 text-sm font-regular text-zinc-500 z-10">
            Event Packages
          </Text>
          <Dropdown<EventPackagesType>
            value={data.pkg.name}
            items={packages}
            onSelect={(selected) =>
              setReservationData((prev) => ({
                ...prev,
                event: {
                  ...prev.event,
                  pkg: { id: selected.id, name: selected.name },
                },
              }))
            }
            labelExtractor={(item) => item.name}
          />
        </View>

        {/* Theme Dropdown */}
        <View className="relative bg-white mt-4">
          <Text className="absolute -top-2 left-5 bg-white px-1 text-sm font-regular text-zinc-500 z-10">
            Theme/Motif
          </Text>
          {data.pkg?.id ? (
            <Dropdown<EventPackagesType>
              value={data.theme.name}
              items={thememotif.filter((t) => t.package_id === data.pkg.id)}
              onSelect={(selected) =>
                setReservationData((prev) => ({
                  ...prev,
                  event: {
                    ...prev.event,
                    theme: { id: selected.id, name: selected.name },
                  },
                }))
              }
              labelExtractor={(item) => item.name}
            />
          ) : (
            <Pressable
              onPress={() => {
                Alert.alert(
                  'Missing Theme',
                  'Please select a theme based on your event package'
                );
              }}
            >
              <View className="border border-zinc-300 rounded-md px-4 py-3">
                <Text className="text-zinc-400">
                  Select a theme (choose a package first)
                </Text>
              </View>
            </Pressable>
          )}
        </View>

        {/* Celebrant */}
        <InputComponent
          label="Celebrant"
          value={data.celebrant}
          placeholder="Leave blank if none or not applicable"
          placeholderTextColor="#999"
          onChangeText={(text) =>
            setReservationData((prev) => ({
              ...prev,
              event: { ...prev.event, celebrant: text },
            }))
          }
        />

        {/* Venue */}
        <InputComponent
          label="Venue"
          value={data.venue}
          placeholder="e.g. Coral Vine"
          placeholderTextColor="#999"
          onChangeText={(text) =>
            setReservationData((prev) => ({
              ...prev,
              event: { ...prev.event, venue: text },
            }))
          }
        />

        {/* Event Date */}
        {alertVisible.datepicker && (
          <DateTimePicker
            mode="date"
            value={new Date()}
            display="calendar"
            onChange={(event, selectedDate) => {
              if (event.type === 'set' && selectedDate) {
                setReservationData((prev) => ({
                  ...prev,
                  event: {
                    ...prev.event,
                    eventDate: selectedDate.toLocaleDateString(),
                  },
                }));
              }
              setAlertVisible((prev) => ({ ...prev, datepicker: false }));
            }}
          />
        )}
        <InputComponent
          label="Date of Function"
          value={data.eventDate}
          placeholderTextColor="#999"
          onPress={() =>
            setAlertVisible((prev) => ({
              ...prev,
              datepicker: true,
            }))
          }
        />

        {/* Event Time */}
        {alertVisible.timePicker && (
          <DateTimePicker
            mode="time"
            value={new Date()}
            display="clock"
            onChange={(event, selectedTime) => {
              if (event.type === 'set' && selectedTime) {
                setReservationData((prev) => ({
                  ...prev,
                  event: {
                    ...prev.event,
                    eventTime: selectedTime.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    }),
                  },
                }));
              }
              setAlertVisible((prev) => ({ ...prev, timePicker: false }));
            }}
          />
        )}
        <InputComponent
          label="Time"
          value={data.eventTime}
          placeholderTextColor="#999"
          onPress={() =>
            setAlertVisible((prev) => ({
              ...prev,
              timePicker: true,
            }))
          }
        />

          {/* Grazing table */}
    <View className="relative bg-white mt-4">
          <Text className="absolute -top-2 left-6 bg-white px-1 text-sm font-regular text-zinc-500 z-10">
            Grazing Table
          </Text>
          <Dropdown<EventPackagesType>
            value={data.grazingTable.name}
            items={grazing}
            onSelect={(selected) =>
              setReservationData((prev) => ({
                ...prev,
                event: {
                  ...prev.event,
                  grazingTable: { id: selected.id, name: selected.name },
                },
              }))
            }
            labelExtractor={(item) => item.name}
          />
        </View>

        {/* Location */}
        <InputComponent
          label="Location"
          value={data.location}
          multiline
          numberOfLines={5}
          textAlignVertical="top"
          placeholder="e.g. 123 Main St, City, Country"
          placeholderTextColor="#999"
          className="h-36"
          onChangeText={(text) =>
            setReservationData((prev) => ({
              ...prev,
              event: { ...prev.event, location: text },
            }))
          }
        />

        <Text className="text-xs text-gray-400 text-center">
          Note: If you’ve booked with us before, you can keep details similar
          to your last event, but updating the date and theme is highly
          recommended.
        </Text>
      </View>
    </ScrollView>
  );
}
