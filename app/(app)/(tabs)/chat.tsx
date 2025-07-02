import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  Image,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useChatMessages } from '@/hooks/useChatMessage';
import { useAuthContext } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import BackButton from '@/components/ui/back-button';

export default function Chat() {
  const [message, setMessage] = useState('');
  const { profile } = useAuthContext();
  const { messages, sendMessage, deleteMessage} = useChatMessages();

  const handleSend = async () => {
    if (!message.trim() || !profile?.id) return;

    sendMessage(message)
    setMessage('');
  };

  const handleLongPress = (msg: any) => {
    if(!profile?.id) return;

    if (msg.sender_id !== profile.id) return;

    
    Alert.alert('Message Options', 'What do you want to do?', [
      {
        text: 'Edit',
        onPress: () => {
          setMessage(msg.content);
          supabase.from('messages').delete().eq('id', msg.id);
        },
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteMessage(msg.id)
        },
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]);
  };

  const renderMessage = ({ item }: { item: any }) => {
    const isUser = item.sender_id === profile?.id;
  
    return (
      <View className={`w-full flex-row ${isUser ? 'justify-end' : 'justify-start'}`}>
        <TouchableOpacity
          onLongPress={() => handleLongPress(item)}
          className={`max-w-[75%] p-3 rounded-2xl mb-2 shadow-md ${
            isUser ? 'bg-[#D4A83F] rounded-tr-none' : 'bg-[#2E3A8C] rounded-tl-none'
          }`}
        >
          <View>
            <Text className="text-white text-sm">{item.content}</Text>
            <Text className="text-white/70 text-[10px] mt-1 text-right">
              {new Date(item.created_at).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };
  

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-[#2E3A8C] pb-4 pt-6 rounded-b-3xl shadow-lg px-4">
        <View className="flex-row items-center justify-between">
          <BackButton variant="white" />
          <View className="flex-1" />
          <View className="flex-row items-center space-x-3 gap-2">
            <View className="items-end">
              <Text className="text-white font-semibold text-base">Admin</Text>
              <Text className="text-white/70 text-xs">Online</Text>
            </View>
            <Image
              source={require('../../../assets/images/oshdylogo.jpg')}
              className="w-10 h-10 rounded-full bg-white/20"
            />
          </View>
        </View>
      </View>

      {/* Messages */}
      <FlatList
        data={[...messages].reverse()}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderMessage}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        inverted
      />

      {/* Input */}
      <View className="flex-row items-center px-4 py-3 border-t border-gray-200 bg-white">
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message..."
          className="flex-1 bg-gray-100 rounded-full px-4 py-2 mr-2 text-sm"
        />
        <TouchableOpacity
          onPress={handleSend}
          className="bg-[#D4A83F] p-3 rounded-full shadow"
        >
          <FontAwesome name="send" size={16} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
