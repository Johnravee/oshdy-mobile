import { View, Text, TouchableOpacity } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import React from 'react'
import { useRouter } from 'expo-router'

export default function BackButton() {
    const route = useRouter()
  return (
    <>
        <TouchableOpacity
         onPress={route.back}
         className="flex-row items-center mb-4"
        >
            <FontAwesome name="arrow-left" size={20} color="#374151" />
            <Text className="ml-2 text-gray-700 text-base">Back</Text>
        </TouchableOpacity>
    </>
  )
}