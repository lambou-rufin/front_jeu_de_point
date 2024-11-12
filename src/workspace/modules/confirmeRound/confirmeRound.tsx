import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { ConfirmeRoundProps } from "../../../shared/models/interface";
import RoundService from "../../../shared/service/RoundService";

const roundService = new RoundService();

const ConfirmeRound: React.FC<ConfirmeRoundProps> = ({
  open,
  onClose,
  round,
  currentUserId,
}) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  const confirmRound = async (roundId: number, playerId: number) => {
    console.log(
      "Tentative de confirmation de la partie avec ID:",
      roundId,
      "et Player ID:",
      playerId
    ); // Log des IDs
    try {
      await roundService.confirmPlayer(roundId, playerId);
      setSnackbarMessage("Confirmation réussie! Vous avez rejoint la partie.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      onClose();
    } catch (error) {
      console.error("Erreur de confirmation:", error);
      setSnackbarMessage("Impossible d'accepter cette invitation.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const refuseRound = () => {
    // alert("Vous avez refusé la participation à la partie.");
    onClose(); // Ferme le dialogue
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (!round) return null; // Ne rien afficher si aucune round n'est sélectionnée

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Confirmer l'invitation</DialogTitle>
        <DialogContent>
          <Typography variant="body1">Partie {round.id_rond}</Typography>
          <Typography variant="body1">
            Taille de la grille: {round.matrix_size}
          </Typography>
          <Typography variant="body1">
            Score maximum: {round.max_score}
          </Typography>
          <Typography variant="body1">Mise: {round.mise}</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => confirmRound(round.id_rond, currentUserId)}
            color="primary"
          >
            Accepter
          </Button>
          <Button onClick={refuseRound} color="error">
            Refuser
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "75%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ConfirmeRound;
