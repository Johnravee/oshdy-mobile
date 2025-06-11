import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';
import CustomAlert from '@/components/ui/alert';
import { useAuthContext } from '@/context/AuthContext';
import InputComponent from '@/components/ui/inputText';
import Dropdown from '@/components/ui/dropdown';
import { BeefMenu, ChickenMenu, Dessert, Drinks, EventPackages, BaptismalTheme, WedingTheme, DebutTheme, KiddieTheme, CorporateTheme, BirthdayTheme, FishMenu, PastaMenu, PorkMenu, VegetableMenu } from '@/constants/EventData';
import { EventPackagesType, Menu, ReservationData } from '@/types/reservation';
import { FontAwesome } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import ReservationPreview from '@/components/reservation-preview';
import { Link } from 'expo-router';
import Spinner from '@/components/ui/spinner';

const initialReservationData: ReservationData = {
  personal: {
    name: '',
    email: '',
    contact: '',
    address: '',
  },
  event: {
    celebrant: '',
    pkg: '',
    theme: '',
    venue: '',
    eventDate: '',
    eventTime: '',
    location: '',
  },
  guests: {
    pax: '',
    adults: '',
    kids: '',
  },
  menu: {
    beef: '',
    chicken: '',
    vegetable: '',
    pork: '',
    pasta: '',
    fillet: '',
    dessert: '',
    juice: '',
  },

};

export default function Reservation() {
  const { profile } = useAuthContext();
  const [alertVisible, setAlertVisible] = useState({firstForm: false, secondForm: false, datepicker: false, timePicker: false});
  const [isFilled, setIsFilled] = useState(false)
  const [error, setError] = useState<boolean>(false);
  const [reservationData, setReservationData] = useState<ReservationData>(initialReservationData); 



  useEffect(() => {
    if (profile && !isFilled) {
      setAlertVisible((prev) => ({
        ...prev, firstForm: true,
      }));
    }
  }, [profile])

  const handleAutofill = () => {

    console.log("this is the profile from reservation", profile);
    setReservationData((prev) => ({
      ...prev,
      personal: {
        ...prev.personal,
        name: profile?.name || '',
        email: profile?.email || '',
        contact: profile?.contact_number || '',
        address: profile?.address || '',
      },
      
    }));
    setIsFilled(true)
    setAlertVisible((prev) => ({
      ...prev, firstForm: false,
    }));
  };

  const next = () => {
    const { name, email, contact, address } = reservationData.personal;
  
    if (!name || !email || !contact || !address) {
      setError(true);
      alert("Please fill in all required fields.");
      return false;
    } 
    return true;
  };

  const handleGuestStep = () => {
    const { pax, adults, kids } = reservationData.guests;
  
    if (!pax || !adults || !kids) {
      alert("Please fill in all guest fields.");
      return;
    }
  
    const total = parseInt(adults) + parseInt(kids);
    if (total > parseInt(pax)) {
      alert("Adults and kids exceed the total number of guests (Pax).");
      return false;
    }

    return true;
  };


  const handleEventStep = () => {
    const { venue, pkg, theme, eventDate, eventTime, location } = reservationData.event;
  
    if (!venue || !pkg || !theme || !eventDate || !eventTime || !location) {
      setError(true);
      alert("Please fill in all event details fields.");
      return;
    }
  
    setError(false);
    return true;
  };
  
 
  // if(!profile) return <Spinner />;



  return (
    <View className="flex-1 bg-white h-screen w-screen">
      {alertVisible.firstForm && (
        <CustomAlert
          visible={alertVisible.firstForm}
          title="Use Existing Profile Data?"
          message="This will allow you to quickly fill other fields using your existing information"
          onClose={() => setAlertVisible((prev) => ({
            ...prev, firstForm: false,
          }))} 
          onCancel={() => setAlertVisible((prev) => ({
            ...prev, firstForm: false,
          }))}
          onOk={handleAutofill}
        />
      )}


      <View className='flex-1 w-full h-screen justify-center items-center'>
        <View className="absolute top-5 left-5">
            <Link replace href={'/(app)/(tabs)/dashboard'} className="text-3xl font-bold text-center">
                <FontAwesome name="arrow-left" size={20} color="#333333" />
            </Link>
        </View>
      <ProgressSteps
        activeStepIconBorderColor="#D4A83F"
        completedStepIconColor="#2E3A8C"
        completedProgressBarColor="#2E3A8C"
        activeLabelColor="#D4A83F"
      >

        {/* Personal info form */}
        <ProgressStep
          label="Personal Info"
          buttonNextText="Next"
          buttonPreviousText="Exit" 
          buttonNextTextColor='#00000'
          onNext={next}
          errors={!reservationData.personal.name || !reservationData.personal.email || !reservationData.personal.contact || !reservationData.personal.address}
        >
          <View className="h-full w-screen flex justify-evenly gap-5 ">
          <Text className="text-dark font-bold text-2xl">Personal Info</Text>
          <Text className="text-sm text-gray-500 w-[90%] leading-relaxed">
            If you’ve booked with us before, please review your personal details carefully. Ensure your name, contact number, and address are current — especially if your event will be held at a different location or under a new name. Keeping your information up to date helps us provide a smoother experience.
          </Text>

            <View className='bg-white w-[90%]'>
                <InputComponent
                label="Name"
                value={reservationData.personal.name}
                placeholderTextColor="#999"
                className='w-full'
                onChangeText={(text) =>
                  setReservationData((prev) => ({
                    ...prev,
                    personal: { ...prev.personal, name: text },
                  }))
                }
              />
            </View>

            <View className='bg-white w-[90%]'>
                <InputComponent
                label="Email address"
                value={reservationData.personal.email}
                placeholderTextColor="#999"
                className='w-full'
                onChangeText={(text) =>
                  setReservationData((prev) => ({
                    ...prev,
                    personal: { ...prev.personal, email: text },
                  }))
                }
              />
            </View>

            <View className='bg-white w-[90%]'>
                <InputComponent
                label="Contact No."
                value={reservationData.personal.contact}
                placeholderTextColor="#999"
                className='w-full'
                onChangeText={(text) =>
                  setReservationData((prev) => ({
                    ...prev,
                    personal: { ...prev.personal, contact: text },
                  }))
                }
              />
            </View>

            <View className='bg-white w-[90%]'>
                <InputComponent
                  label="Address"
                  value={reservationData.personal.address}
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
        </ProgressStep>
        
        {/* Event Details form */}
        <ProgressStep
          label="Event Details"
          buttonNextText="Next"
          buttonPreviousText="Back"
          buttonNextTextColor='#00000'
          onNext={handleEventStep}
          errors={!reservationData.event.venue || !reservationData.event.eventDate || !reservationData.event.eventTime || !reservationData.event.pkg || !reservationData.event.theme || !reservationData.event.location}
        >
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
                value={reservationData.event.pkg}
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

  {reservationData.event.pkg ? (
    // ✅ Show the dropdown when pkg is selected
    <Dropdown<EventPackagesType>
      value={reservationData.event.theme}
      items={
        reservationData.event.pkg === 'Wedding'
          ? WedingTheme
          : reservationData.event.pkg === 'Baptismal'
          ? BaptismalTheme
          : reservationData.event.pkg === 'Debut'
          ? DebutTheme
          : reservationData.event.pkg === 'Kiddie Party'
          ? KiddieTheme
          : reservationData.event.pkg === 'Birthday'
          ? BirthdayTheme
          : reservationData.event.pkg === 'Corporate'
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
                value={reservationData.event.celebrant}
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
                value={reservationData.event.venue}
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
                value={reservationData.event.eventDate}
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
                value={reservationData.event.eventTime}
                placeholderTextColor="#999"
                className='w-full'
                onPress={() => setAlertVisible((prev) => ({
                  ...prev, timePicker: true,} ))}
              />
            </View>

            <View className='bg-white w-[90%]'>
                <InputComponent
                  label="Location"
                  value={reservationData.event.location}
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
        </ProgressStep>

        {/* Guest Form */}
        <ProgressStep
          label="Guests"
          buttonPreviousText="Back"
          buttonBorderColor='#000000'
          buttonNextTextColor='#00000'
          onNext={handleGuestStep}
          errors={!reservationData.guests.pax || !reservationData.guests.adults || !reservationData.guests.kids || parseInt(reservationData.guests.adults) + parseInt(reservationData.guests.kids) > parseInt(reservationData.guests.pax) ? true : false}

        >
          <View className="h-full w-screen flex justify-evenly gap-5 ">
          <Text className="text-dark font-bold text-2xl">Guest Details</Text>
              <Text className="text-sm text-gray-500 w-full ">
                Please enter the number of expected guests. This helps us plan your event more accurately and ensure enough food and seating.
              </Text>
            <View className='bg-white w-[90%]'>
            
                <InputComponent
                label="Pax"
                value={reservationData.guests.pax}
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
                value={reservationData.guests.adults}
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
                value={reservationData.guests.kids}
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
        </ProgressStep>

        {/* Menu's form */}
        <ProgressStep
          label="Menu's"
          buttonNextText="Next"
          buttonPreviousText="Back" 
          buttonNextTextColor="#00000"
        >
  <View className="h-full w-screen flex justify-evenly gap-5">
    
    <Text className="text-dark font-bold text-2xl">Menu (Pick One)</Text>
    <Text className="text-sm text-gray-500 w-[90%]">
      Welcome back! As a returning guest, feel free to select your preferred dishes—one from each category. If you have favorite items from a previous event, you’re welcome to choose them again or try something new. Make sure your selections match your current event's preferences.
    </Text>

    {/* 🍗 Main Course */}
    <Text className="text-lg font-semibold text-gray-700 mt-3">Main Course</Text>

    <View className="relative bg-white w-[90%] mt-4">
      <Text className="absolute -top-2 left-6 bg-white px-1 text-sm text-zinc-500 z-10">
        Pasta
      </Text>
      <Dropdown<Menu>
        value={reservationData.menu.pasta}
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

    <View className="relative bg-white w-[90%] mt-4">
      <Text className="absolute -top-2 left-6 bg-white px-1 text-sm text-zinc-500 z-10">
        Vegetables
      </Text>
      <Dropdown<Menu>
        value={reservationData.menu.vegetable}
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

    <View className="relative bg-white w-[90%] mt-4">
      <Text className="absolute -top-2 left-6 bg-white px-1 text-sm text-zinc-500 z-10">
        Chicken
      </Text>
      <Dropdown<Menu>
        value={reservationData.menu.chicken}
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

    <View className="relative bg-white w-[90%] mt-4">
      <Text className="absolute -top-2 left-6 bg-white px-1 text-sm text-zinc-500 z-10">
        Pork
      </Text>
      <Dropdown<Menu>
        value={reservationData.menu.pork}
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

    <View className="relative bg-white w-[90%] mt-4">
      <Text className="absolute -top-2 left-6 bg-white px-1 text-sm text-zinc-500 z-10">
        Beef
      </Text>
      <Dropdown<Menu>
        value={reservationData.menu.beef}
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

    <View className="relative bg-white w-[90%] mt-4">
      <Text className="absolute -top-2 left-6 bg-white px-1 text-sm text-zinc-500 z-10">
        Fillet
      </Text>
      <Dropdown<Menu>
        value={reservationData.menu.fillet}
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

    <View className="relative bg-white w-[90%] mt-4">
      <Text className="absolute -top-2 left-6 bg-white px-1 text-sm text-zinc-500 z-10">
        Dessert
      </Text>
      <Dropdown<Menu>
        value={reservationData.menu.dessert}
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

    <View className="relative bg-white w-[90%] mt-4 mb-8">
      <Text className="absolute -top-2 left-6 bg-white px-1 text-sm text-zinc-500 z-10">
        Juice Drinks
      </Text>
      <Dropdown<Menu>
        value={reservationData.menu.juice}
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
        </ProgressStep>

        {/* Preview form */}
        <ProgressStep
          label="Final Review"
          buttonFinishText="Submit"
          buttonPreviousText="Back" 
          buttonFinishTextColor='#D4A83F'
        >
          <View className="h-full w-screen flex justify-evenly gap-5 ">
            <View className='bg-white w-[90%]'>
                <ReservationPreview reservationData={reservationData} />
            </View>
          </View>
        </ProgressStep>
      </ProgressSteps>
      </View>

      
    </View>
  );
}
