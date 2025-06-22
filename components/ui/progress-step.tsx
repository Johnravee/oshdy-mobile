import React, { useState, useEffect} from 'react';
import { View, Text, Pressable } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';


type Step = {
  label: string;
  icon: string;
}

type Props = {
  steps: Step[];
  activeSteps: number
};


export default function ProgressStep({steps, activeSteps} : Props) {
  const [activeStep, setActiveStep] = useState(activeSteps);

  useEffect(() => {
    setActiveStep(activeSteps);
  }, [activeSteps]);

  return (
    <View className="flex-1 bg-white pt-10 px-4">
      {/* Custom Stepper */}
      <View className="flex-row justify-between items-center mb-16">
        {steps.map((step, index)  => {
          const isActive = index === activeStep;
          const isCompleted = index < activeStep;

          const bgColor = isCompleted
            ? 'bg-green-500'
            : isActive
            ? 'bg-blue-500'
            : 'bg-gray-300';

          const iconColor = isCompleted || isActive ? '#fff' : '#6b7280';

          return (
            <View key={index} className="flex-1 items-center relative">
              {/* Line Connector */}
              {index !== 0 && (
                <View
                  className={`absolute top-5 left-[-50%] h-1 w-full z-0 ${
                    index <= activeStep ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                />
              )}

              {/* Icon Circle */}
              <View
                className={`w-10 h-10 rounded-full justify-center items-center z-10 ${bgColor}`}
              >
                <FontAwesome name={step.icon as any} size={20} color={iconColor} />
              </View>

              {/* Label */}
              <Text
                className={`absolute mt-2 text-xs text-center ${
                  isActive ? 'text-black font-semibold' : 'text-gray-500'
                }`}
                style={{top : 40}}
              >
                {step.label}
              </Text>
            </View>
          );
        })}
      </View>

      {/* Step Description */}
      <View className="items-center px-4">
        <Text className="text-base text-gray-700 text-center">
          {steps[activeStep].label === 'Confirmed' && 'The event has been confirmed.'}
          {steps[activeStep].label === 'Ongoing' && 'The event is happening now.'}
          {steps[activeStep].label === 'Completed' && 'The event has ended successfully.'}
          {steps[activeStep].label === 'Archived' && 'The event has been archived.'}
        </Text>
      </View>

    
    </View>
  );
}
