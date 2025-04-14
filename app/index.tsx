import OnboardScreen from './(onboarding)/onboardscreen';
import { getItem } from '@/utils/asyncstorage';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();

  // State to track whether onboarding has been completed
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean | null>(null);

  // Check if onboarding has been completed
  useEffect(() => {
    const checkOnboarding = async () => {
      const onboardingStatus = await getItem('onboarding');
      if (onboardingStatus) {
       
        router.replace('/(auth)/login');
        setOnboardingCompleted(true); 
      } else {
        setOnboardingCompleted(false); 
      }
    };
    checkOnboarding();
  }, [router]);
  if (onboardingCompleted === null) {
    return null; 
  }

  return onboardingCompleted ? null : <OnboardScreen />;
}
