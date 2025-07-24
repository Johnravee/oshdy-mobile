import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackButton from '@/components/ui/back-button';
import AnimatedModal from '@/components/ui/animatedModal';
import { insertFeedback } from '@/lib/api/insertFeedbacks';
import { useProfileContext } from '@/context/ProfileContext';
import { logError, logSuccess } from '@/utils/logger';

export default function FeedbackScreen() {
  const { profile } = useProfileContext();
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleSubmit = async () => {
    if (!profile) {
      logError('No profile found. Cannot submit feedback.', null);
      return;
    }

    if (!profile.name || !profile.email || !feedback) {
      setShowError(true);
      return;
    }

    setIsSubmitting(true);

    try {
      await insertFeedback(profile.id, profile.name , profile.email , feedback, 'App Improvement');
      logSuccess('Feedback submitted successfully.');
      setShowSuccess(true);
      setFeedback('');
    } catch (err: any) {
      logError('Feedback submission failed:', err.message);
      setShowError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView className="px-5 pt-16" contentContainerStyle={{ paddingBottom: 40 }}>
          <BackButton variant="dark" />

          <Text className="text-3xl font-bold text-gray-800 mb-6">📣 Feedback</Text>
          <Text className="text-base text-gray-600 mb-8 leading-relaxed">
            We’d love to hear your thoughts! Share your suggestions, issues, or experiences using
            our app to help us improve.
          </Text>

          <View className="mb-6">
            <Text className="text-base font-semibold text-gray-700 mb-1">Your Message</Text>
            <TextInput
              value={feedback}
              onChangeText={setFeedback}
              placeholder="Type your feedback here..."
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              className="border border-gray-300 rounded-xl p-3 text-base h-36"
            />
          </View>

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isSubmitting}
            className={`rounded-xl py-3 ${isSubmitting ? 'bg-gray-400' : 'bg-primary'}`}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-center text-base font-semibold">
                Submit Feedback
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Success Modal */}
      <AnimatedModal
        visible={showSuccess}
        title="Feedback Submitted!"
        description="Thank you for helping us improve the app. We value your thoughts and suggestions!"
        animation={require('@/assets/images/lottie/success.json')}
        buttonText="Close"
        onButtonPress={() => setShowSuccess(false)}
        />

      {/* Error Modal */}
      <AnimatedModal
        visible={showError}
        title="Missing Information"
        description="Please make sure to fill out all fields before submitting."
        animation={require('@/assets/images/lottie/warning.json')}
        buttonText="Okay"
        onButtonPress={() => setShowError(false)}
      />
    </SafeAreaView>
  );
}
