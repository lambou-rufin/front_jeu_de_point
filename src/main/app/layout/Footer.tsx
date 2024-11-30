import React, { useState } from "react";
import { BottomNavigation, BottomNavigationAction, Box } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import LogoutIcon from "@mui/icons-material/Logout";
import RuleSharp from "@mui/icons-material/RuleSharp";
import ModalComponent from "../../../shared/components/Modal";

const Footer: React.FC = () => {
  const [value, setValue] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  // Fonction pour gérer la déconnexion
  const handleLogout = async () => {
    // Supprimez le token ou gérez la déconnexion
    localStorage.removeItem("accessToken");
    setModalOpen(false); // Fermer le modal
    window.location.href = "/login"; // Rediriger vers la page de connexion
  };

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
        <BottomNavigationAction label="Home" icon={<HomeIcon />} href="/round" />
        <BottomNavigationAction
          label="Reglèment"
          icon={<RuleSharp />}
          href="/about"
        />
        <BottomNavigationAction
          label="Logout"
          icon={<LogoutIcon />}
          onClick={() => setModalOpen(true)} // Ouvrir le modal de confirmation
        />
      </BottomNavigation>

      {/* Modal dynamique pour confirmer la déconnexion */}
      <ModalComponent
        open={modalOpen}
        title="Confirmer la déconnexion"
        message="Voulez-vous vraiment vous déconnecter ?"
        onConfirm={handleLogout}
        onCancel={() => setModalOpen(false)}
        confirmText="Déconnexion"
        cancelText="Annuler"
      />
    </footer>
  );
};

export default Footer;
