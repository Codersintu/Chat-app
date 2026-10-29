
import { socket } from '../socket';

export function ConnectionManager() {
  function connect() {
    socket.connect();
  }

  function disconnect() {
    socket.disconnect();
  }

  return (
    <div className="flex gap-5">
      <button onClick={ connect } className="bg-blue-500 text-white px-4 py-2 rounded">Connect</button>
      <button onClick={ disconnect } className="bg-red-500 text-white px-4 py-2 rounded">Disconnect</button>
    </div>
  );
}