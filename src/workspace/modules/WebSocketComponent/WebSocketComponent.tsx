import React, { useEffect } from 'react';

const WebSocketComponent = () => {
  useEffect(() => {
    const socket = new WebSocket('ws://localhost:3002/socket.io/?EIO=4&transport=websocket');

    socket.onopen = () => {
      console.log('Connection established!');
    };

    socket.onerror = (error) => {
      console.error('WebSocket Error: ', error);
    };

    socket.onclose = () => {
      console.log('Connection closed.');
    };

    // Nettoyer la connexion lors du démontage du composant
    return () => {
      socket.close();
    };
  }, []);

  return (
    <div>
      {/* <h1>WebSocket Component</h1> */}
      {/* Ajoutez d'autres éléments de l'interface utilisateur ici */}
    </div>
  );
};

export default WebSocketComponent;
