import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';
import CustomAlert from '@/components/ui/alert';
import { useAuthContext } from '@/context/AuthContext';
import InputComponent from '@/components/ui/inputText';
import SignatureBoard from '@/components/ui/signature-board';


export default function Reservation() {
  const { profile, session } = useAuthContext();
  const [alertVisible, setAlertVisible] = useState(false);
  const [isFilled, setIsFilled] = useState(false)
  const [personalInfo, setPersonalInfo] = useState({name: '', email: '', contact: '', celebrant: '', address: ''});
  const [eventDetails, setEventDetails] = useState({pkg : '', theme: '', venue: '', event: '', eventDate: '', eventTime: '', location: ''})

  useEffect(() => {
    if (profile && !isFilled) {
      setAlertVisible(true);
    }
  }, [profile])

  const handleAutofill = () => {

    console.log("this is the profile from reservation", profile);
    setPersonalInfo({
      name: profile?.name || '',
      email: profile?.email || '',
      contact: profile?.contact_number || '',
      address: profile?.address || '',
      celebrant: ''
    })
    setIsFilled(true)
    setAlertVisible(false);
  };

  const next = () => {
    const { name, email, contact, celebrant, address } = personalInfo;
  
    if (!name || !email || !contact || !celebrant || !address) {
      alert("Please fill in all required fields.");
      return false;
    }

    console.log(personalInfo)
  
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
          errors={!personalInfo.name || !personalInfo.email || !personalInfo.contact || !personalInfo.celebrant || !personalInfo.address}
        >
          <View className="h-full w-screen flex justify-evenly gap-5 ">
            <View className='bg-white w-[90%]'>
                <InputComponent
                label="Name"
                value={personalInfo.name}
                placeholderTextColor="#999"
                className='w-full'
                onChangeText={(text) =>
                  setPersonalInfo((prev) => ({ ...prev, name: text }))
                }
              />
            </View>

            <View className='bg-white w-[90%]'>
                <InputComponent
                label="Email address"
                value={personalInfo.email}
                placeholderTextColor="#999"
                className='w-full'
                onChangeText={(text) =>
                  setPersonalInfo((prev) => ({ ...prev, email: text }))
                }
              />
            </View>

            <View className='bg-white w-[90%]'>
                <InputComponent
                label="Contact No."
                value={personalInfo.contact}
                placeholderTextColor="#999"
                className='w-full'
                onChangeText={(text) =>
                  setPersonalInfo((prev) => ({ ...prev, contact: text }))
                }
              />
            </View>

            <View className='bg-white w-[90%]'>
                <InputComponent
                label="Celebrant"
                value={personalInfo.celebrant}
                placeholderTextColor="#999"
                className='w-full'
                onChangeText={(text) =>
                  setPersonalInfo((prev) => ({ ...prev, celebrant: text }))
                }
              />
            </View>

            <View className='bg-white w-[90%]'>
                <InputComponent
                  label="Address"
                  value={personalInfo.address}
                  multiline
                  numberOfLines={10}
                  textAlignVertical="top"
                  placeholderTextColor="#999"
                  className="h-36"
                  onChangeText={(text) =>
                    setPersonalInfo((prev) => ({ ...prev, address: text }))
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
        >
          <View className="h-full w-screen flex justify-evenly gap-5 ">
            <View className='bg-white w-[90%]'>
                <InputComponent
                label="Venue"
                value={personalInfo.name}
                placeholderTextColor="#999"
                className='w-full'
                onChangeText={(text) =>
                  setEventDetails((prev) => ({ ...prev, venue: text }))
                }
              />
            </View>

            <View className='bg-white w-[90%]'>
                <InputComponent
                label="Event"
                value={personalInfo.email}
                placeholderTextColor="#999"
                className='w-full'
                onChangeText={(text) =>
                  setEventDetails((prev) => ({ ...prev, event: text }))
                }
              />
            </View>

            <View className='bg-white w-[90%]'>
                <InputComponent
                label="Package"
                value={personalInfo.email}
                placeholderTextColor="#999"
                className='w-full'
                onChangeText={(text) =>
                  setEventDetails((prev) => ({ ...prev, pkg: text }))
                }
              />
            </View>

            <View className='bg-white w-[90%]'>
                <InputComponent
                label="Theme"
                value={personalInfo.email}
                placeholderTextColor="#999"
                className='w-full'
                onChangeText={(text) =>
                  setEventDetails((prev) => ({ ...prev, theme: text }))
                }
              />
            </View>

            <View className='bg-white w-[90%]'>
                <InputComponent
                label="Date"
                value={personalInfo.contact}
                placeholderTextColor="#999"
                className='w-full'
                onChangeText={(text) =>
                  setEventDetails((prev) => ({ ...prev, eventDate: text }))
                }
              />
            </View>

            <View className='bg-white w-[90%]'>
                <InputComponent
                label="Time"
                value={personalInfo.celebrant}
                placeholderTextColor="#999"
                className='w-full'
                onChangeText={(text) =>
                  setEventDetails((prev) => ({ ...prev, eventTime: text }))
                }
              />
            </View>

            <View className='bg-white w-[90%]'>
                <InputComponent
                  label="Event Function"
                  value={personalInfo.address}
                  multiline
                  numberOfLines={10}
                  textAlignVertical="top"
                  placeholderTextColor="#999"
                  className="h-36"
                  onChangeText={(text) =>
                    setEventDetails((prev) => ({ ...prev, location: text }))
                  }
              />
            </View>
          </View>
        </ProgressStep>

        <ProgressStep
          label="Guests"
          buttonFinishText="Book Now"
          buttonPreviousText="Back"
          onSubmit={() => console.log('Submit pressed')}
          buttonBorderColor='#000000'
          buttonNextTextColor='#00000'
          buttonFinishTextColor='#2E3A8C'
        >
          <ScrollView className="px-4 py-6">
            <Text className="text-base text-gray-700">
              Step 3 content goes here. You can add a signature board or form here.
            </Text>
          </ScrollView>
        </ProgressStep>


        <ProgressStep
          label="Menu's"
          buttonNextText="Next"
          buttonPreviousText="Back"
          buttonNextTextColor='#00000'
        >
          <ScrollView className="px-4 py-6">
            <Text className="text-base text-gray-700">
              Step 2 content goes here. Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </Text>
          </ScrollView>
        </ProgressStep>


        <ProgressStep
          label="Request"
          buttonNextText="Next"
          buttonPreviousText="Back"
          buttonNextTextColor='#00000'
        >
          <ScrollView className="px-4 py-6">
            <Text className="text-base text-gray-700">
              Step 2 content goes here. Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </Text>
          </ScrollView>
        </ProgressStep>

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

      </ProgressSteps>
      </View>
    </View>
  );
}
