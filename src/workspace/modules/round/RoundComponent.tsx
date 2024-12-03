// import React, { useEffect, useState } from "react";
// import {
//   Button,
//   TextField,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   Typography,
//   Card,
//   CardContent,
// } from "@mui/material";
// import { CreateRoundDto } from "../../../shared/models/interface";
// import ConfirmeRound from "../confirmeRound/confirmeRound";
// import WebSocketService from "../../../shared/service/WebSocketService";
// import RoundService from "../../../shared/service/RoundService";
// import "./Round.css";

// const RoundComponent: React.FC<{ currentUserId: number }> = ({
//   currentUserId,
// }) => {
//   const [rounds, setRounds] = useState<CreateRoundDto[]>([]);
//   const [newRound, setNewRound] = useState<CreateRoundDto>({
//     id_rond: 0,
//     matrix_size: 30,
//     max_score: 15,
//     reflexion_time: 20,
//     duration_time: 25,
//     playerIds: [],
//     mise: 10000,
//     creatorId: currentUserId,
//     createdAt: new Date(),
//     winnerId: null,
//   });
//   const [open, setOpen] = useState(false);
//   const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
//   const [selectedRound, setSelectedRound] = useState<CreateRoundDto | null>(
//     null
//   );
//   const [isCreating, setIsCreating] = useState(false);

//   // Initialisation de WebSocket et chargement initial
//   useEffect(() => {
//     const token = localStorage.getItem("accessToken") || "";
//     WebSocketService.createInstanceSocket("http://localhost:3002", token);

//     const fetchRounds = async () => {
//       try {
//         const roundsData = await RoundService.getRounds();
//         setRounds(roundsData);
//       } catch (error) {
//         console.error("Erreur lors du chargement des parties :", error);
//       }
//     };

//     fetchRounds();

//     const socket = WebSocketService.getSocket();

//     if (socket) {
//       socket.on("roundCreated", (round: CreateRoundDto) => {
//         setRounds((prev) => [...prev, round]);
//       });

//       socket.on("roundUpdated", (round: CreateRoundDto) => {
//         setRounds((prev) =>
//           prev.map((r) => (r.id_rond === round.id_rond ? round : r))
//         );
//       });
//     }

//     return () => WebSocketService.closeSocket();
//   }, []);

//   // Gestion des entrées utilisateur pour la création d'une partie
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setNewRound((prev) => ({ ...prev, [name]: Number(value) }));
//   };

//   // Création d'une nouvelle partie
//   const createRound = async () => {
//     if (!isCreating) {
//       setIsCreating(true);
//       try {
//         newRound.creatorId = currentUserId;
//         console.log("Création de la partie avec:", newRound); // Ajout d'un log pour vérifier les données
//         const createdRound = await RoundService.createRound(newRound);
//         setRounds((prev) => [...prev, createdRound]);
//         console.log("Partie créée:", createdRound); // Vérifiez si la partie a bien été créée
//         setOpen(false);  // Ferme le modal une fois la partie créée
//       } catch (error) {
//         console.error("Erreur lors de la création de la partie :", error);
//         alert("Échec de la création d'une nouvelle partie");
//       } finally {
//         setIsCreating(false);
//       }
//     }
//   };

//   // Ouvrir le dialogue de confirmation
//   const openConfirmationDialog = (round: CreateRoundDto) => {
//     setSelectedRound(round);
//     setConfirmationModalOpen(true);
//   };

//   // Rendu du composant
//   return (
//     <div className="container">
//       {/* <Typography variant="h2" className="liste"> */}
//        <h1 className="liste">Liste des parties:</h1>
//       {/* </Typography> */}
//       <div className="round-list">
//         {rounds.length > 0 ? (
//           rounds.map((round) => (
//             <Card
//               key={round.id_rond}
//               className="round-card clickable-card"
//               onClick={() => openConfirmationDialog(round)}
//             >
//               <CardContent className="card-style">
//                 <Typography variant="h6" className="idRound">Partie #{round.id_rond}</Typography>
//                 <Typography>
//                   Taille de la grille : {round.matrix_size}
//                 </Typography>
//                 <Typography>Score maximum : {round.max_score}</Typography>
//                 <Typography>
//                   Temps de réflexion : {round.reflexion_time} secondes
//                 </Typography>
//                 <Typography>
//                   Durée limite : {round.duration_time} minutes
//                 </Typography>
//                 <Typography>Mise : {round.mise}</Typography>
//                 <Typography variant="h6" className="idPlayer">Créateur : Joueur {round.creatorId}</Typography>
//               </CardContent>
//             </Card>
//           ))
//         ) : (
//           <Typography>Aucune partie disponible</Typography>
//         )}
//       </div>

//       {/* Dialogue pour créer une partie */}
//       <Dialog open={open} onClose={() => setOpen(false)}>
//       <DialogTitle className="title">Créer une nouvelle partie</DialogTitle>
//         <DialogContent>
//           <TextField
//             autoFocus
//             margin="dense"
//             label="Taille de la grille"
//             type="number"
//             name="matrix_size"
//             value={newRound.matrix_size}
//             onChange={handleInputChange}
//             fullWidth
//           />
//           <TextField
//             margin="dense"
//             label="Score maximum"
//             type="number"
//             name="max_score"
//             value={newRound.max_score}
//             onChange={handleInputChange}
//             fullWidth
//           />
//           <TextField
//             margin="dense"
//             label="Temps de réflexion (en secondes)"
//             type="number"
//             name="reflexion_time"
//             value={newRound.reflexion_time}
//             onChange={handleInputChange}
//             fullWidth
//           />
//           <TextField
//             margin="dense"
//             label="Durée limite (en minutes)"
//             type="number"
//             name="duration_time"
//             value={newRound.duration_time}
//             onChange={handleInputChange}
//             fullWidth
//           />
//           <TextField
//             margin="dense"
//             label="Mise"
//             type="number"
//             name="mise"
//             value={newRound.mise}
//             onChange={handleInputChange}
//             fullWidth
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button
//             variant="contained"
//             className="annuleee"
//             onClick={() => setOpen(false)}
//           >
//             Annuler
//           </Button>
//           <Button
//             variant="contained"
//             className="creee"
//             onClick={createRound}
//             //  disabled={isCreating}
//           >
//             Créer
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Bouton pour ouvrir le dialogue */}
//       <Button
//         variant="contained"
//         className="createRound"
//         onClick={() => setOpen(true)}
//       >
//         Créer une partie
//       </Button>

//       {/* Composant de confirmation */}
//       {selectedRound && (
//         <ConfirmeRound
//           round={selectedRound}
//           open={confirmationModalOpen}
//           onClose={() => setConfirmationModalOpen(false)}
//           currentUserId={currentUserId}
//         />
//       )}
//     </div>
//   );
// };

// export default RoundComponent;

import React, { useEffect, useState } from "react";
import { Typography, Card, CardContent } from "@mui/material";
import { CreateRoundDto } from "../../../shared/models/interface";
import ConfirmeRound from "../confirmeRound/confirmeRound";
import WebSocketService from "../../../shared/service/WebSocketService";
import RoundService from "../../../shared/service/RoundService";
import "./Round.css";
import AddRoundComponent from "./AddRoundComponent";
import MatchModal from "../../../shared/components/MatchModal";
import { useNavigate } from "react-router-dom";

const RoundComponent: React.FC<{ currentUserId: number }> = ({
  currentUserId,
}) => {
  const [rounds, setRounds] = useState<CreateRoundDto[]>([]);
  const [selectedRound, setSelectedRound] = useState<CreateRoundDto | null>(null);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [matchModalOpen, setMatchModalOpen] = useState(false);
  const [playerOneName, setPlayerOneName] = useState("");
  const [playerTwoName, setPlayerTwoName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken") || "";
    WebSocketService.createInstanceSocket("http://localhost:3002", token);

    const fetchRounds = async () => {
      try {
        const roundsData = await RoundService.getRounds();
        setRounds(roundsData);
      } catch (error) {
        console.error("Erreur lors du chargement des parties :", error);
      }
    };

    fetchRounds();

    const socket = WebSocketService.getSocket();
    if (socket) {
      socket.on("roundCreated", (round: CreateRoundDto) => {
        setRounds((prev) => [...prev, round]);
      });

      socket.on("roundUpdated", (round: CreateRoundDto) => {
        setRounds((prev) =>
          prev.map((r) => (r.id_rond === round.id_rond ? round : r))
        );
      });

      // Ecouter l'événement "matchReady" pour notifier les joueurs
      socket.on(
        "matchReady",
        (data: { playerOneName: string; playerTwoName: string }) => {
          console.log(
            `Match prêt entre ${data.playerOneName} et ${data.playerTwoName}`
          );
          setPlayerOneName(data.playerOneName);  // Met à jour playerOneName
          setPlayerTwoName(data.playerTwoName);  // Met à jour playerTwoName
          setMatchModalOpen(true); // Ouvre le modal de match prêt
        }
      );
    }

    return () => WebSocketService.closeSocket();
  }, []);

  const openConfirmationDialog = (round: CreateRoundDto) => {
    setSelectedRound(round);
    setConfirmationModalOpen(true);
  };

  const handleRoundCreated = (newRound: CreateRoundDto) => {
    setRounds((prev) => [...prev, newRound]);
  };

  // Fermer le modal et rediriger vers /game
  const handleStartGame = () => {
    setMatchModalOpen(false);
    navigate("/game"); // Redirige vers la page du jeu
  };

  return (
    <div className="container">
      <h1 className="liste">Liste des parties:</h1>
      <div className="round-list">
        {rounds.length > 0 ? (
          rounds.map((round) => (
            <Card
              key={round.id_rond}
              className="round-card clickable-card"
              onClick={() => openConfirmationDialog(round)}
            >
              <CardContent className="card-style">
                <Typography variant="h6" className="idRound">
                  Partie #{round.id_rond}
                </Typography>
                <Typography>
                  Taille de la grille : {round.matrix_size}
                </Typography>
                <Typography>Score maximum : {round.max_score}</Typography>
                <Typography>
                  Temps de réflexion : {round.reflexion_time} secondes
                </Typography>
                <Typography>
                  Durée limite : {round.duration_time} minutes
                </Typography>
                <Typography>Mise : {round.mise}</Typography>
                <Typography variant="h6" className="idPlayer">
                  Créateur : Joueur {round.creatorId}
                </Typography>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography>Aucune partie disponible</Typography>
        )}
      </div>
      <AddRoundComponent
        currentUserId={currentUserId}
        onRoundCreated={handleRoundCreated}
      />
      {selectedRound && (
        <ConfirmeRound
          round={selectedRound}
          open={confirmationModalOpen}
          onClose={() => setConfirmationModalOpen(false)}
          currentUserId={currentUserId}
        />
      )}

<MatchModal
  open={matchModalOpen}  
  playerOneName={playerOneName}
  playerTwoName={playerTwoName}
  onClose={() => setMatchModalOpen(false)}
  onStartGame={handleStartGame}
/>
    </div>
  );
};

export default RoundComponent;
