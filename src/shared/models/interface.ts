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
  // username: string;
  // email: string;
  password: string;
  confirmPassword: string; // Nouveau champ pour la confirmation du mot de passe
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

export interface ConfirmeRoundProps {
  round: CreateRoundDto | null;  // This should be `round` as per the error
  open: boolean;
  onClose: () => void;
  currentUserId: number;
}

export interface ConfirmPlayerResponse {
  message: string;
  round: any; // Remplacez `any` par le type approprié de votre round
}

export interface ModalProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}