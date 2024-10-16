// src/main/modules/round/RoundComponent.tsx
import React, { useEffect, useState } from 'react';
import { CreateRoundDto } from '../../../interfaces/CreateRoundDto';
import useSocket from '../../../hooks/useSocket';
import socket from '../../../socket/socket';

const RoundComponent: React.FC = () => {
  const [rounds, setRounds] = useState<CreateRoundDto[]>([]);
  const [newRound, setNewRound] = useState<CreateRoundDto>({
    matrix_size: 3, // Valeur par défaut, ajustez selon vos besoins
    max_score: 15, // Valeur par défaut, ajustez selon vos besoins
    reflexion_time: 20, // Valeur par défaut, ajustez selon vos besoins
    duration_time: 20, // Valeur par défaut, ajustez selon vos besoins
    playerIds: [], // Initialisez avec des IDs de joueurs
    mise: 1000, // Valeur par défaut, ajustez selon vos besoins
    creatorId: 1, // Remplacez par l'ID de l'utilisateur courant
  });

  useSocket<CreateRoundDto>('roundCreated', (newRound: any) => {
    setRounds((prevRounds) => [...prevRounds, newRound]);
  });

  const createRound = async () => {
    socket.emit('createRound', newRound);
    // Réinitialiser le formulaire après l'envoi
    setNewRound({
      matrix_size: 3,
      max_score: 10,
      reflexion_time: 30,
      duration_time: 60,
      playerIds: [],
      mise: 100,
      creatorId: 1,
    });
  };

  return (
    <div>
      <h1>Page partie</h1>
      <button onClick={createRound}>Créer une partie</button>
      <ul>
        {rounds.map((round, index) => (
          <li key={index}>{JSON.stringify(round)}</li>
        ))}
      </ul>
    </div>
  );
};

export default RoundComponent;
