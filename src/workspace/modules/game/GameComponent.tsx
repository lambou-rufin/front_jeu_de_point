import React, { useEffect } from 'react';
import WebSocketService from '../../../shared/service/WebSocketService';
import Footer from '../../../main/app/layout/Footer';
import { Button } from '@mui/material';

const GameComponent: React.FC = () => {
    useEffect(() => {
        WebSocketService.createInstanceSocket('ws://localhost:3002'); // Créez et connectez une instance de socket
      
        return () => {
          WebSocketService.close(); // Fermez la connexion lors du démontage du composant
        };
      }, []);
      

  const sendMessage = () => {
    WebSocketService.sendMessage('customEvent', 'Hello from the client!');
  };

  return (
    <div>
      <h1>Game Component</h1>
      <Button className="game" variant="contained" onClick={sendMessage} color="primary">Send Message</Button>
        <Footer/>
    </div>
  );
};

export default GameComponent;
