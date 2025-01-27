'use client';
import { useState } from 'react';

interface Message {
  sender: 'user' | 'bot';
  message: string;
}

export default function Home() {
  const [userMessage, setUserMessage] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<Message[]>([]);

  const handleSendMessage = async () => {
    if (!userMessage) return;

    const newMessage: Message = { sender: 'user', message: userMessage };
    setChatHistory([...chatHistory, newMessage]);

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: userMessage }),
    });

    const data = await response.json();

    const botMessage: Message = { sender: 'bot', message: data.message };
    setChatHistory([...chatHistory, newMessage, botMessage]);
    setUserMessage('');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4">
      <div className="w-full max-w-md p-6 border rounded-xl shadow-lg bg-white">
        <div className="h-80 overflow-auto mb-4">
          {chatHistory.map((msg, idx) => (
            <div key={idx} className={msg.sender === 'user' ? 'text-right' : 'text-left'}>
              <div className={`inline-block p-2 m-1 rounded-lg ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
                {msg.message}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            className="flex-1 p-2 border rounded-md"
            placeholder="Ask something..."
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
          />
          <button
            onClick={handleSendMessage}
            className="p-2 bg-blue-500 text-white rounded-md"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
