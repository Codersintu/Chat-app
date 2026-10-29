
export function ConnectionState({ isConnected }: { isConnected: boolean }) {
  return (
    <div className="flex gap-2 items-center">
      <p>Connection Status: </p>
      <p className={`font-bold ${isConnected ? 'text-green-500' : 'text-red-500'}`}>{ isConnected ? 'Connected' : 'Disconnected' }</p>
    </div>
  );
}
