import { useEffect, useState } from 'react';
import './App.css'
import { socket } from './socket';
import { ConnectionState } from './component/ConnectionState';
import { ConnectionManager } from './component/ConnectionManager';
import { MyForm } from './component/MyForm';
import { Chat, type ChatMessage, type ChatRoom } from './component/Chat';

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [room, setRoom] = useState<ChatRoom>('GENERAL');
  const [typingUsers, setTypingUsers] = useState<Record<string, ChatRoom>>({});
  console.log("socket id", typingUsers, socket.id);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
      setTypingUsers({});
    }

    function onChatMessage(message: ChatMessage) {
      setMessages(previous => [...previous, message]);
    }

    function onTyping(update: { room: ChatRoom; socketId: string; isTyping: boolean }) {
      if (!update.socketId || update.socketId === socket.id) return;

      const key = `${update.room}:${update.socketId}`;
      setTypingUsers(previous => {
        const next = { ...previous };
        if (update.isTyping) {
          next[key] = update.room;
        } else {
          delete next[key];
        }
        return next;
      });
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('chat message', onChatMessage);
    socket.on('typing', onTyping);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('chat message', onChatMessage);
      socket.off('typing', onTyping);
    };
  }, []);

  useEffect(() => {
    socket.emit('join room', room, (response: { error?: string }) => {
      if (response?.error) {
        console.error(`Could not join ${room}: ${response.error}`);
      }
    });
  }, [room]);


  return (
    <div className="w-full max-w-6xl min-h-screen mx-auto p-4 border-2 flex flex-col gap-20">
      <div className="flex justify-between items-center">
          <ConnectionState isConnected={ isConnected } />
          <ConnectionManager />
      </div>
      <div className="">
      <Chat
        messages={messages}
        room={room}
        typingCount={Object.values(typingUsers).filter(typingRoom => typingRoom === room).length}
        socketId={socket.id}
        onRoomChange={setRoom}
      />
      <MyForm room={room} />
      </div>
    </div>
  )
}

export default App
