import React from 'react';
import { ChatProvider } from './context/ChatContext';
import Header from './components/Header';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';
import { Bot } from 'lucide-react';

function App() {
  return (
    <ChatProvider>
      <div className="flex flex-col h-screen bg-gray-100">
        <Header />
        <ChatWindow />
        <ChatInput />
      </div>
    </ChatProvider>
  );
}

export default App;