import React, { useEffect } from 'react';
import WebSocketService from '../../../shared/service/WebSocketService';
import Footer from '../../../main/app/layout/Footer';
import { Button } from '@mui/material';

const GameComponent: React.FC = () => {
  useEffect(() => {
    const token = localStorage.getItem("accessToken") || "";
    WebSocketService.createInstanceSocket("http://localhost:3002", token); // Create and connect a socket instance

    return () => {
      // WebSocketService.closeSocket(); // Close the socket connection on component unmount
    };
  }, []);

  const sendMessage = () => {
    WebSocketService.sendMessage('customEvent', 'Hello from the client!');
  };

  return (
    <div>
      <h1>Game Component</h1>
      <Button variant="contained" onClick={sendMessage} color="primary">
        Send Message
      </Button>
      <Footer />
    </div>
  );
};

export default GameComponent;
