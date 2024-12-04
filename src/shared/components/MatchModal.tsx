import React, { FC, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./MatchModal.css";

interface MatchModalProps {
  open: boolean;
  playerOneName: string;
  playerTwoName: string;
  onClose: () => void;
  onStartGame: () => void;
}

const MatchModal: FC<MatchModalProps> = ({
  open,
  playerOneName,
  playerTwoName,
  onClose,
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Si la modale est ouverte, mettre en place un délai de 5 secondes pour fermer la modale et rediriger
    if (open) {
      const timer = setTimeout(() => {
        onClose(); // Ferme la modale
        navigate("/game"); // Redirige vers /game
      }, 5000);

      // Nettoyer le timeout au démontage
      return () => clearTimeout(timer);
    }
  }, [open, onClose, navigate]);

  return (
    <Dialog open={open} onClose={onClose}>
     <Box
        sx={{
          top: '50%',
          left: '50%',
          p: 4,
          borderRadius: 2,
        }}
      >
        <DialogTitle>Match en cours</DialogTitle>
        <DialogContent>
          <Typography variant="h6">
            {playerOneName} <span className="playerVS">vs</span> {playerTwoName}
          </Typography>
        </DialogContent>
        {/* Le bouton Commencer n'est plus nécessaire, donc on ne l'affiche plus */}
        {/* <DialogActions>
        <Button variant="contained" color="primary" onClick={onClose}>
          Commencer
        </Button>
      </DialogActions> */}
      </Box>
    </Dialog>
  );
};

export default MatchModal;
