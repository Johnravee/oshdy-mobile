/**
 * @file ChatMessageContext.tsx
 * @description
 * Provides chat message state management for one-on-one messaging between a user and the admin.
 * This context handles fetching, sending, deleting, and listening for real-time message updates.
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { supabase } from '@/lib/supabase';
import { useProfileContext } from './ProfileContext';
import { ChatMessage, ChatMessageContextProps } from '@/types/chat-types';

const ChatMessageContext = createContext<ChatMessageContextProps | undefined>(undefined);

export const ChatMessageProvider = ({ children }: { children: React.ReactNode }) => {
  const { profile } = useProfileContext();
  const [adminId, setAdminId] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch admin ID (first user with is_admin = true)
  useEffect(() => {
    const fetchAdminId = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('is_admin', true)
        .limit(1)
        .single();

      if (error) {
        console.error('❌ Failed to fetch admin ID:', error.message);
      } else if (data) {
        setAdminId(data.id);
      }
    };

    fetchAdminId();
  }, []);

  const fetchMessages = useCallback(async () => {
    if (!profile?.id || !adminId) return;

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
  }, [profile?.id, adminId]);

  const sendMessage = async (text: string) => {
    if (!profile?.id || !text.trim() || !adminId) return;

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
    if (!profile?.id || !adminId) return;

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

          if (msg.receiver_id === profile.id && msg.sender_id === adminId) {
            console.log('📩 New incoming message:', msg);
            setMessages((prev) => [...prev, msg]);
            setHasNewMessage(true);

            /* Uncomment to enable push notifications
            await notifee.displayNotification({
              title: '📩 New Message',
              body: 'You have a new message from the admin.',
              android: {
                channelId: 'default',
                importance: AndroidImportance.HIGH,
                sound: 'default',
              },
            });
            */
          } else if (msg.sender_id === profile.id && msg.receiver_id === adminId) {
            setMessages((prev) => [...prev, msg]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchMessages, profile?.id, adminId]);

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
    throw new Error('useChatMessageContext must be used within a ChatMessageProvider');
  }
  return context;
};
