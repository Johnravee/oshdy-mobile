import { Text, Pressable } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import React, { useCallback } from 'react'
import { useRouter } from 'expo-router'
import { useNavigation } from '@react-navigation/native'

type Props = {
  variant: 'dark' | 'white'
  fallbackHref?: string 
}

export default function BackButton({ variant, fallbackHref }: Props) {
  const router = useRouter()
  const navigation = useNavigation()

  const handleBack = useCallback(() => {
    // Prefer real back if history exists
    if (navigation && typeof (navigation as any).canGoBack === 'function' && (navigation as any).canGoBack()) {
      router.back()
      return
    }
    // If no history, use an explicit fallback when provided; otherwise do nothing
    if (fallbackHref) {
      router.replace(fallbackHref as any)
    }
  }, [navigation, router, fallbackHref])

  const iconColor = variant === 'dark' ? '#333333' : '#ffffff'
  const textClass = variant === 'dark' ? 'text-dark' : 'text-white'

  return (
    <Pressable
      onPress={handleBack}
      accessibilityRole="button"
      accessibilityLabel="Go back"
      className={`flex-row items-center mb-4 ${textClass}`}
    >
      <FontAwesome name="arrow-left" size={20} color={iconColor} />
      <Text className={`ml-2 text-gray-700 text-base ${textClass}`}>Back</Text>
    </Pressable>
  )
}