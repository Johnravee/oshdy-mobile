/**
 * @file ChatMessageContext.tsx
 * @description
 * Provides chat message state management for one-on-one messaging between a user and the first available admin.
 * Handles real-time updates, sending, deletion, and fetching of messages.
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
import { logError, logInfo, logSuccess } from '@/utils/logger';

// Create context
const ChatMessageContext = createContext<ChatMessageContextProps | undefined>(undefined);

// Provider component
export const ChatMessageProvider = ({ children }: { children: React.ReactNode }) => {
  const { profile } = useProfileContext();

  const [adminId, setAdminId] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  /**
   * Fetch first available admin (is_admin = true)
   */
  useEffect(() => {
    const fetchAdminId = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('is_admin', true)
        .limit(1)
        .maybeSingle();

      if (error) {
        logError('👤 fetchAdminId', error);
      } else if (data) {
        setAdminId(data.id);
        logSuccess('👤 fetchAdminId → Admin ID fetched', data);
      } else {
        logInfo('👤 fetchAdminId → No admin found');
      }
    };

    fetchAdminId();
  }, []);

  /**
   * Fetch message history between user and current admin
   */
  const fetchMessages = useCallback(async () => {
    if (!profile?.id || !adminId) {
      logInfo('📜 fetchMessages → Skipped due to missing profile/admin ID');
      return;
    }

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(
        `and(sender_id.eq.${profile.id},receiver_id.eq.${adminId}),and(sender_id.eq.${adminId},receiver_id.eq.${profile.id})`
      )
      .order('created_at', { ascending: true });

    if (error) {
      logError('📜 fetchMessages → Error fetching chat history', error);
    } else {
      setMessages(data as ChatMessage[]);
      logSuccess('📜 fetchMessages → Loaded chat history', data);
    }

    setLoading(false);
  }, [profile?.id, adminId]);

  /**
   * Send a message from user to admin
   */
  const sendMessage = async (text: string) => {
    if (!profile?.id || !text.trim() || !adminId) {
      logInfo('📨 sendMessage → Skipped due to missing profile/admin/text');
      return;
    }

    setSending(true);

    const { data, error } = await supabase.from('messages').insert([
      {
        sender_id: profile.id,
        receiver_id: adminId,
        content: text.trim(),
      },
    ]);

    setSending(false);

    if (error) {
      logError('📨 sendMessage → Failed to send message', error);
    } else {
      logSuccess('📨 sendMessage → Message sent', data);
    }
  };

  /**
   * Delete a message by ID
   */
  const deleteMessage = async (id: number) => {
    const { error } = await supabase.from('messages').delete().eq('id', id);

    if (error) {
      logError(`🗑 deleteMessage → Failed to delete message ID: ${id}`, error);
    } else {
      logSuccess(`🗑 deleteMessage → Deleted message ID ${id}`);
    }
  };

  /**
   * Real-time listener for incoming/outgoing messages
   */
  useEffect(() => {
    if (!profile?.id || !adminId) {
      logInfo('📡 Listener → Skipped subscription due to missing profile/admin ID');
      return;
    }

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
        (payload) => {
          const msg = payload.new as ChatMessage;

          const isToUser = msg.receiver_id === profile.id && msg.sender_id === adminId;
          const isFromUser = msg.sender_id === profile.id && msg.receiver_id === adminId;

          if (!isToUser && !isFromUser) return;

          setMessages((prev = []) => [...prev, msg]);

          if (isToUser) {
            setHasNewMessage(true);
            logInfo('📡 Listener → New message received', msg);
          } else {
            logInfo('📡 Listener → New message sent', msg);
          }
        }
      )
      .subscribe();

    logInfo('📡 Listener → Subscribed to message_notifications');

    return () => {
      supabase.removeChannel(channel);
      logInfo('📴 Listener → Unsubscribed from message_notifications');
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
      }}
    >
      {children}
    </ChatMessageContext.Provider>
  );
};

// Hook to use chat message context
export const useChatMessageContext = () => {
  const context = useContext(ChatMessageContext);
  if (!context) {
    throw new Error('useChatMessageContext must be used within a ChatMessageProvider');
  }
  return context;
};
