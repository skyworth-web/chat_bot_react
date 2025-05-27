import React, { useRef, useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import ChatMessage from './ChatMessage';
import { Bot } from 'lucide-react';

const ChatWindow: React.FC = () => {
  const { messages } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
      {messages.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-gray-500">
          <div className="bg-blue-100 p-4 rounded-full mb-4">
            <Bot size={40} className="text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Welcome to ModernChat</h3>
          <p className="text-center max-w-md">
            I'm your AI assistant powered by OpenAI. Ask me anything and I'll do my best to help!
          </p>
        </div>
      ) : (
        messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatWindow;