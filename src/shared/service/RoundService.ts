import { ConfirmPlayerResponse, IRoundGame } from "../models/interface";
import WebSocketService from "./WebSocketService";

class RoundService {
  /**
   * Crée un nouveau round
   */
  async createRound(iRoundGame: IRoundGame): Promise<any> {
    const playerId = this.getPlayerIdFromToken();
    if (!playerId) {
      throw new Error("Impossible de récupérer l'ID du joueur depuis le token.");
    }

    const payload = { ...iRoundGame, playerId };
    return WebSocketService.sendMessage("createRound", payload);
  }

  /**
   * Récupère tous les rounds
   */
  async getRounds(): Promise<any[]> {
    // Appel avec le bon type générique
    return WebSocketService.sendMessage("getRounds", {});
  }

  /**
   * Confirme un joueur dans un round
   */
  // async confirmPlayer(roundId: number): Promise<any> {
  //   const playerId = this.getPlayerIdFromToken();
  //   if (!playerId) {
  //     throw new Error("Impossible de récupérer l'ID du joueur depuis le token.");
  //   }

  //   return WebSocketService.sendMessage("confirmPlayer", { roundId, playerId });
  // }

  async confirmPlayer(roundId: number): Promise<ConfirmPlayerResponse> {
    try {
      // Récupérer l'ID du joueur depuis le token
      const playerId = this.getPlayerIdFromToken();
      if (!playerId) {
        throw new Error("Impossible de récupérer l'ID du joueur depuis le token.");
      }
  
      // Envoyer un message via WebSocket
      const response: ConfirmPlayerResponse = await WebSocketService.sendMessage(
        "confirmPlayer",
        { roundId, playerId }
      );
  
      // Vérifier la réponse pour des erreurs spécifiques
      if (!response || response.error) {
        throw new Error(response.error || "Une erreur est survenue lors de la confirmation.");
      }
  
      return response; // Renvoie les données si la confirmation réussit
    } catch (error: any) {
      // Gestion des erreurs spécifiques envoyées par le backend
      const errorMessage = error.message;
  
      if (errorMessage.includes("Partie non trouvée")) {
        console.error("Erreur : Partie non trouvée.");
        throw new Error("La partie demandée est introuvable.");
      }
  
      if (errorMessage.includes("Ce round a déjà un deuxième joueur")) {
        console.error("Erreur : Round déjà complet.");
        throw new Error("Ce round a déjà un deuxième joueur.");
      }
  
      if (errorMessage.includes("Solde insuffisant")) {
        console.error("Erreur : Solde insuffisant.");
        throw new Error("Vous ou le créateur de la partie n'avez pas un solde suffisant pour participer.");
      }
  
      if (errorMessage.includes("Le créateur et le second joueur doivent être différents")) {
        console.error("Erreur : Joueur déjà inscrit.");
        throw new Error("Vous ne pouvez pas rejoindre votre propre partie.");
      }
  
      // Gestion des erreurs générales ou inattendues
      console.error("Erreur inattendue :", errorMessage);
      throw new Error("Une erreur inattendue est survenue. Veuillez réessayer.");
    }
  }
  

  /**
   * Écoute les événements pour les rounds créés
   */
  listenToRounds(callback: (round: any) => void): void {
    const socket = WebSocketService.getSocket();
    socket?.on("roundCreated", callback);
  }

  /**
   * Décode le token pour extraire les informations utilisateur
   */
  private decodeToken(): { id?: number; pseudo?: string; playerId?: number } | null {
    const token = localStorage.getItem("accessToken");
    if (token && token.split(".").length === 3) {
      try {
        const payloadBase64 = token.split(".")[1];
        const payloadJson = atob(payloadBase64);
        const decoded = JSON.parse(payloadJson);
        console.log("Payload décodé du token :", decoded);
        return decoded;
      } catch (error) {
        console.error("Erreur lors du décodage du token :", error);
      }
    } else {
      console.error("Token mal formé ou absent.");
    }
    return null;
  }

  /**
   * Obtient l'ID de l'utilisateur à partir du token
   */
  public getIdFromToken(): number | undefined {
    const data = this.decodeToken();
    return data?.id;
  }

  /**
   * Obtient l'ID du joueur à partir du token
   */
  public getPlayerIdFromToken(): number | undefined {
    const data = this.decodeToken();
    return data?.playerId;
  }

/**
 * Écoute les événements pour récupérer la matrice d'un round
 */
listenToMatrix(roundId: number, callback: (matrix: number[][]) => void): void {
  const socket = WebSocketService.getSocket();
  if (!socket) {
    console.error("Le socket WebSocket n'est pas initialisé.");
    return;
  }

  // Écouter l'événement de mise à jour de la matrice
  socket.on(`matrixUpdate_${roundId}`, callback);
}

/**
 * Récupère la matrice initiale d'un round
 */
async getMatrix(roundId: number): Promise<number[][]> {
  return WebSocketService.sendMessage("getMatrix", { roundId });
}

}


export default new RoundService();
