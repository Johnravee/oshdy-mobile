import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
  } from 'react';
  import { supabase } from '@/lib/supabase';
  import { useAuthContext } from '@/context/AuthContext';
  import { sendPushNotification } from '@/utils/sendpushnotification';
  
  export interface ChatMessage {
    id: number;
    sender_id: number;
    receiver_id: number;
    content: string;
    created_at: string;
  }
  
  interface ChatMessageContextProps {
    messages: ChatMessage[];
    sendMessage: (text: string) => Promise<void>;
    deleteMessage: (id: number) => Promise<void>;
    hasNewMessage: boolean;
    setHasNewMessage: React.Dispatch<React.SetStateAction<boolean>>;
    loading: boolean;
    error: string | null;
  }
  
  const ChatMessageContext = createContext<ChatMessageContextProps | undefined>(
    undefined
  );
  
  export const ChatMessageProvider = ({ children }: { children: React.ReactNode }) => {
    const { profile } = useAuthContext();
    const adminId = 36;
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [hasNewMessage, setHasNewMessage] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    const fetchMessages = useCallback(async () => {
      if (!profile?.id) return;
  
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(
          `and(sender_id.eq.${profile.id},receiver_id.eq.${adminId}),and(sender_id.eq.${adminId},receiver_id.eq.${profile.id})`
        )
        .order('created_at', { ascending: true });
  
      if (error) {
        setError(error.message);
        console.error('❌ Fetch error:', error.message);
      } else {
        setMessages(data as ChatMessage[]);
      }
  
      setLoading(false);
    }, [profile?.id]);
  
    const sendMessage = async (text: string) => {
      if (!profile?.id || !text.trim()) return;
  
      const { error } = await supabase.from('messages').insert([
        {
          sender_id: profile.id,
          receiver_id: adminId,
          content: text.trim(),
        },
      ]);
  
      if (error) {
        console.error('❌ Failed to send message:', error.message);
      } else {
        console.log('✅ Message sent');
      }
    };
  
    const deleteMessage = async (id: number) => {
      const { error } = await supabase.from('messages').delete().eq('id', id);
      if (error) console.error('❌ Delete failed:', error.message);
    };
  
    useEffect(() => {
      if (!profile?.id) return;
  
      fetchMessages();
  
      const channel = supabase
        .channel('message_notifications')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
          },
          async (payload) => {
            const msg = payload.new as ChatMessage;
  
            if (msg.receiver_id === profile.id) {
              console.log('📩 New incoming message:', msg);
              setMessages((prev) => [...prev, msg]);
              setHasNewMessage(true);
  
              if (profile.expo_push_token) {
                console.log('🔔 Sending push to:', profile.expo_push_token);
                await sendPushNotification(profile.expo_push_token, msg.content);
              } else {
                console.warn('⚠️ No expo_push_token found on profile');
              }

              
            } else if (msg.sender_id === profile.id && msg.receiver_id === adminId) {
              // Add your own message too
              setMessages((prev) => [...prev, msg]);
            }
          }
        )
        .subscribe();
  
      return () => {
        supabase.removeChannel(channel);
      };
    }, [fetchMessages, profile?.id, profile?.expo_push_token]);
  
    return (
      <ChatMessageContext.Provider
        value={{
          messages,
          sendMessage,
          deleteMessage,
          hasNewMessage,
          setHasNewMessage,
          loading,
          error,
        }}
      >
        {children}
      </ChatMessageContext.Provider>
    );
  };
  
  export const useChatMessageContext = () => {
    const context = useContext(ChatMessageContext);
    if (!context) {
      throw new Error(
        'useChatMessageContext must be used within a ChatMessageProvider'
      );
    }
    return context;
  };
  