import { IMAGES } from '@/constants/Images.js'
import React, { useState, useEffect } from 'react';
import { View, Text, Image, StatusBar, TextInput, KeyboardAvoidingView, Platform, TouchableHighlight, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import CountdownTimer from '@/components/coundown-timer';

type Errors = {
  message: string;
  category : string;
}

export default function Login() {
  const { sendMagicLink } = useAuth();
  const [email, setEmail] = useState('');
  const [isAuth, setIsAuth] = useState(false);
  const [errorMessage, setErrorMessage] = useState<Errors | null>(null);
  const [isCooldown, setIsCooldown] = useState(false); // Track cooldown state
  const router = useRouter();

  // Handle magic link
  const handleLogin = async () => {
    if (!email.trim()) {
      setErrorMessage({ message: 'Please enter your email', category: 'email' });
      return;
    };

    try {
      await sendMagicLink(email);
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
    }
  };

  // Reset cooldown state after timer expires
  const handleTimeStop = () => {
    setIsCooldown(false);
  }

  useEffect(() => {
    // Check if the user is authenticated
    const checkUserSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      setIsAuth(true);
      router.replace('/(dashboard)/dashboard'); // Redirect to dashboard if authenticated
    };

    checkUserSession();
  }, [router]);

  return (
    <SafeAreaView className="h-screen w-screen">
      <StatusBar hidden={true} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="h-screen w-screen flex justify-center items-center"
      >
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
                  <FontAwesome name="envelope" size={20} color="#4089F8" />
                  {' '}Email
                </Text>
                <TextInput
                  className="h-auto w-full border border-gray-300 rounded-lg p-3 text-lg"
                  placeholder="johndoe@gmail.com"
                  value={email}
                  onChangeText={(text) => setEmail(text)}
                  editable={!isCooldown} // Disable the input if in cooldown state
                />
                <Text className='text-md text-red-500'>{errorMessage?.category === 'email' && errorMessage?.message}</Text>
              </View>

              {/* Login button */}
              <View className="flex w-full max-w-md justify-center items-center mt-10">
                <TouchableHighlight
                  onPress={handleLogin}
                  underlayColor="#3b82f6"
                  className={`w-full bg-secondary py-3 px-7 rounded-lg ${isCooldown ? 'opacity-40 ' : ''}`}
                  disabled={isCooldown} // Disable the button if in cooldown state
                >
                  <View>
                    {!isCooldown && <Text className="text-white font-bold text-lg text-center">Log In</Text>} 
                    {errorMessage?.category === 'rate-limit' && (
                      <Text className="text-gray-300 text-lg text-center mt-4">{errorMessage?.message}</Text>
                    )}
                    {isCooldown && (
                      <Text className="text-sm text-center mt-4 text-gray-800">
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
                <View>
                  <TouchableHighlight
                    onPress={handleLogin}
                    underlayColor="#e0e0e0"
                    className="w-auto bg-white py-3 px-7 rounded-md"
                  >
                    <FontAwesome name="google" size={30} color="#FF0000" />
                  </TouchableHighlight>
                </View>
                <View>
                  <TouchableHighlight
                    onPress={handleLogin}
                    underlayColor="#e0e0e0"
                    className="w-auto bg-white py-3 px-7 rounded-md"
                  >
                    <FontAwesome name="facebook" size={30} color="#4089F8" />
                  </TouchableHighlight>
                </View>
                <View>
                  <TouchableHighlight
                    onPress={handleLogin}
                    underlayColor="#3b82f6"
                    className="w-auto bg-white py-3 px-7"
                  >
                    <FontAwesome name="apple" size={30} color="#A3A3A3" />
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
