import { IMAGES } from '@/constants/Images.js'
import React, { useState } from 'react';
import { View, Text, Image, StatusBar, TextInput, KeyboardAvoidingView, Platform, TouchableHighlight, TouchableWithoutFeedback, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'expo-router';
import CountdownTimer from '@/components/coundown-timer';
import * as SplashScreen from 'expo-splash-screen';
import CustomModal from '@/components/ui/custom-modal';
import LottieView from 'lottie-react-native';
import isValidEmail from '@/utils/email-checker';

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});


type Errors = {
  message: string;
  category : string;
}

export default function Login() {
  const { sendMagicLink, performOAuth } = useAuth();
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState<Errors | null>(null);
  const [isCooldown, setIsCooldown] = useState(false); // Track cooldown state
  const [modalVisibility, setModalVisibility] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  
  // Handle magic link
  const handleLogin = async () => {
    if (!email.trim()) {
      setErrorMessage({
        message: 'Email field cannot be empty. Please enter your email address.',
        category: 'email'
      });
      return;
    }

    if (!isValidEmail(email)) {
      setErrorMessage({
        message: 'The email address entered is not in a valid format. Please check and try again.',
        category: 'email'
      });
      return;
    }


    setLoading(true)
    try {
      await sendMagicLink(email);
      setLoading(!loading)
      setModalVisibility(true)
      setErrorMessage(null);  // Clear error message on success
      setIsCooldown(true);    // Set cooldown active for rate limit protection
    } catch (error: any) {
      if (error.message.includes("For security purposes, you can only request this after")) {
        const match = error.message.match(/\d+/);
        if (match) {
          setIsCooldown(true);  // Start cooldown timer
        }
        return;
      }

      if (error.message.includes('rate limit')) {
        setErrorMessage({
          message: 'Too many requests. Please wait a while before trying again.',
          category: 'rate-limit',
        });
        return;
      }

      // Generic error handling for other issues
      setErrorMessage({
        message: 'An error occurred. Please try again later.',
        category: 'generic',
      });
    }finally {
      setLoading(false)
    }

    
  };

  // Reset cooldown state after timer expires
  const handleTimeStop = () => {
    setIsCooldown(false);
  }



  const handleGoogleSignIn = async () => {
  performOAuth('google')
};


  return (
    <SafeAreaView className="h-screen w-screen">
      <StatusBar hidden={true} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="h-screen w-screen flex justify-center items-center"
      >

      {/* Spinner */}
      
        {loading && (
          <View className="absolute w-screen z-50 bg-white/15 flex flex-row justify-center h-screen items-center">
          <LottieView
            source={require('../assets/images/lottie/spinner.json')}
            autoPlay
            loop
            style={{ width: 200, height: 200 }}
          />
        </View>
        )}
    

      {/* Email sending modal  */}
      <CustomModal
        visible={modalVisibility}
        onClose={() => setModalVisibility(false)}

      >
      <View className="flex-1 justify-center items-center bg-black/50">
              <View className="bg-white rounded-2xl p-5 w-11/12 h-auto justify-center items-center">
                {/* Close icon */}
                <Pressable
                  onPress={() => setModalVisibility(false)}
                  className="absolute top-2 right-2 p-2 rounded-full"
                >
                  <FontAwesome name="close" size={20} color="#333" />
                </Pressable>
      
                {/* Lottie Animation */}
                <LottieView
                  source={require('../assets/images/lottie/success.json')}
                  autoPlay
                  loop
                  style={{ width: 150, height: 150 }}
                />
      
                {/* Title */}
                <Text className="text-2xl font-bold text-center mt-2 mb-4 text-dark">
                  We’ve sent you a secure login link
                </Text>
      
                {/* Message */}
                <Text className="text-base text-center text-gray-600 mb-5">
                  A secure one-time login link has been sent to{' '}
                  <Text className="font-medium text-blue-700">{email}</Text>.{'\n'}
                  Open your email to continue. Don’t forget to check your spam or junk folder.
                </Text>
      
                {/* Divider */}
                <View className="my-4 border-t border-gray-300 w-full" />
      
                {/* Retry Note */}
                <Text className="text-base text-center text-gray-600">
                  Didn't get the email? Wait 60 seconds before retrying.
                </Text>
              </View>
            </View>
      </CustomModal>

        {/* Main content */}
        <View className="h-full w-full relative">
          {/* Decorative background circles */}
          <View className="absolute left-[-5%]">
            <View className="h-48 w-48 bg-primary rounded-full opacity-55 top-[-30%] left-[-15%]" />
            <View className="h-40 w-40 bg-primary rounded-full opacity-50 top-[-50%] left-[-30%]" />
          </View>

          <View className="absolute right-[-10%]">
            <View className="h-48 w-48 bg-primary rounded-full opacity-55 top-[-30%] right-[-10%]" />
            <View className="h-20 w-20 bg-primary rounded-full opacity-50 top-[-45%] right-[-50%]" />
          </View>

          {/* Main content (Welcome, Logo, and Inputs) */}
          <View className="h-full flex justify-center items-center gap-5">
            <Text className="font-bold text-2xl text-[#333333]">Welcome Back!</Text>
            <Image source={IMAGES.oshdyLogo} className="h-60 w-60 rounded-full" />

            {/* Form */}
            <View className="w-full flex justify-center items-center mt-10 px-5">
              <View className="w-full max-w-md">
                <Text className="text-lg mb-2 text-[#333333] font-semibold">
                  <FontAwesome name="envelope" size={20} color="#2E3A8C" />
                  {' '}Email
                </Text>
                <TextInput
                  className="h-auto w-full border border-gray-300 rounded-lg p-3 text-lg"
                  placeholder="johndoe@gmail.com"
                  value={email}
                  onChangeText={(text) => setEmail(text)}
                  editable={!isCooldown} // Disable the input if in cooldown state
                />
                <Text className='text-base mt-3 text-red-500/95'>{errorMessage?.category === 'email' && errorMessage?.message}</Text>
              </View>

              {/* Login button */}
              <View className="flex w-full max-w-md justify-center items-center mt-5">
                <TouchableHighlight
                  onPress={handleLogin}
                  underlayColor="#3b82f6"
                  className={`w-full bg-secondary py-3 px-7 rounded-lg ${isCooldown ? 'opacity-40 ' : ''}`}
                  disabled={isCooldown} // Disable the button if in cooldown state
                >
                  <View>
                    {!isCooldown && <Text className="text-white font-bold text-lg text-center">Sign In with Email</Text>} 
                    {errorMessage?.category === 'rate-limit' && (
                      <Text className="text-gray-300 text-lg text-center mt-4">{errorMessage?.message}</Text>
                    )}
                    {isCooldown && (
                      <Text className="text-lg text-center p-2 text-gray-800">
                        Please wait {<CountdownTimer second={60} handleTimeStop={handleTimeStop} />} seconds before retrying.
                      </Text>
                    )}
                  </View>
                </TouchableHighlight>
              </View>

              {/* Separator */}
              <View className="w-full max-w-md mt-10">
                <View className="flex-row items-center justify-center space-x-2">
                  <View className="flex-1 border-t border-gray-300" />
                  <Text className="mx-2 text-lg text-gray-300">Or</Text>
                  <View className="flex-1 border-t border-gray-300" />
                </View>
              </View>

              {/* Social login */}
              <View className="flex flex-row justify-center gap-10 w-full max-w-md mt-10">
                  <View className="w-2/3">
                    <TouchableHighlight
                      onPress={handleGoogleSignIn}
                      underlayColor="#e0e0e0"
                      className="w-auto bg-white shadow-md py-3 px-7 rounded-md flex-row items-center justify-center"
                    >
                      <View className="flex-row items-center gap-3">
                        <FontAwesome name="google" size={24} color="#FF0000" />
                        <Text className="text-base text-[#333] font-semibold">Sign In with Google</Text>
                      </View>
                    </TouchableHighlight>
                  </View>
                </View>


              {/* Consent */}
              <Text className="text-center text-sm mt-5 text-gray-600">
                By signing in, you agree to our{' '}
                <TouchableWithoutFeedback>
                  <Text style={{ color: '#1D9BF0' }}>Terms and Conditions</Text>
                </TouchableWithoutFeedback>
                {' '}and{' '}
                <TouchableWithoutFeedback>
                  <Text style={{ color: '#1D9BF0' }}>Privacy Policy</Text>
                </TouchableWithoutFeedback>.
              </Text>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}