import { useEffect, useCallback } from 'react';
import { getSocketInstance } from '../socket/socket';

const useSocket = <T>(eventName: string, callback: (data: T) => void) => {
  const memoizedCallback = useCallback(callback, [callback]);

  useEffect(() => {
    const socket = getSocketInstance();

    if (!socket) {
      console.error('Socket non initialisé'); // Afficher une erreur si le socket n'est pas encore initialisé
      return;
    }

    // S'abonner à l'événement
    socket.on(eventName, memoizedCallback);

    // Se désabonner lors du démontage du composant
    return () => {
      socket.off(eventName, memoizedCallback);
    };
  }, [eventName, memoizedCallback]);
};

export default useSocket;
