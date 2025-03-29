import React, { useEffect } from 'react';
import { View, Text, StatusBar, Button } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';

function Dashboard() {

  const router = useRouter();

  async function signOut() {
  const { error } = await supabase.auth.signOut()
  router.replace('/(auth)/login')
  console.log("Logging out")
}

 // Check if the user is authenticated whenever the screen mounts
 useEffect(()=>{
    
     const checkUserSession = async () =>{
       const { data: { user } } = await supabase.auth.getUser()
       if(!user)  router.replace('/(auth)/login')
     }
     checkUserSession();
   },[])

  


  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <StatusBar hidden={true} />
      <Text>Dashboard </Text>
      
      <Button title='Sign out' onPress={signOut} />
    </View>
  );
}

export default Dashboard;