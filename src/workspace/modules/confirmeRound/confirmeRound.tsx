
import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Snackbar,
  Alert,
  Box,
} from "@mui/material";
import { ConfirmeRoundProps } from "../../../shared/models/interface";
import RoundService from "../../../shared/service/RoundService";
import { useNavigate } from "react-router-dom";
import MatchModal from "../../../shared/components/MatchModal";
import WebSocketService from "../../../shared/service/WebSocketService";

const ConfirmeRound: React.FC<ConfirmeRoundProps> = ({
  open,
  onClose,
  round,
}) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const [matchModalOpen, setMatchModalOpen] = useState(false);
  const [playerOneName, setPlayerOneName] = useState<string>("");
  const [playerTwoName, setPlayerTwoName] = useState<string>("");
  const navigate = useNavigate();

  const handleSnackbarClose = () => setSnackbarOpen(false);

  // useEffect(() => {
  //   navigate("/game"); // Redirige immédiatement vers /game
  // }, []);

  const confirmRound = async () => {
    if (!round) return;
    try {
      const response = await RoundService.confirmPlayer(round.id_rond);
  
      // Assurez-vous que `response` contient les noms des joueurs.
      setPlayerOneName(response.player_one.pseudo);
      setPlayerTwoName(response.player_two.pseudo);
  
      setSnackbarMessage("Confirmation réussie! Vous avez rejoint la partie.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
  
      setMatchModalOpen(true); // Ouvrir le modal après confirmation réussie
  
      // Notifier les joueurs que la partie est prête
      const socket = WebSocketService.getSocket();
      if (socket) {
        socket.emit("matchReady", {
          playerOneName: response.player_one.pseudo,
          playerTwoName: response.player_two.pseudo,
        });
      } else {
        console.error("WebSocket n'est pas disponible");
      }
      
  
      // Fermer le modal de confirmation
      onClose();
    } catch (error) {
      console.error("Erreur lors de la confirmation de la partie:", error);
      setSnackbarMessage("Impossible d'accepter cette invitation.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleMatchModalClose = () => {
    setMatchModalOpen(false);
    navigate("/game"); // Redirige vers le jeu après avoir fermé le modal
  };

  if (!round) return null;

    // Fermer le modal et rediriger vers /game
    const handleStartGame = () => {
      setMatchModalOpen(false);
      navigate("/game"); // Redirige vers la page du jeu
    };
    
  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <Box sx={{ width: 400 }}>
          <DialogTitle className="title">Confirmer l'invitation</DialogTitle>
          <DialogContent>
            <Typography variant="body1">Partie #{round.id_rond}</Typography>
            <Typography variant="body1">
              Taille de la grille: {round.matrix_size}
            </Typography>
            <Typography variant="body1">
              Score maximum: {round.max_score}
            </Typography>
            <Typography variant="body1">Mise: {round.mise}</Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" onClick={confirmRound} color="primary">
              Accepter
            </Button>
            <Button variant="outlined" onClick={onClose} color="error">
              Refuser
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <MatchModal
        open={matchModalOpen}
        playerOneName={playerOneName}
        playerTwoName={playerTwoName}
        onClose={handleMatchModalClose}
        onStartGame={handleStartGame}

      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ConfirmeRound;
