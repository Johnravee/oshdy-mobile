import '../global.css'
import { Slot } from 'expo-router'
import { AuthProvider } from '@/context/AuthContext'
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';

function DeepLinkBootstrapper() {
  useAuth(); // ✅ this is now safe
  return null;
}

export default function RootLayout() {


  return (
    <AuthProvider>
      <DeepLinkBootstrapper />
      <Slot />
    </AuthProvider>
  );
}
