import React from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { IMAGES } from '@/constants/Images';
import BackButton from '@/components/ui/back-button';

export default function AboutApp() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="px-5 pt-16"
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
      >
        {/* Back Button */}
        <BackButton variant="dark" />

        {/* Header */}
        <View className="items-center space-y-2 mb-8">
          <Image
            source={IMAGES.oshdyLogo}
            className="w-28 h-28 rounded-full mb-2"
            resizeMode="contain"
          />
          <Text className="text-3xl font-extrabold text-primary">OSHDY Catering App</Text>
          <Text className="text-base text-gray-500">Version 1.0.0</Text>
        </View>

        {/* Welcome */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-gray-800 mb-3">👋 Welcome</Text>
          <Text className="text-base text-gray-700 text-justify leading-relaxed">
            Welcome to the OSHDY Catering Event Services App – your all-in-one companion for hassle-free event planning! Whether you're celebrating birthdays, weddings, baptisms, or hosting a company party, OSHDY is here to make your event memorable, organized, and stress-free.
          </Text>
        </View>

        {/* Mission & Vision */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-gray-800 mb-3">🎯 Our Mission</Text>
          <Text className="text-base text-gray-700 text-justify leading-relaxed">
            To provide delicious, high quality food and exceptional service at prices that make catering accessible for everyone. We are committed to bringing flavorful experiences to every event big or small by combining fresh ingredients, professional presentation, and budget friendly options.
          </Text>

          <Text className="text-3xl font-bold text-gray-800 mt-6 mb-3">🌟 Our Vision</Text>
          <Text className="text-base text-gray-700 text-justify leading-relaxed">
            To be the go to catering choice for communities seeking unforgettable culinary experiences without breaking the bank. We envision a world where quality catering is no longer a luxury, but a standard available to all.    
          </Text>
        </View>

        {/* Why Use This App */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-gray-800 mb-3">📱 Why Use This App?</Text>
          <Bullet text="Fast and easy event reservations—anytime, anywhere." />
          <Bullet text="Browse and select packages with clear details." />
          <Bullet text="Stay updated with real-time progress tracking." />
          <Bullet text="Chat with our friendly staff for assistance or custom requests." />
          <Bullet text="Get notified about important updates and reminders." />
        </View>

        {/* Features */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-gray-800 mb-3">⚙️ Features You'll Love</Text>
          <FeatureItem icon="check" text="Step-by-step reservation form" />
          <FeatureItem icon="check" text="Easy menu and theme selection" />
          <FeatureItem icon="check" text="Live status tracking & notifications" />
          <FeatureItem icon="check" text="Personalized profile and history log" />
          <FeatureItem icon="check" text="Built-in chat with event coordinators" />
        </View>

        {/* FAQs */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-gray-800 mb-4">❓ Frequently Asked Questions</Text>
          <FAQItem
            question="Do I need to pay right away?"
            answer="No payment is required at the time of reservation. After submitting your request, our admin will send a contract and coordinate payment instructions."
          />
          <FAQItem
            question="Can I change event details after submitting?"
            answer="Yes! You may revise or cancel as long as the reservation is still pending. Feel free to message our team through the built-in chat."
          />
          <FAQItem
            question="How will I know if my reservation is confirmed?"
            answer="You’ll receive a notification and see updates in your dashboard once your reservation has been approved."
          />
        </View>

        {/* Contact */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-gray-800 mb-3">📬 Contact Information</Text>
          <ContactItem icon="envelope" text="oshdyevents@gmail.com" />
          <ContactItem icon="phone" text="0981 377 7731" />
          <ContactItem icon="map-marker" text="P5 B46 L3 Centella Homes, Rodriguez, Rizal" />
        </View>

        {/* Footer */}
        <View className="items-center mt-2  border-t border-gray-300">
          <Text className="text-sm text-gray-500 text-center">
            Developed by John Rave Mimay
          </Text>
          <Text className="text-xs text-gray-400 mt-1">
            © 2025 OSHDY. All Rights Reserved.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Bullet Point Component
function Bullet({ text }: { text: string }) {
  return (
    <View className="flex-row gap-2 mb-1">
      <Text className="text-base text-primary">•</Text>
      <Text className="flex-1 text-base text-gray-700">{text}</Text>
    </View>
  );
}

// Feature List Item
function FeatureItem({ icon, text }: { icon: any; text: string }) {
  return (
    <View className="flex-row items-center gap-2 mb-1">
      <FontAwesome name={icon} size={16} color="#22c55e" />
      <Text className="text-base text-gray-700">{text}</Text>
    </View>
  );
}

// Contact Info Item
function ContactItem({ icon, text }: { icon: any; text: string }) {
  return (
    <View className="flex-row items-center gap-3 mb-1">
      <FontAwesome name={icon} size={18} color="#1f2937" />
      <Text className="text-base text-gray-700">{text}</Text>
    </View>
  );
}

// FAQ Item
function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <View className="bg-gray-100 p-4 rounded-xl mb-3 border border-gray-200">
      <Text className="text-base font-semibold text-gray-800 mb-1">{question}</Text>
      <Text className="text-base text-gray-700 text-justify">{answer}</Text>
    </View>
  );
}
