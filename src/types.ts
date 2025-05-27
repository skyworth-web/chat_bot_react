export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
}

export interface ChatContextType {
  messages: Message[];
  sendMessage: (text: string) => void;
  isConnected: boolean;
}