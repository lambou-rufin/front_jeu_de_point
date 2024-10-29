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

// Définir les types pour les données
export interface SignUpData {
  pseudo: string;
  username: string;
  email: string;
  password: string;
  phoneNumber: string;
  solde?: number; // Valeur par défaut si non spécifiée
}

// types.ts or types.tsx
export interface SignInData {
  phoneNumber: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
}