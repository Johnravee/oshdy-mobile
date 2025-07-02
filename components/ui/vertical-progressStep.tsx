import React from 'react';
import { View, Text } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

type Step = {
  label: string;
  icon: string;
  description?: string;
};

interface ProgressStepProps {
  steps: Step[];
  activeSteps: number; // index of current active step
}

export default function VerticalProgressStep({ steps, activeSteps }: ProgressStepProps) {
  return (
    <View className="flex flex-col items-start">
      {steps.map((step, index) => {
        const isActive = index === activeSteps;
        const isCompleted = index < activeSteps;

        return (
          <View key={index} className="flex-row items-start mb-2">
            {/* Left side: Icon and vertical line */}
            <View className="items-center mr-4">
              <View
                className={`w-10 h-10 rounded-full justify-center items-center border-2 ${
                  isActive
                    ? ' bg-secondary shadow-md'
                    : isCompleted
                    ? 'bg-secondary shadow-md'
                    : 'border-gray-400 bg-white'
                }`}
              >
                <FontAwesome
                  name={step.icon as any}
                  size={16}
                  color={
                    isActive ? '#ffffff' : isCompleted ? 'white' : 'gray'
                  }
                />
              </View>

              {/* Vertical line, hide on last */}
              {index !== steps.length - 1 && (
                <View
                  className={`w-1 h-12 mt-1 ${
                    isCompleted ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              )}
            </View>

            {/* Right side: Labels */}
            <View>
              <Text
                className={`text-lg font-semibold ${
                  isActive
                    ? 'text-blue-600'
                    : isCompleted
                    ? 'text-blue-500'
                    : 'text-gray-600'
                }`}
              >
                {step.label}
              </Text>
              {step.description && (
                <Text className="text-gray-500 text-sm mt-1">{step.description}</Text>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}
