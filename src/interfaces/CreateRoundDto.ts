// src/interfaces/CreateRoundDto.ts
export interface CreateRoundDto {
  matrix_size: number; // Taille de la grille du jeu
  max_score: number; // Score maximum à atteindre
  reflexion_time: number; // Temps limite de réflexion par mouvement
  duration_time: number; // Durée limite de la partie
    isConfirmed?: boolean; // Indique si les paramètres sont confirmés (optionnel)
    playerIds: number[]; // Tableau d'IDs des joueurs
    mise: number; // Mise pour la partie
    creatorId: number; // ID du joueur qui crée le round
    isGameOver?: boolean; // Statut de la partie (terminée ou non, optionnel)
    winnerId?: number; // ID du joueur gagnant (optionnel)
  }
  