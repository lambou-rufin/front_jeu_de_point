import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const useWebSocket = (url: string, token: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState<boolean>(false);

  useEffect(() => {
    const socketInstance = io(url, {
      transportOptions: {
        polling: {
          extraHeaders: {
            authorization: `Bearer ${token}`,
          },
        },
      },
    });

    socketInstance.on('connect', () => {
      console.log('Connected to the server');
      setConnected(true);
    });

    socketInstance.on('connect_error', (error) => {
      console.error('Connection error', error);
      setConnected(false);
    });

    socketInstance.on('disconnect', () => {
      console.log('Disconnected');
      setConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
      setSocket(null);
    };
  }, [url, token]);

  return { socket, connected };
};

export default useWebSocket;
