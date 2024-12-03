import { CreateRoundDto } from "../models/interface";
import WebSocketService from "./WebSocketService";

class RoundService {
  /**
   * Crée un nouveau round
   */
  async createRound(createRoundDto: CreateRoundDto): Promise<any> {
    const playerId = this.getPlayerIdFromToken();
    if (!playerId) {
      throw new Error("Impossible de récupérer l'ID du joueur depuis le token.");
    }

    const payload = { ...createRoundDto, playerId };
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
  async confirmPlayer(roundId: number): Promise<any> {
    const playerId = this.getPlayerIdFromToken();
    if (!playerId) {
      throw new Error("Impossible de récupérer l'ID du joueur depuis le token.");
    }

    return WebSocketService.sendMessage("confirmPlayer", { roundId, playerId });
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
}

export default new RoundService();
