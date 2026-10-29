import React, { useEffect, useRef, useState } from 'react';
import { socket } from '../socket';
import type { ChatRoom } from './Chat';

export function MyForm({ room }: { room: ChatRoom }) {
  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTyping = useRef(false);

  function stopTyping() {
    if (typingTimer.current !== null) {
      clearTimeout(typingTimer.current);
      typingTimer.current = null;
    }

    if (isTyping.current) {
      socket.emit('typing', { room, isTyping: false });
      isTyping.current = false;
    }
  }

  useEffect(() => {
    return () => {
      if (typingTimer.current !== null) {
        clearTimeout(typingTimer.current);
        typingTimer.current = null;
      }

      if (isTyping.current) {
        socket.emit('typing', { room, isTyping: false });
        isTyping.current = false;
      }
    };
  }, [room]);

  function onInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const nextValue = event.target.value;
    setValue(nextValue);

    if (!nextValue.trim()) {
      stopTyping();
      return;
    }

    if (!isTyping.current) {
      socket.emit('typing', { room, isTyping: true });
      isTyping.current = true;
    }

    if (typingTimer.current !== null) {
      clearTimeout(typingTimer.current);
    }
    typingTimer.current = setTimeout(stopTyping, 1000);
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = value.trim();
    if (!message) return;

    stopTyping();
    setIsLoading(true);
    setError('');

    socket.timeout(5000).emit(
      'chat message',
      message,
      (err: Error | null, response?: { error?: string }) => {
        setIsLoading(false);
        if (err) {
          setError('Could not send message. Please try again.');
          return;
        }
        if (response?.error) {
          setError(response.error);
          return;
        }
        setValue('');
      },
    );
  }

  return (
    <div>
      <form onSubmit={ onSubmit } className="flex">
        <input className="w-full p-2 rounded outline-none border-2 border-blue-400" value={ value } onChange={ onInputChange } placeholder="Type your message..." />

        <button className='bg-blue-500 px-5 py-2 text-white font-bold rounded-xl' type="submit" disabled={ isLoading }>Submit</button>
      </form>
      {error && <p role="alert" className="text-red-700">{error}</p>}
    </div>
  );
}