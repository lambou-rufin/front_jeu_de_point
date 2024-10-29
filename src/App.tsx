import React, { useEffect } from 'react';
import './App.css';
import Router from './route/public/Router';
import WebSocketService from './shared/service/WebSocketService';
import WebSocketComponent from './workspace/modules/WebSocketComponent/WebSocketComponent';

function App() {
  useEffect(() => {
    WebSocketService.createInstanceSocket('ws://localhost:3002'); // Créez et connectez une instance de socket
  
    return () => {
      WebSocketService.close(); // Fermez la connexion lors du démontage du composant
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
