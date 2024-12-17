import React, { FC, useState } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
} from "@mui/material";
import { IRoundGame } from "../../../shared/models/interface";
import RoundService from "../../../shared/service/RoundService";
import "./AddRoundComponent.css";

interface AddRoundProps {
  currentUserId: number;
  onRoundCreated: (newRound: IRoundGame) => void;
}

const AddRoundComponent: FC<AddRoundProps> = ({
  currentUserId,
  onRoundCreated,
}) => {
  const [open, setOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [newRound, setNewRound] = useState<IRoundGame>({
    id_rond: 0,
    matrix_size: 40,
    max_score: 15,
    reflexion_time: 20,
    duration_time: 25,
    playerIds: [],
    mise: 10000,
    creatorId: currentUserId,
    createdAt: new Date(),
    winnerId: null,
    // matrix: [], // Réinitialisation de la matrice
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Mise à jour des valeurs numériques
    setNewRound((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  const validateFields = () => {
    if (
      (newRound.matrix_size ?? 0) <= 0 ||
      (newRound.max_score ?? 0) <= 0 ||
      (newRound.reflexion_time ?? 0) <= 0 ||
      (newRound.duration_time ?? 0) <= 0 ||
      (newRound.mise ?? 0) <= 0
    ) {
      setErrorMessage("Tous les champs doivent avoir des valeurs positives.");
      return false;
    }
    return true;
  };

  const createRound = async () => {
    if (!isCreating) {
      if (!validateFields()) {
        return;
      }

      setIsCreating(true);
      setErrorMessage(null);

      try {
        newRound.creatorId = currentUserId;

        const createdRound = await RoundService.createRound(newRound);

        if (createdRound) {
          onRoundCreated(createdRound);

          // Utilisation de `setTimeout` pour garantir que le modal se ferme après une petite pause
          setTimeout(() => {
            setOpen(false);
          }, 100);

          setNewRound({
            id_rond: 0,
            matrix_size: 40,
            max_score: 15,
            reflexion_time: 20,
            duration_time: 25,
            playerIds: [],
            mise: 10000,
            creatorId: currentUserId,
            createdAt: new Date(),
            winnerId: null,
            // matrix: [], // Réinitialisation de la matrice
          });
        } else {
          throw new Error("Aucune réponse valide reçue.");
        }
      } catch (error) {
        console.error("Erreur lors de la création de la partie :", error);
        setErrorMessage("Échec de la création d'une nouvelle partie.");
      } finally {
        setIsCreating(false);
      }
    }
  };

  return (
    <>
      <Button
        variant="contained"
        className="createRound"
        onClick={() => setOpen(true)}
      >
        Créer une partie
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle className="title">Créer une nouvelle partie</DialogTitle>
        <DialogContent>
          {errorMessage && (
            <p style={{ color: "red", fontSize: "0.9rem" }}>{errorMessage}</p>
          )}
          <TextField
            autoFocus
            margin="dense"
            label="Taille de la grille"
            type="number"
            name="matrix_size"
            value={newRound.matrix_size}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Score maximum"
            type="number"
            name="max_score"
            value={newRound.max_score}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Temps de réflexion (en secondes)"
            type="number"
            name="reflexion_time"
            value={newRound.reflexion_time}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Durée limite (en minutes)"
            type="number"
            name="duration_time"
            value={newRound.duration_time}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Mise"
            type="number"
            name="mise"
            value={newRound.mise}
            onChange={handleInputChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            className="annuleee"
            onClick={() => setOpen(false)}
            disabled={isCreating}
          >
            Annuler
          </Button>
          <Button
            variant="contained"
            className="creee"
            onClick={createRound}
            disabled={isCreating}
          >
            {isCreating ? <CircularProgress size={24} /> : "Créer"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddRoundComponent;
