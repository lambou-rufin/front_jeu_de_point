import React, { useEffect, useState } from 'react';
import WebSocketService from '../../../shared/service/WebSocketService';
import { Card, CardContent, Typography, Grid, Button, Box } from '@mui/material';

interface Round {
  id_rond: number;
  matrix: number[][]; // Matrice sous forme de tableau 2D
  matrix_size: number;
  creatorId: number;
  duration_time: number;
  max_score: number;
  mise: number;
  reflexion_time: number;
  is_confirmed: boolean;
  is_game_over: boolean;
}

const GameComponent: React.FC = () => {
  const [round, setRound] = useState<Round | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken') || '';
    WebSocketService.createInstanceSocket('http://localhost:3002', token);

    // Écoute l'événement 'roundUpdate' pour mettre à jour la matrice
    WebSocketService.listen('roundUpdate', (data: Round) => {
      setRound(data);
    });

    return () => {
      WebSocketService.closeSocket(); // Ferme la connexion WebSocket lors de la fermeture du composant
    };
  }, []);

  // Fonction pour rendre la matrice sous forme de cartes
  const renderMatrix = (matrix: number[][]) => {
    return matrix.map((row, rowIndex) => (
      <Grid container key={rowIndex} spacing={1} justifyContent="center">
        {row.map((cell, cellIndex) => (
          <Grid item key={cellIndex}>
            <Card sx={{ width: '50px', height: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <CardContent sx={{ padding: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {cell}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    ));
  };

  return (
    <Box>
      <Typography variant="h4" component="h1">Game Component</Typography>
      <Button variant="contained" color="primary" sx={{ marginBottom: '20px' }}>
        Send Message
      </Button>

      {round && (
        <Box>
          <Typography variant="h6">Round {round.id_rond}</Typography>
          <Typography variant="body1">Matrix Size: {round.matrix_size}</Typography>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6">Matrix:</Typography>
              {renderMatrix(round.matrix)} {/* Affiche la matrice */}
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default GameComponent;
