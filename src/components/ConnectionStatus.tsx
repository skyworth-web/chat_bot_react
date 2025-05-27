import React from 'react';
import { useChat } from '../context/ChatContext';
import { Wifi, WifiOff } from 'lucide-react';

const ConnectionStatus: React.FC = () => {
  const { isConnected } = useChat();

  return (
    <div className={`flex items-center px-3 py-1 text-xs rounded-full ${
      isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
    }`}>
      {isConnected ? (
        <>
          <Wifi size={14} className="mr-1" />
          <span>Connected</span>
        </>
      ) : (
        <>
          <WifiOff size={14} className="mr-1" />
          <span>Disconnected</span>
        </>
      )}
    </div>
  );
};

export default ConnectionStatus;