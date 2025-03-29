import { Text } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';

interface CountdownTimerProps {
  second: number; 
  handleTimeStop: () => void;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ second, handleTimeStop }) => {
  const [countdown, setCountdown] = useState<number>(second); 
  const timerRef = useRef<NodeJS.Timeout | null>(null); 

  useEffect(() => {
    if (countdown > 0) {
      timerRef.current = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current as NodeJS.Timeout); 
      if(countdown === 0){
        handleTimeStop();
      }
    }

    return () => clearInterval(timerRef.current as NodeJS.Timeout); 
  }, [countdown]);

  return <Text>{countdown}</Text>; 
};

export default CountdownTimer;
