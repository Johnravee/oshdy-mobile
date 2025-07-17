import { View, Text, Pressable } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import React from 'react'
import { useRouter } from 'expo-router'

export default function BackButton({ variant } : {variant: string}) {
    const route = useRouter()
  return (
    <>
        <Pressable
         onPress={route.back}
         className={`flex-row items-center mb-4 ${variant === 'dark' ? 'text-dark' : variant === 'white' && 'text-white'}`}
        >
            <FontAwesome name="arrow-left" size={20} color={`${variant === 'dark' ? '#333333' : variant === 'white' && '#ffffff'}`} />
            <Text className={`ml-2 text-gray-700 text-base ${variant === 'dark' ? 'text-dark' : variant === 'white' && 'text-white'} `}>Back</Text>
        </Pressable>
    </>
  )
}