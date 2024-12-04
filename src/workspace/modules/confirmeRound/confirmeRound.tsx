// import React, { useState } from "react";
// import {
//   Button,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   Typography,
//   Snackbar,
//   Alert,
//   Box,
// } from "@mui/material";
// import { ConfirmeRoundProps } from "../../../shared/models/interface";
// import RoundService from "../../../shared/service/RoundService";
// import { useNavigate } from "react-router-dom";
// import MatchModal from "../../../shared/components/MatchModal";
// import WebSocketService from "../../../shared/service/WebSocketService";

// const ConfirmeRound: React.FC<ConfirmeRoundProps> = ({ open, onClose, round }) => {
//   const [snackbarOpen, setSnackbarOpen] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState<string>("");
//   const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");
//   const [matchModalOpen, setMatchModalOpen] = useState(false);
//   const [playerOneName, setPlayerOneName] = useState<string>("");
//   const [playerTwoName, setPlayerTwoName] = useState<string>("");
//   const navigate = useNavigate();

//   const handleSnackbarClose = () => setSnackbarOpen(false);
 
//   // const confirmRound = async () => {
//   //   if (!round) return;
  
//   //   try {
//   //     // Initialiser le WebSocket
//   //     const token = localStorage.getItem("accessToken") || "";
//   //     await WebSocketService.createInstanceSocket('http://localhost:3002', token);
  
//   //     // Appeler le service pour confirmer le joueur
//   //     const response = await RoundService.confirmPlayer(round.id_rond);
  
//   //     // Mettre à jour les noms des joueurs
//   //     setPlayerOneName(response.player_one.pseudo);
//   //     setPlayerTwoName(response.player_two.pseudo);
  
//   //     // Notification de succès
//   //     setSnackbarMessage("Confirmation réussie! Vous avez rejoint la partie.");
//   //     setSnackbarSeverity("success");
//   //     setSnackbarOpen(true);
  
//   //     // Ouvrir la modal de match et fermer la fenêtre courante
//   //     setMatchModalOpen(true);
//   //     onClose();
//   //   } catch (error: any) {
//   //     console.error("Erreur lors de la confirmation de la partie:", error);
  
//   //     // Vérifiez et extrayez le message d'erreur spécifique du backend
//   //     const errorMessage =
//   //       error.response?.data?.message || "Une erreur inconnue s'est produite.";
  
//   //     // Afficher une notification d'erreur
//   //     setSnackbarMessage(errorMessage);
//   //     setSnackbarSeverity("error");
//   //     setSnackbarOpen(true);
//   //   }
//   // };  

//   const confirmRound = async () => {
//     if (!round) return;
  
//     try {
//       // Initialiser le WebSocket
//       const token = localStorage.getItem("accessToken") || "";
//       await WebSocketService.createInstanceSocket('http://localhost:3002', token);
  
//       // Appeler le service pour confirmer le joueur
//       const response = await RoundService.confirmPlayer(round.id_rond);
  
//       // Mettre à jour les noms des joueurs
//       setPlayerOneName(response.player_one.pseudo);
//       setPlayerTwoName(response.player_two.pseudo);
  
//       // Notification de succès
//       setSnackbarMessage("Confirmation réussie! Vous avez rejoint la partie.");
//       setSnackbarSeverity("success");
//       setSnackbarOpen(true);
  
//       // Fermer la fenêtre de confirmation immédiatement
//       onClose();
  
//       // Attendre un court délai avant d'ouvrir la modal et rediriger vers le jeu
//       setTimeout(() => {
//         setMatchModalOpen(true);
//         navigate("/game"); // Rediriger vers la page du jeu
//       }, 500); // Délai de 500 ms pour assurer la fermeture de la modal avant la redirection
  
//     } catch (error: any) {
//       console.error("Erreur lors de la confirmation de la partie:", error);
  
//       let errorMessage = "Une erreur inconnue s'est produite.";
  
//       if (error.response) {
//         console.log("Réponse du backend:", error.response);
//         if (error.response.data) {
//           console.log("Données de la réponse:", error.response.data);
//           errorMessage = error.response.data.message || errorMessage;
//         }
//       } else if (error.message) {
//         errorMessage = error.message;
//       }
  
//       // Afficher le message d'erreur dans le Snackbar
//       setSnackbarMessage(errorMessage);
//       setSnackbarSeverity("error");
//       setSnackbarOpen(true);
//     }
//   };
    

//   const handleMatchModalClose = () => {
//     setMatchModalOpen(false);
//     navigate("/game"); // Redirection après fermeture du modal
//   };

//   if (!round) return null;

//   // Fermer le modal et rediriger vers /game
//    const handleStartGame = () => {
//       setMatchModalOpen(false);
//     navigate("/game"); // Redirige vers la page du jeu
//    };

//   return (
//     <>
//       <Dialog open={open} onClose={onClose}>
//         <Box sx={{ width: 600 }}>
//           <DialogTitle className="title">Confirmer l'invitation</DialogTitle>
//           <DialogContent>
//             <Typography variant="body1">Partie #{round.id_rond}</Typography>
//             <Typography variant="body1">Taille de la grille: {round.matrix_size}</Typography>
//             <Typography variant="body1">Score maximum: {round.max_score}</Typography>
//             <Typography variant="body1">Mise: {round.mise}</Typography>
//           </DialogContent>
//           <DialogActions>
//             <Button variant="outlined" onClick={confirmRound} color="primary">
//               Accepter
//             </Button>
//             <Button variant="outlined" onClick={onClose} color="error">
//               Refuser
//             </Button>
//           </DialogActions>
//         </Box>
//       </Dialog>

//       <MatchModal
//         open={matchModalOpen}
//         playerOneName={playerOneName}
//         playerTwoName={playerTwoName}
//         onClose={handleMatchModalClose}
//         onStartGame={handleStartGame}
//       />

//       <Snackbar
//         open={snackbarOpen}
//         autoHideDuration={5000}
//         onClose={handleSnackbarClose}
//         anchorOrigin={{ vertical: "top", horizontal: "center" }}
//       >
//         <Alert
//           onClose={handleSnackbarClose}
//           severity={snackbarSeverity}
//           sx={{ width: "100%" }}
//         >
//           {snackbarMessage}
//         </Alert>
//       </Snackbar>
//     </>
//   );
// };

// export default ConfirmeRound;

import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Box,
} from "@mui/material";
import { ConfirmeRoundProps } from "../../../shared/models/interface";
import RoundService from "../../../shared/service/RoundService";
import { useNavigate } from "react-router-dom";
import MatchModal from "../../../shared/components/MatchModal";
import WebSocketService from "../../../shared/service/WebSocketService";
import CustomSnackbar from "../../../shared/components/Snackbar";  // Importer le composant CustomSnackbar

const ConfirmeRound: React.FC<ConfirmeRoundProps> = ({ open, onClose, round }) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");
  const [matchModalOpen, setMatchModalOpen] = useState(false);
  const [playerOneName, setPlayerOneName] = useState<string>("");
  const [playerTwoName, setPlayerTwoName] = useState<string>("");
  const navigate = useNavigate();

  const handleSnackbarClose = () => setSnackbarOpen(false);

  const confirmRound = async () => {
    if (!round) return;
  
    try {
      // Initialiser le WebSocket
      const token = localStorage.getItem("accessToken") || "";
      await WebSocketService.createInstanceSocket('http://localhost:3002', token);
  
      // Appeler le service pour confirmer le joueur
      const response = await RoundService.confirmPlayer(round.id_rond);
  
      // Mettre à jour les noms des joueurs
      setPlayerOneName(response.player_one.pseudo);
      setPlayerTwoName(response.player_two.pseudo);
  
      // Notification de succès
      setSnackbarMessage("Confirmation réussie! Vous avez rejoint la partie.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
  
      // Fermer la fenêtre de confirmation immédiatement
      onClose();
  
      // Attendre un court délai avant d'ouvrir la modal et rediriger vers le jeu
      setTimeout(() => {
        setMatchModalOpen(true);
        navigate("/game"); // Rediriger vers la page du jeu
      }, 500);
  
    } catch (error: any) {
      console.error("Erreur lors de la confirmation de la partie:", error);
  
      // Vérifier l'erreur renvoyée par le backend
      let errorMessage = "Une erreur inconnue s'est produite.";
  
      if (error.response) {
        console.log("Réponse du backend:", error.response);
        if (error.response.data) {
          console.log("Données de la réponse:", error.response.data);
          errorMessage = error.response.data.message || errorMessage;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
  
      // Afficher le message d'erreur dans le Snackbar
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };
  

  const handleMatchModalClose = () => {
    setMatchModalOpen(false);
    navigate("/game"); // Redirection après fermeture du modal
  };

  if (!round) return null;

  // Fermer le modal et rediriger vers /game
  const handleStartGame = () => {
    setMatchModalOpen(false);
    navigate("/game"); // Redirige vers la page du jeu
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <Box sx={{ width: 600 }}>
          <DialogTitle className="title">Confirmer l'invitation</DialogTitle>
          <DialogContent>
            <Typography variant="body1">Partie #{round.id_rond}</Typography>
            <Typography variant="body1">Taille de la grille: {round.matrix_size}</Typography>
            <Typography variant="body1">Score maximum: {round.max_score}</Typography>
            <Typography variant="body1">Mise: {round.mise}</Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" onClick={confirmRound} color="primary">
              Accepter
            </Button>
            <Button variant="outlined" onClick={onClose} color="error">
              Refuser
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <MatchModal
        open={matchModalOpen}
        playerOneName={playerOneName}
        playerTwoName={playerTwoName}
        onClose={handleMatchModalClose}
        onStartGame={handleStartGame}
      />

      {/* Utilisation de CustomSnackbar à la place du Snackbar standard */}
      <CustomSnackbar
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
    </>
  );
};

export default ConfirmeRound;
