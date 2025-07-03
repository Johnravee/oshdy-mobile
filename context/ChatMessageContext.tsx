import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthContext } from '@/context/AuthContext';

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

const ChatMessageContext = createContext<ChatMessageContextProps | undefined>(undefined);

export const ChatMessageProvider = ({ children }: { children: React.ReactNode }) => {
  const { profile } = useAuthContext();
  const adminId = 35;
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
    } else {
      setMessages(data as ChatMessage[]);
    }

    setLoading(false);
  }, [profile?.id]);

  const sendMessage = async (text: string) => {
    if (!profile?.id || !text.trim()) return;

    await supabase.from('messages').insert([
      {
        sender_id: profile.id,
        receiver_id: adminId,
        content: text.trim(),
      },
    ]);
  };

  const deleteMessage = async (id: number) => {
    await supabase.from('messages').delete().eq('id', id);
  };

  useEffect(() => {
    if (!profile?.id) return;

    fetchMessages();

    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const msg = payload.new as ChatMessage;

            if (
              msg.sender_id === adminId &&
              msg.receiver_id === profile.id
            ) {
              setHasNewMessage(true);
              setMessages((prev) => [...prev, msg]);
            } else if (
              msg.sender_id === profile.id &&
              msg.receiver_id === adminId
            ) {
              setMessages((prev) => [...prev, msg]);
            }
          } else if (payload.eventType === 'DELETE') {
            const deleted = payload.old as ChatMessage;
            setMessages((prev) => prev.filter((m) => m.id !== deleted.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchMessages, profile?.id]);

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
