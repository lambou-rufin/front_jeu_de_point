import React, { useEffect } from 'react';
import './App.css';
import Router from './route/public/Router';
import WebSocketService from './shared/service/WebSocketService';
import WebSocketComponent from './workspace/modules/WebSocketComponent/WebSocketComponent';

function App() {
  useEffect(() => {
    // Créez et connectez le socket
    WebSocketService.createInstanceSocket("ws://localhost:3002");

    return () => {
      // Fermez la connexion au socket lors du démontage du composant
      WebSocketService.closeSocket(); // Utilisez closeSocket au lieu de close
    };
  }, []);
  
  return (
    <div className="App">
       <WebSocketComponent />
       <Router/>
       </div>
  );
}

export default App;
