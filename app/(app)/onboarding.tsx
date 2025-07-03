import { View, SafeAreaView, StatusBar, TouchableOpacity } from 'react-native';
import React from 'react';
import Onboarding from 'react-native-onboarding-swiper';
import LottieView from 'lottie-react-native';
import { useRouter } from 'expo-router';
import { setItem } from '@/utils/asyncstorage';



export default function OnboardingScreen () {

  const handleDone = () => {
    setItem('onboarding', 'true'); 
    
  };

  return (
    <>
      <SafeAreaView className='h-full w-full'>
        <Onboarding
          onDone={handleDone}
          showSkip={false}
          containerStyles={{ paddingHorizontal: 15, paddingVertical: 10 }}
          bottomBarHeight={80}
          transitionAnimationDuration={100}
          pages={[
            {
              backgroundColor: '#D4A83F',
              image: (
                <View>
                  <LottieView
                    source={require('../../assets/images/lottie/welcome.json')}
                    autoPlay
                    loop
                    style={{ width: 400, height: 400 }}
                  />
                </View>
              ),
              title: 'Welcome to OSHDY Event Catering Services',
              subtitle:
                'We’re excited to help you plan everything from intimate dinners to grand events. Let’s get started on your perfect catering experience!',
              titleStyles: {
                fontWeight: 'bold',
                fontSize: 24,
                color: '#ffff',
                marginBottom: 12, 
                textAlign: 'center',
              },
              subTitleStyles: {
                fontWeight: '400',
                fontSize: 16,
                color: '#ffff',
                paddingHorizontal: 10,
                textAlign: 'center',
              },
            },
            {
              backgroundColor: '#00142C',
              image: (
                <View>
                  <LottieView
                    source={require('../../assets/images/lottie/dish.json')}
                    autoPlay
                    loop
                    style={{ width: 400, height: 400 }}
                  />
                </View>
              ),
              title: 'Explore Our Menu!',
              subtitle:
                'Discover a variety of delicious options tailored to your event. Swipe through our menu to find the perfect dishes for your gathering!',
              titleStyles: {
                fontWeight: 'bold',
                fontSize: 24,
                color: '#fff',
                marginBottom: 12,
                textAlign: 'center',
              },
              subTitleStyles: {
                fontWeight: '400',
                fontSize: 16,
                color: '#ccc',
                paddingHorizontal: 10,
                textAlign: 'center',
              },
            },
            {
              backgroundColor: '#4D7F8E',
              image: (
                <View>
                  <LottieView
                    source={require('../../assets/images/lottie/assist.json')}
                    autoPlay
                    loop
                    style={{ width: 400, height: 400 }}
                  />
                </View>
              ),
              title: 'Need Assistance?',
              subtitle:
                'Our team is here to help! If you have any questions or need recommendations, don’t hesitate to reach out through the app. Happy planning!',
              titleStyles: {
                fontWeight: 'bold',
                fontSize: 24,
                color: '#fff',
                marginBottom: 12,
                textAlign: 'center',
              },
              subTitleStyles: {
                fontWeight: '400',
                fontSize: 16,
                color: '#fff',
                paddingHorizontal: 10,
                textAlign: 'center',
              },
            },
          ]}
        />
      </SafeAreaView>
    </>
  );
}
