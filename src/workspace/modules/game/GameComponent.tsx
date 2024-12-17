import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import RoundService from "../../../shared/service/RoundService";
import WebSocketService from "../../../shared/service/WebSocketService";

interface IRoundGame {
  matrix: number[][];
  [key: string]: any; // Ajoute d'autres propriétés si nécessaire
}

const GameComponent: React.FC = () => {
  const { roundId } = useParams<{ roundId: string }>();
  const [matrix, setMatrix] = useState<number[][]>([]);
  const [round, setRound] = useState<IRoundGame | null>(null);
  const [error, setError] = useState<string | null>(null);

/**
 * LIFECYCLE
 */

  useEffect(() => {
    // Gestion WebSocket
    const token = localStorage.getItem("accessToken") || "";
    WebSocketService.createInstanceSocket("http://localhost:3002", token);

    WebSocketService.listen("roundUpdate", (data: IRoundGame) => {
      console.log("Données reçues via WebSocket:", data);
      if (data && Array.isArray(data.matrix)) {
        setRound(data);
        setMatrix(data.matrix); // Mettre à jour la matrice si elle est dans les données reçues
      } else {
        console.error("Données invalides reçues:", data);
      }
    });

    // Nettoyage lors de la destruction du composant
    return () => {
      WebSocketService.closeSocket();
    };
  }, []);

  useEffect(() => {
    if (!roundId) {
      setError("Identifiant du round manquant.");
      return;
    }

    const fetchMatrix = async () => {
      try {
        const initialMatrix = await RoundService.getMatrix(parseInt(roundId, 10));
        setMatrix(initialMatrix);
      } catch (err: any) {
        console.error("Erreur lors du chargement de la matrice :", err.message);
        setError("Impossible de charger la matrice.");
      }
    };

    fetchMatrix();

    // Écouter les mises à jour spécifiques au round via WebSocket
    RoundService.listenToMatrix(parseInt(roundId, 10), (updatedMatrix: number[][]) => {
      setMatrix(updatedMatrix);
    });

    // Nettoyage des écouteurs à la destruction du composant
    return () => {
      const socket = WebSocketService.getSocket();
      if (socket) {
        socket.off(`matrixUpdate_${roundId}`);
      }
    };
  }, [roundId]);

  const renderMatrix = () => {
    if (!matrix.length) return <p>Chargement...</p>;

    return (
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${matrix[0].length}, 1fr)` }}>
        {matrix.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              style={{
                width: 50,
                height: 50,
                border: "1px solid #ddd",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: cell ? "#4caf50" : "#fff",
              }}
            >
              {cell}
            </div>
          ))
        )}
      </div>
    );
  };

  if (!roundId) {
    return <p>Round ID introuvable.</p>;
  }

  return (
    <div>
      <h3>Matrice du Round</h3>
      {error ? <p style={{ color: "red" }}>{error}</p> : renderMatrix()}
    </div>
  );
};

export default GameComponent;
