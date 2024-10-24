import React, { useEffect } from 'react';
import './App.css';
import Router from './route/public/Router';
import { createInstanceSocket } from './socket/socket';

function App() {
  useEffect(() => {
    // Initialiser le socket à l'ouverture de l'application
    createInstanceSocket();
  }, []);
  return (
    <div className="App">
       <Router/>
       </div>
  );
}

export default App;
