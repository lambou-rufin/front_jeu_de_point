// src/socket.ts

import { io } from "socket.io-client";

// Créer l'instance socket en se connectant au serveur
const socket = io("http://localhost:3000", {
  transports: ["websocket"],
});

export default socket;
