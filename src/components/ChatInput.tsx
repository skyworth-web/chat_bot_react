import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { useChat } from '../context/ChatContext';

const ChatInput: React.FC = () => {
  const [input, setInput] = useState('');
  const { sendMessage, isConnected } = useChat();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && isConnected) {
      sendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="flex items-center gap-2 border-t border-gray-200 p-4 bg-white"
    >
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
        className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={!isConnected}
      />
      <button
        type="submit"
        className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        disabled={!input.trim() || !isConnected}
      >
        <Send size={20} />
      </button>
    </form>
  );
};

export default ChatInput;