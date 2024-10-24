// src/components/Footer.tsx
import React from 'react';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import './Footer.css';

const Footer: React.FC = () => {
  const [value, setValue] = React.useState(0);

  return (
    <footer className="footer">
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        className="bottom-navigation"
      >
        <BottomNavigationAction label="Home" icon={<HomeIcon />} href="/home" />
        <BottomNavigationAction label="About" icon={<InfoIcon />} href="/about" />
        <BottomNavigationAction label="Settings" icon={<ContactMailIcon />} href="/settings" />
      </BottomNavigation>
    </footer>
  );
};

export default Footer;
