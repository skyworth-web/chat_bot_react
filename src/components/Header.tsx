import React from 'react';
import { Bot } from 'lucide-react';
import ConnectionStatus from './ConnectionStatus';

const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
      <div className="flex items-center">
        <div className="bg-blue-100 p-2 rounded-full mr-3">
          <Bot size={24} className="text-blue-600" />
        </div>
        <h1 className="text-xl font-bold text-gray-800">ModernChat</h1>
      </div>
      <ConnectionStatus />
    </header>
  );
};

export default Header;