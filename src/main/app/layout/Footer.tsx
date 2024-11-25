// src/components/Footer.tsx
import React, { useState } from "react";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import "./Footer.css";
import { Logout, RuleSharp } from "@mui/icons-material";

const Footer: React.FC = () => {
  const [value, setValue] = useState(0);

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
        <BottomNavigationAction 
        label="Home"
         icon={<HomeIcon />} href="/round" />
        <BottomNavigationAction
          label="Reglèment"
          icon={<RuleSharp />}
          href="/about"
        />
        <BottomNavigationAction className="quitter"
          label="Logout"
          icon={<Logout />}
          href="/logout"
        />
      </BottomNavigation>
    </footer>
  );
};

export default Footer;
