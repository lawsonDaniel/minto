import { useConnect } from 'wagmi';

export function Profile() {
  const { connect, connectors, error, isLoading, pendingConnector } = useConnect();

  return (
    <div className="mt-10 flex flex-col gap-[10px]">
      {connectors
        .filter(connector => connector.ready)
        .map(connector => (
          <button
            key={connector?.id}
            className="bg-black text-xl text-[100] h-[60px] w-[200px] text-white"
            onClick={() => connect({ connector })}
          >
            {connector.name}
            {isLoading && connector?.id === pendingConnector?.id && ' (connecting)'}
          </button>
        ))}
      {error && <div className="text-red-500">{error.message}</div>}
    </div>
  );
}
