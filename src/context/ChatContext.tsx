import React, { createContext, useContext, useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { Message, ChatContextType } from '../types';

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Get the WebSocket URL based on the environment
const WS_URL = import.meta.env.PROD 
  ? window.location.origin.replace(/^http/, 'ws')
  : 'http://localhost:3001';

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Connect to the WebSocket server with reconnection options
    const newSocket = io(WS_URL, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000
    });
    
    setSocket(newSocket);

    // Set up event listeners
    newSocket.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to server');
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from server');
    });

    newSocket.on('connect_error', (error) => {
      console.log('Connection error:', error);
      setIsConnected(false);
    });

    newSocket.on('receiveMessage', (message: Message) => {
      setMessages(prevMessages => [...prevMessages, message]);
    });

    // Clean up on unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  const sendMessage = (text: string) => {
    if (!socket || !isConnected) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    // Add the message to the local state
    setMessages(prevMessages => [...prevMessages, newMessage]);

    // Send the message to the server
    socket.emit('sendMessage', newMessage);
  };

  return (
    <ChatContext.Provider value={{ messages, sendMessage, isConnected }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};