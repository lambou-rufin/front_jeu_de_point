import { useEffect, useState } from 'react';
import { CreateRoundDto } from '../../../interfaces/interface';
import useSocket from '../../../hooks/useSocket';
import socket, { createInstanceSocket } from '../../../socket/socket'; // socket est maintenant un export par défaut
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Typography, Card, CardContent } from '@mui/material';
import './Round.css';


const RoundComponent: React.FC<{ currentUserId: number }> = ({ currentUserId }) => {
  const [rounds, setRounds] = useState<CreateRoundDto[]>([]);
  const [newRound, setNewRound] = useState<CreateRoundDto>({
    id_rond: 0,
    matrix_size: 3,
    max_score: 15,
    reflexion_time: 20,
    duration_time: 20,
    playerIds: [],
    mise: 1000,
    creatorId: currentUserId,
    createdAt: new Date(), // Utiliser la date actuelle
    winnerId: null // Ajouter winnerId ici, peut être initialisé à null
  });
  
  const [createdRound, setCreatedRound] = useState<CreateRoundDto | null>(null);
  const [open, setOpen] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

    // Initialiser le socket
    useEffect(() => {
      createInstanceSocket();
    }, []);  

  // Écoute l'événement "roundCreated" via WebSocket
  useSocket<CreateRoundDto>('roundCreated', (round: CreateRoundDto) => {
    setRounds((prevRounds) => [...prevRounds, round]);
    setCreatedRound(round);
    setConfirmationModalOpen(true);
    setIsCreating(false);
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewRound((prev) => ({ ...prev, [name]: Number(value) }));
  };

  const createRound = () => {
    if(!socket)return;
    
    if (!isCreating) {
      // setIsCreating(true);
      socket.emit('createRound', newRound);
      setOpen(false);
    }
  };

  const confirmRound = (roundId: number, playerId: number) => {
    if(!socket)return;
    socket.emit('confirmPlayer', { roundId, playerId });
    setConfirmationModalOpen(false);
  };

  return (
    <div>
      <h1>Liste des parties</h1>
      <div className="round-list">
        {rounds.map((round) => (
          <Card key={round.id_rond} className="round-card">
            <CardContent>
              <Typography variant="h6">Partie {round.id_rond}</Typography>
              <Typography variant="body1">Taille de la grille: {round.matrix_size}</Typography>
              <Typography variant="body1">Score maximum: {round.max_score}</Typography>
              <Typography variant="body1">Temps de réflexion: {round.reflexion_time} secondes</Typography>
              <Typography variant="body1">Durée limite: {round.duration_time} secondes</Typography>
              <Typography variant="body1">Mise: {round.mise}</Typography>
              <Typography variant="body1">Créateur: Joueur {round.creatorId}</Typography>
            </CardContent>
          </Card>
        ))}
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
            label="Durée limite (en min)"
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
          <Button onClick={createRound} color="primary" disabled={isCreating}>
            {isCreating ? 'Création en cours...' : 'Créer'}
          </Button>
        </DialogActions>
      </Dialog>

      <Button className="createRound" variant="contained" onClick={() => setOpen(true)} disabled={isCreating}>
        Créer une partie
      </Button>

      {createdRound && (
        <Dialog open={confirmationModalOpen} onClose={() => setConfirmationModalOpen(false)}>
          <DialogTitle>Détails de la nouvelle partie</DialogTitle>
          <DialogContent>
            <Typography variant="body1">Taille de la grille: {createdRound.matrix_size}</Typography>
            <Typography variant="body1">Score maximum: {createdRound.max_score}</Typography>
            <Typography variant="body1">Temps de réflexion: {createdRound.reflexion_time} secondes</Typography>
            <Typography variant="body1">Durée limite: {createdRound.duration_time} min</Typography>
            <Typography variant="body1">Mise: {createdRound.mise}</Typography>
            <Typography variant="body1">Créateur: Joueur {createdRound.creatorId}</Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => confirmRound(createdRound.id_rond, 2)} // Utilisez le bon ID pour le joueur
              color="primary"
            >
              Confirmer et rejoindre
            </Button>
            <Button onClick={() => setConfirmationModalOpen(false)} color="secondary">
              Fermer
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default RoundComponent;
