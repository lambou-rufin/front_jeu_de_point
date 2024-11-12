import React, { useState } from "react";
import "./Header.css";
import GamepadIcon from "@mui/icons-material/Gamepad";
import {
  HistorySharp,
  Menu,
  MonetizationOn,
  Repeat,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import routes from "../../../route/public/routes";

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false); // État pour basculer le menu

  // Fonction pour basculer l'état du menu
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="header">
      <ul className="headerli">
        <li>
          <span className="gamepad">{<GamepadIcon />}</span>/Good loka
        </li>
        <li>
          <div
            className="toggle_button"
            onClick={toggleMenu}
            aria-haspopup="true"
            aria-expanded={isOpen ? "true" : "false"}
          >
            {/* Utiliser le premier caractère au lieu de l'icône */}
            <div className="menu-initial">
              <span className="menu">{<Menu />}</span>
            </div>
          </div>
        </li>
        {/* Menu déroulant qui s'affiche en fonction de l'état du menu */}
        <div className={`dropdown_menu ${isOpen ? "open" : ""}`}>
          <ul className="uldrop">
            <li>
              <Link to={routes.HISTORIQUE}>
                <span>{<HistorySharp />}</span>Historique
              </Link>
              <Link to={routes.REPLAY}>
                <span>{<Repeat />}</span>Replay
              </Link>
              <Link to={routes.REPLAY}>
                <span>{<MonetizationOn />}</span>Replay
              </Link>
            </li>
          </ul>
        </div>
      </ul>
    </header>
  );
};

export default Header;
