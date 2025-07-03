import '../global.css'
import { Slot } from 'expo-router'
import { AuthProvider } from '@/context/AuthContext'
import { useAuth } from '@/hooks/useAuth';
import { ChatMessageProvider } from '@/context/ChatMessageContext';

function DeepLinkBootstrapper() {
  useAuth(); // ✅ this is now safe
  return null;
}

export default function RootLayout() {


  return (
    <AuthProvider>
      <ChatMessageProvider>
        <DeepLinkBootstrapper />
        <Slot />
      </ChatMessageProvider>
    </AuthProvider>
  );
}
