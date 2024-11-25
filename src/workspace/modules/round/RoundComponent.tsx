import { useEffect, useState } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import "./Round.css";
import { CreateRoundDto } from "../../../shared/models/interface";
import ConfirmeRound from "../confirmeRound/confirmeRound";
import WebSocketService from "../../../shared/service/WebSocketService";
import RoundService from "../../../shared/service/RoundService";

const RoundComponent: React.FC<{ currentUserId: number }> = ({
  currentUserId,
}) => {
  const [rounds, setRounds] = useState<CreateRoundDto[]>([]);
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
  const [open, setOpen] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [selectedRound, setSelectedRound] = useState<CreateRoundDto | null>(
    null
  );
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    ; // Remplacez par le token réel
    WebSocketService.createInstanceSocket("http://localhost:3002", token||'');

    // Fetch existing rounds
    const fetchRounds = async () => {
      try {
        const roundsData = await RoundService.getRounds();
        setRounds(roundsData);
      } catch (error) {
        console.error("Erreur lors du chargement des parties:", error);
      }
    };

    fetchRounds();

    WebSocketService.getSocket()?.on(
      "roundCreated",
      (round: CreateRoundDto) => {
        console.log("Round reçu via WebSocket:", round);
        setRounds((prevRounds) =>
          Array.isArray(prevRounds) ? [...prevRounds, round] : [round]
        );
      }
    );

    return () => {
      WebSocketService.closeSocket();
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewRound((prev) => ({ ...prev, [name]: Number(value) }));
  };

  const createRound = async () => {
    if (!isCreating) {
      setIsCreating(true);
      try {
        const createdRound = await RoundService.createRound(newRound);
        if (createdRound) {
          setRounds((prevRounds) => [...prevRounds, createdRound]);
          setOpen(false);
        }
      } catch (error) {
        console.error("Erreur lors de la création de la partie:", error);
        alert("Échec de la création d’une nouvelle partie");
      } finally {
        setIsCreating(false);
      }
    }
  };

  const openConfirmationDialog = (round: CreateRoundDto) => {
    setSelectedRound(round);
    setConfirmationModalOpen(true);
  };

  return (
    <div className="container">
      <h1 className="liste">Liste des parties</h1>
      <div className="round-list">
        {rounds && rounds.length > 0 ? (
          rounds.map((round) =>
            round ? (
              <Card
                key={round.id_rond}
                className="round-card clickable-card"
                onClick={() => openConfirmationDialog(round)}
              >
                <CardContent className="card-style">
                  <Typography className="partieId" variant="h6">
                    Partie {round.id_rond}
                  </Typography>
                  <Typography variant="body1">
                    Taille de la grille: {round.matrix_size}
                  </Typography>
                  <Typography variant="body1">
                    Score maximum: {round.max_score}
                  </Typography>
                  <Typography variant="body1">
                    Temps de réflexion: {round.reflexion_time} secondes
                  </Typography>
                  <Typography variant="body1">
                    Durée limite: {round.duration_time} minutes
                  </Typography>
                  <Typography variant="body1">Mise: {round.mise}</Typography>
                  <Typography variant="body1">
                    Créateur: Joueur {round.creatorId}
                  </Typography>
                </CardContent>
              </Card>
            ) : null
          )
        ) : (
          <Typography variant="body1">Aucune partie disponible</Typography>
        )}
      </div>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Créer une nouvelle partie</DialogTitle>
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
          <Button onClick={() => setOpen(false)} color="primary">
            Annuler
          </Button>
          <Button onClick={createRound} color="primary">
            Créer
          </Button>
        </DialogActions>
      </Dialog>
      <Button
        className="createRound"
        variant="contained"
        onClick={() => setOpen(true)}
      >
        Créer une partie
      </Button>
      <ConfirmeRound
        round={selectedRound}
        open={confirmationModalOpen}
        onClose={() => setConfirmationModalOpen(false)}
        currentUserId={currentUserId}
      />
    </div>
  );
};

export default RoundComponent;
