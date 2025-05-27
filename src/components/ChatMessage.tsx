import React from 'react';
import { Message } from '../types';
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isBot = message.sender === 'bot';
  const formattedTime = new Date(message.timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4`}>
      <div className={`flex max-w-[80%] ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
        <div className={`flex-shrink-0 flex items-start pt-1 ${isBot ? 'mr-2' : 'ml-2'}`}>
          <div className={`p-2 rounded-full ${isBot ? 'bg-blue-100' : 'bg-gray-200'}`}>
            {isBot ? <Bot size={20} className="text-blue-600" /> : <User size={20} className="text-gray-600" />}
          </div>
        </div>
        
        <div className={`flex flex-col ${isBot ? '' : 'items-end'}`}>
          <div className={`px-4 py-3 rounded-2xl ${
            isBot 
              ? 'bg-blue-100 text-gray-800 rounded-tl-none' 
              : 'bg-blue-600 text-white rounded-tr-none'
          }`}>
            <p className="whitespace-pre-wrap">{message.text}</p>
          </div>
          <span className="text-xs text-gray-500 mt-1 px-1">{formattedTime}</span>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;