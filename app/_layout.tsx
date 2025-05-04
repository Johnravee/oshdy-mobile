import '../global.css'
import { Slot } from 'expo-router'
import { AuthProvider } from '@/context/AuthContext'
import { useAuth } from '@/hooks/useAuth';
export default function RootLayout() {
  useAuth(); // Mount this muna para gumana deep link
  return (
    <AuthProvider>
        <Slot />
    </AuthProvider>
  );
}