import React, { useState, useEffect } from 'react';
import { View, Text, Image, Pressable, Modal } from 'react-native';
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';
import CustomAlert from '@/components/ui/alert';
import { useAuthContext } from '@/context/AuthContext';
import InputComponent from '@/components/ui/inputText';
import SignatureBoard from '@/components/ui/signature-board';
import Dropdown from '@/components/ui/dropdown';
import { BeefMenu, ChickenMenu, Dessert, Drinks, EventPackages, EventTypeBaptismal, EventTypeWedding, FishMenu, PastaMenu, PorkMenu, RequestCategory, VegetableMenu } from '@/constants/EventData';
import { EventPackagesType, Menu, ReservationData, Category } from '@/types/reservation';
import Checkbox from '@/components/ui/checkbox';
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';


const initialReservationData: ReservationData = {
  personal: {
    name: '',
    email: '',
    contact: '',
    celebrant: '',
    address: '',
  },
  event: {
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
  request: {
    category: '',
    requestSlip: '',
    imageFile: '',
  },
  chickenMenu: {},
};

export default function Reservation() {
  const { profile, session } = useAuthContext();
  const [alertVisible, setAlertVisible] = useState(false);
  const [isFilled, setIsFilled] = useState(false)
  const [modalVisible, setModalVisible] = useState(false); //Request image modal visibility
  const [error, setError] = useState<boolean>(false);

  const [reservationData, setReservationData] = useState<ReservationData>(initialReservationData); 



  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [9, 16],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setReservationData(prev => ({
        ...prev,
        request:{
          ...prev.request,
          imageFile: result.assets[0].uri
        }
      }));
    }
  };




  // for checkbox menu
  // const updateChickenMenu = (label: string, isChecked: boolean) => {
  //   setChickenMenu(prev => {
  //     const updated = { ...prev };
  //     if (isChecked) {
  //       updated[label] = true;
  //     } else {
  //       delete updated[label];
  //     }
  //     return updated;
  //   });
  // };

  useEffect(() => {
    if (profile && !isFilled) {
      setAlertVisible(true);
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
        celebrant:  '',
        address: profile?.address || '',
      },
      
    }));
    setIsFilled(true)
    setAlertVisible(false);
  };

  const next = () => {
    const { name, email, contact, celebrant, address } = reservationData.personal;
  
    if (!name || !email || !contact || !celebrant || !address) {
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
  
 
  return (
    <View className="flex-1 bg-white h-screen w-screen">
      {alertVisible && (
        <CustomAlert
          visible={alertVisible}
          title="Use Existing Profile Data?"
          message="This will allow you to quickly fill other fields using your existing information"
          onClose={() => setAlertVisible(false)}
          onCancel={() => setAlertVisible(false)}
          onOk={handleAutofill}
        />
      )}


      <View className='flex-1 w-full h-screen justify-center items-center'>
      <ProgressSteps
        activeStepIconBorderColor="#D4A83F"
        completedStepIconColor="#2E3A8C"
        completedProgressBarColor="#2E3A8C"
        activeLabelColor="#333333"
      >

        {/* Personal info form */}
        <ProgressStep
          label="Personal Info"
          buttonNextText="Next"
          buttonPreviousText="" 
          buttonNextTextColor='#00000'
          onNext={next}
          errors={!reservationData.personal.name || !reservationData.personal.email || !reservationData.personal.contact || !reservationData.personal.celebrant || !reservationData.personal.address}
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
                label="Celebrant"
                value={reservationData.personal.celebrant}
                placeholderTextColor="#999"
                className='w-full'
                onChangeText={(text) =>
                  setReservationData((prev) => ({
                    ...prev,
                    personal: { ...prev.personal, celebrant: text },
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
              />

              
            </View>

            <View className="relative bg-white w-[90%] mt-4">
              <Text className="absolute -top-2 left-6 bg-white px-1 text-sm font-regular text-zinc-500 z-10">
                Packages
              </Text>
              <Dropdown<EventPackagesType>
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
              <Text className="absolute -top-2 left-6 bg-white px-1 text-sm font-regular text-zinc-500 z-10">
                Theme/Motif
              </Text>
              <Dropdown<EventPackagesType>
                items={
                  reservationData.event.pkg === 'Wedding'
                    ? EventTypeWedding
                    : reservationData.event.pkg === 'Baptismal' 
                    ? EventTypeBaptismal
                    : [] // Default to an empty array if no condition matches
                }
                onSelect={(selected) =>
                  setReservationData((prev) => ({
                    ...prev,
                    event: { ...prev.event, theme: selected.title },
                  }))
                }
                labelExtractor={(item) => item.title}
              />
            </View>


            <View className='bg-white w-[90%]'>
                <InputComponent
                label="Date"
                value={reservationData.event.eventDate}
                placeholderTextColor="#999"
                className='w-full'
                onChangeText={(text) =>
                  setReservationData((prev) => ({
                    ...prev,
                    event: { ...prev.event, eventDate: text },
                  }))
                }
              />
            </View>

            <View className='bg-white w-[90%]'>
                <InputComponent
                label="Time"
                value={reservationData.event.eventTime}
                placeholderTextColor="#999"
                className='w-full'
                onChangeText={(text) =>
                  setReservationData((prev) => ({
                    ...prev,
                    event: { ...prev.event, eventTime: text },
                  }))
                }
              />
            </View>

            <View className='bg-white w-[90%]'>
                <InputComponent
                  label="Event Function Address"
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
    
    <Text className="text-dark font-bold text-2xl">Menu</Text>
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


      {/* Contract form */}
        <ProgressStep
          label="Contract"
          buttonNextText="Next"
          buttonPreviousText="Back"
          buttonNextTextColor="#000000"
        >
          <View className="flex-1 items-center justify-center px-4 py-6 bg-white">
            <Text className="text-xl font-semibold text-center text-gray-800 mb-4">
              Event Contract Signature
            </Text>
            <View className="w-full h-[400px] rounded-2xl overflow-hidden border border-gray-300 shadow-lg">
              <SignatureBoard />
            </View>
            <Text className="mt-4 text-sm text-gray-500 text-center">
              Please provide your signature above to confirm your agreement.
            </Text>
          </View>
        </ProgressStep>

        {/* Request form */}
        <ProgressStep
          label="Request"
          buttonNextText="Next"
          buttonPreviousText="Back"
          buttonNextTextColor='#00000'
        >
          <View className="h-full w-screen flex justify-evenly gap-5 ">

            <Text className='text-dark font-bold text-3xl py-2'>
                Request
            </Text>

          <Text className="text-sm text-gray-500 mb-2 w-[90%]">
            Note: Please enter the full details of your request, including any relevant information that may help us understand your needs better. The more specific and clear you are, the faster and more accurately we can process your request and provide the appropriate response or service.
          </Text>

          <View className="relative bg-white w-[90%] mt-4">
            <Text className="absolute -top-2 left-6 bg-white px-1 text-sm text-zinc-500 z-10">
              Category  
            </Text>
            <Dropdown<Category>
              items={RequestCategory}
              onSelect={(selected) =>
                setReservationData((prev) => ({
                  ...prev,
                  request: { ...prev.request, category: selected.title },
                }))
              }
              labelExtractor={(item) => item.title}
            />
          </View>

            <View className='bg-white w-[90%]'>
                  <InputComponent
                    label="Request Slip"
                    value={''}
                    multiline
                    numberOfLines={10}
                    textAlignVertical="top"
                    placeholderTextColor="#999"
                    className="h-36"
                    onChangeText={(text) =>
                     setReservationData((prev) => ({
                      ...prev,
                      request: { ...prev.request, requestSlip: text },
                    })
                  )}
                />
              </View>

              <Text className='text-dark text-sm'>Attach a file (optional)</Text>
                <Pressable className='mt-3 py-3 bg-gray-200  p-2 rounded-lg w-[90%]' onPress={pickImage} >

                  <View className='flex-row items-center justify-center gap-2 '>
                    <Text className='text-dark'><FontAwesome name='paperclip' size={20} color="#333" />  Attach a file</Text>
                  </View>
                </Pressable>

                {reservationData.request.imageFile ? (
                      <>
                        <Pressable onPress={() => setModalVisible(true)} className="w-[90%] mt-2">
                          <Image
                            source={{ uri: reservationData.request.imageFile }}
                            className="w-full h-60 rounded-lg"
                            resizeMode="cover"
                          />
                        </Pressable>

                        <Modal visible={modalVisible} transparent={true}>
                          <View className="flex-1 bg-black justify-center items-center">
                            <Pressable onPress={() => setModalVisible(false)} className="absolute top-5 right-5 z-10 p-1 bg-white rounded-full">
                              <FontAwesome name="close" size={24} color="black" />
                            </Pressable>
                            <Image
                              source={{ uri: reservationData.request.imageFile }}
                              style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
                            />
                          </View>
                        </Modal>
                      </>
                    ) : (
                      <Text className="text-gray-500 text-sm mt-2">No file attached</Text>
                    )}

                </View>
        </ProgressStep>
      </ProgressSteps>
      </View>

      
    </View>
  );
}
