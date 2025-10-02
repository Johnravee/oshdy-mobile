import { Redirect, Tabs } from 'expo-router';
import { useAuthContext } from '@/context/AuthContext';
import { FontAwesome } from '@expo/vector-icons';
import { View } from 'react-native';
import { useEffect } from 'react';


export default function AppLayout() {
  const { session } = useAuthContext();

  if (!session) {
    console.log("No session found, redirecting to login");
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2E3A8C',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: {
          
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#fff',
          height: 60,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          borderTopWidth: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 'bold',
        },
        tabBarItemStyle: {
          justifyContent: 'center',
          alignItems: 'center',
        },
        tabBarIconStyle: {
          marginBottom: 2, 
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="home" size={size} color={color} />
          ),
        }}
      />



  <Tabs.Screen
        name="more"
        options={{
          title: 'More',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="ellipsis-h" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
