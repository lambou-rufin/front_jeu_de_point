import React, { useState } from 'react';
import { Button } from '@mui/material';
import ModalComponent from '../../../shared/components/Modal';

const LogoutComponent: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);

  // Fonction pour supprimer le token et gérer la déconnexion
  const clearToken = async (): Promise<void> => {
    return new Promise((resolve) => {
      localStorage.removeItem('accessToken'); // Supprimer l'accessToken du localStorage
      resolve();
    });
  };

  const handleLogout = async () => {
    await clearToken();
    setModalOpen(false);
    window.location.href = '/login'; // Rediriger vers la page de connexion
  };

  return (
    <div>
      <Button
        variant="contained"
        color="error"
        onClick={() => setModalOpen(true)}
      >
        Déconnexion
      </Button>

      <ModalComponent
        open={modalOpen}
        title="Confirmer la déconnexion"
        message="Voulez-vous vraiment quitter ?"
        onConfirm={handleLogout}
        onCancel={() => setModalOpen(false)}
        confirmText="Déconnexion"
        cancelText="Annuler"
      />
    </div>
  );
};

export default LogoutComponent;
