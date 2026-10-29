export type ChatRoom = 'GENERAL' | 'TECH_SUPPORT';

export type ChatMessage = {
  id: string;
  room: ChatRoom;
  message: string;
};

export function Chat({
  messages,
  room,
  typingCount,
  socketId,
  onRoomChange,
}: {
  messages: ChatMessage[];
  room: ChatRoom;
  typingCount: number;
  socketId: string | undefined;
  onRoomChange: (room: ChatRoom) => void;
}) {
  
  return (
    <div className="flex flex-col">
        <div className="">
            <select
              className="w-full border-2 p-2 rounded"
              value={room}
              onChange={event => onRoomChange(event.target.value as ChatRoom)}
            >
                <option value="GENERAL">GENERAL</option>
                <option value="TECH_SUPPORT">TECH_SUPPORT</option>
            </select>
        </div>

        <div className="w-full h-96 p-2 rounded overflow-y-auto bg-gray-300">
            <div className="flex flex-col gap-5">
                {messages
                  .filter(chatMessage => chatMessage.room === room)
                  .map(chatMessage => (
                    <p
                      key={chatMessage.id}
                      className="self-start bg-blue-800 text-white py-1 px-3 rounded-2xl flex-wrap"
                    >
                      {chatMessage.message}
                    </p>
                  ))}
            </div>
            {typingCount > 0 && (
              <p aria-live="polite" className="mt-2 text-sm text-gray-700">
                {typingCount === 1 ? `${socketId} is typing...` : `${typingCount} people are typing...`}
              </p>
            )}
        </div>
        
    </div>
  );
}