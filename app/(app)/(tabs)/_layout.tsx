import { Redirect, Tabs } from 'expo-router';
import { useAuthContext } from '@/context/AuthContext';
import { FontAwesome } from '@expo/vector-icons';
import { View } from 'react-native';
import { useChatMessageContext } from '@/context/ChatMessageContext';
import { useEffect } from 'react';


export default function AppLayout() {
  const { session } = useAuthContext();
  const { hasNewMessage } = useChatMessageContext(); 

  if (!session) {
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
          marginBottom: 2, // Optional: adjust spacing
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
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color, size }) => (
            <View className="relative">
              <FontAwesome name="comments" size={size} color={color} />
              {hasNewMessage && (
                <View
                  className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full"
                  style={{ transform: [{ translateX: 6 }, { translateY: 0 }] }}
                />
              )}
            </View>
          ),
        }}
      />


      <Tabs.Screen
        name="notification"
        options={{
          title: 'Notifications',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="bell" size={size} color={color} />
          ),
        }}
      />

  <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="user" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
