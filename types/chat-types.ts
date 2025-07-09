  export interface ChatMessage {
    id: number;
    sender_id: number;
    receiver_id: number;
    content: string;
    created_at: string;
  }
  
 export interface ChatMessageContextProps {
    messages: ChatMessage[];
    sendMessage: (text: string) => Promise<void>;
    deleteMessage: (id: number) => Promise<void>;
    hasNewMessage: boolean;
    setHasNewMessage: React.Dispatch<React.SetStateAction<boolean>>;
    loading: boolean;
    error: string | null;
  }