// src/components/Header.tsx

import React from 'react';
import './Header.css';
import GamepadIcon from '@mui/icons-material/Gamepad';

const Header: React.FC = () => {
  return (
    <header className="header">
     <h1>{<GamepadIcon />}/Good loka</h1>
    </header>
  );
};

export default Header;
