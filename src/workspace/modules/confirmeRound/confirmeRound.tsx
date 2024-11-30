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

  const confirmRound = async () => {
    if (!round) return;
    try {
      await RoundService.confirmPlayer(round.id_rond);
      setSnackbarMessage("Confirmation réussie! Vous avez rejoint la partie.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      onClose();
    } catch (error) {
      console.error("Erreur lors de la confirmation de la partie:", error);
      setSnackbarMessage("Impossible d'accepter cette invitation.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);

  if (!round) return null; // Ne rien afficher si aucune partie sélectionnée

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Confirmer l'invitation</DialogTitle>
        <DialogContent>
          <Typography variant="body1">Partie #{round.id_rond}</Typography>
          <Typography variant="body1">Taille de la grille: {round.matrix_size}</Typography>
          <Typography variant="body1">Score maximum: {round.max_score}</Typography>
          <Typography variant="body1">Mise: {round.mise}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={confirmRound} color="primary">
            Accepter
          </Button>
          <Button onClick={onClose} color="error">
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
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ConfirmeRound;
