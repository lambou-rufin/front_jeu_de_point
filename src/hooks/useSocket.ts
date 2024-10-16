// src/hooks/useSocket.ts
import { useEffect } from 'react';
import socket from '../socket/socket';


const useSocket = <T>(eventName: string, callback: (data: T) => void) => {
  useEffect(() => {
    socket.on(eventName, callback);

    return () => {
      socket.off(eventName, callback);
    };
  }, [eventName, callback]);
};

export default useSocket;
