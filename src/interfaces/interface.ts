// src/interfaces/CreateRoundDto.ts
export interface CreateRoundDto {
  id_rond: number;
  matrix_size?: number; 
  max_score: number; 
  reflexion_time: number;
  duration_time: number;
    isConfirmed?: boolean; 
    playerIds: number[];
    mise: number;
    creatorId: number; 
    isGameOver?: boolean; 
    winnerId: number | null; // Autoriser null pour winnerId
    createdAt: Date | number; // Permettre soit une Date, soit un nombre
  }
  
  export interface LayoutProps {
    children?: React.ReactNode; // `children` est maintenant optionnel
  }

export interface Round {
  id: number;
  // Ajoutez d'autres propriétés selon votre DTO
}
