import React, { useEffect, useState } from "react";
import { Typography, Card, CardContent } from "@mui/material";
import { IRoundGame } from "../../../shared/models/interface";
import ConfirmeRound from "../confirmeRound/confirmeRound";
import WebSocketService from "../../../shared/service/WebSocketService";
import RoundService from "../../../shared/service/RoundService";
import "./Round.css";
import AddRoundComponent from "./AddRoundComponent";
import MatchModal from "../../../shared/components/modal/MatchModal";
import { useNavigate } from "react-router-dom";

const RoundComponent: React.FC<{ currentUserId: number }> = ({
  currentUserId,
}) => {
  const [rounds, setRounds] = useState<IRoundGame[]>([]);
  const [selectedRound, setSelectedRound] = useState<IRoundGame | null>(
    null
  );
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [matchModalOpen, setMatchModalOpen] = useState(false);
  const [playerOneName, setPlayerOneName] = useState("");
  const [playerTwoName, setPlayerTwoName] = useState("");
  const navigate = useNavigate();
  console.log(rounds);

  /**
 * LIFECYCLE
 */

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
      socket.on("roundCreated", (round: IRoundGame) => {
        setRounds((prev) => [...prev, round]);
      });

      socket.on("roundUpdated", (round: IRoundGame) => {
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
          setPlayerOneName(data.playerOneName); // Met à jour playerOneName
          setPlayerTwoName(data.playerTwoName); // Met à jour playerTwoName
          setMatchModalOpen(true); // Ouvre le modal de match prêt
        }
      );
    }

    return () => WebSocketService.closeSocket();
  }, []);

  /**
 * FONCTION
 */

  const openConfirmationDialog = (round: IRoundGame) => {
    setSelectedRound(round);
    setConfirmationModalOpen(true);
  };

  const handleRoundCreated = (newRound: IRoundGame) => {
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
      {/* <div className="round-list">
      {rounds.length > 0 ? (
        rounds.map((round) => (
          <Card
            key={round.id_rond || `round-${round.matrix_size}-${round.creatorId}`}
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
    </div> */}
      <div className="round-list">
        {rounds.length > 0 ? (
          rounds
            .filter(
              (round) =>
                round.id_rond &&
                round.matrix_size &&
                round.creatorId &&
                round.max_score &&
                round.reflexion_time &&
                round.duration_time &&
                round.mise
            )
            .map((round) => (
              <Card
                key={
                  round.id_rond ||
                  `round-${round.matrix_size}-${round.creatorId}`
                }
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
          <Typography className="texte">Aucune partie disponible</Typography>
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
