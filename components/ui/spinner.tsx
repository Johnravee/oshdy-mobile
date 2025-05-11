import { View, Text } from 'react-native'
import React from 'react'
import LottieView from 'lottie-react-native'

export default function Spinner() {
  return (
    <View className="absolute w-screen z-50 bg-white/15 flex flex-row justify-center h-screen items-center">
        <LottieView
            source={require('../../assets/images/lottie/spinner.json')}
            autoPlay
            loop
            style={{ width: 200, height: 200 }}
            />
    </View>
  )
}