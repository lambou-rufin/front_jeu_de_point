// src/socket.ts
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const createInstanceSocket = (): Socket => {
  if (!socket) {
    socket = io('http://localhost:3001', {
      autoConnect: true,
    });
  }
  return socket;
};

// Fonction pour obtenir l'instance du socket
export const getSocketInstance = (): Socket | null => {
  return socket;
};

// Exporter l'instance de socket par défaut
export default socket;
