// src/interfaces/IRoundGame.ts
export interface IRoundGame {
  id_rond: number;
  matrix_size?: number;
  matrix?: number[][]; // Matrice, mais facultative
  gridSize: number; // Ajout de gridSize si nécessaire
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
  svgPaths: string[]; // Ajouter svgPaths comme tableau de chaînes
  newPoint?: { x: number; y: number }; // Ajouter newPoint comme un objet avec x et y pour les coordonnées, ou selon votre besoin
}

// const roundGame: IRoundGame = {
//   id: 1,
//   matrix_size: 10,
//   max_score: 100,
//   reflexion_time: 60,
//   duration_time: 3600,
//   isConfirmed: true,
//   playerIds: [1, 2],
//   players, // Ajout de la liste des joueurs
//   mise: 50,
//   creatorId: 1,
//   isGameOver: false,
//   winnerId: null,
//   createdAt: new Date(),
// };


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
  round: IRoundGame | null;  // This should be `round` as per the error
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

export interface IPlayer {
  id: number;
  pseudo: string;
}

export interface ConfirmPlayerResponse {
  error?: string; // Facultatif
  message: string; // Message de réponse
  roundDetails: {  // Renommer round en roundDetails
    id_rond: number;
    matrix_size: number;
    mise: number;
    player_one: IPlayer;
    player_two: IPlayer;
  };
}


export interface IPoint {
  x: number;
  y: number;
}

export interface ISvgPath {
  d: string;
}
