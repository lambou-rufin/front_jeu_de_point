import React, { FC, useState } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { CreateRoundDto } from "../../../shared/models/interface";
import RoundService from "../../../shared/service/RoundService";
import "./AddRoundComponent.css";

interface AddRoundProps {
  currentUserId: number;
  onRoundCreated: (newRound: CreateRoundDto) => void;
}

const AddRoundComponent: FC<AddRoundProps> = ({ currentUserId, onRoundCreated }) => {
  const [open, setOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newRound, setNewRound] = useState<CreateRoundDto>({
    id_rond: 0,
    matrix_size: 30,
    max_score: 15,
    reflexion_time: 20,
    duration_time: 25,
    playerIds: [],
    mise: 10000,
    creatorId: currentUserId,
    createdAt: new Date(),
    winnerId: null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewRound((prev) => ({ ...prev, [name]: Number(value) }));
  };

  const createRound = async () => {
    if (!isCreating) {
      setIsCreating(true);
      try {
        newRound.creatorId = currentUserId;
        const createdRound = await RoundService.createRound(newRound);
        onRoundCreated(createdRound);
        setOpen(false);
      } catch (error) {
        console.error("Erreur lors de la création de la partie :", error);
        alert("Échec de la création d'une nouvelle partie");
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
          >
            Annuler
          </Button>
          <Button
            variant="contained"
            className="creee"
            onClick={createRound}
          >
            Créer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddRoundComponent;
