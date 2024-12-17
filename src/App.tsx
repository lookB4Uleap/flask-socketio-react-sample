import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Send, MessageSquare } from 'lucide-react';

function App() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<string[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const newSocket = io('http://localhost:5000');

    newSocket.on('connect', () => {
      console.log('Connected to server');
      setConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setConnected(false);
    });

    newSocket.on('welcome', (data) => {
      setMessages(prev => [...prev, `Server: ${data.data}`]);
    });

    newSocket.on('response', (data) => {
      setMessages(prev => [...prev, `Server: ${data.data}`]);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && socket) {
      socket.emit('message', message);
      setMessages(prev => [...prev, `You: ${message}`]);
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-2 mb-6">
            <MessageSquare className="w-6 h-6 text-blue-500" />
            <h1 className="text-2xl font-bold text-gray-800">Flask SocketIO Chat</h1>
            <div className={`ml-auto px-3 py-1 rounded-full text-sm ${
              connected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {connected ? 'Connected' : 'Disconnected'}
            </div>
          </div>

          <div className="h-96 overflow-y-auto mb-4 p-4 bg-gray-50 rounded-lg">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-2 p-2 rounded-lg ${
                  msg.startsWith('You:') 
                    ? 'bg-blue-100 text-blue-800 ml-auto max-w-[80%]' 
                    : 'bg-gray-200 text-gray-800 mr-auto max-w-[80%]'
                }`}
              >
                {msg}
              </div>
            ))}
          </div>

          <form onSubmit={sendMessage} className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={!connected}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;