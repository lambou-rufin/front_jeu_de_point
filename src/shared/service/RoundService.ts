
// import io, { Socket } from "socket.io-client";
// import { CreateRoundDto } from "../models/interface";

// class RoundService {
//   private socket: Socket | null = null;

//   constructor() {
//     this.connectSocket();
//   }

//   /**
//    * Initialise la connexion WebSocket
//    */
//   private connectSocket(): void {
//     try {
//       this.socket = io("ws://localhost:3002", {
//         transports: ["websocket"],
//         reconnection: true,
//       });

//       this.socket.on("connect", () => {
//         console.log("Connecté au serveur WebSocket.");
//       });

//       this.socket.on("disconnect", () => {
//         console.warn("Déconnecté du serveur WebSocket.");
//         this.socket = null;
//       });

//       this.socket.on("roundError", (error: any) => {
//         console.error("Erreur reçue du serveur :", error);
//       });
//     } catch (error) {
//       console.error("Erreur lors de la connexion au serveur WebSocket :", error);
//     }
//   }

//   /**
//    * Vérifie si la connexion WebSocket est active
//    */
//   private async ensureSocketConnection(): Promise<void> {
//     if (!this.socket || !this.socket.connected) {
//       console.error("Le WebSocket n'est pas connecté.");
//       throw new Error("Impossible de se connecter au serveur WebSocket.");
//     }
//   }

//   /**
//    * Décode le token pour extraire les informations utilisateur
//    */
//   private decodeToken(): { id?: number; pseudo?: string; playerId?: number } | null {
//     const token = localStorage.getItem("accessToken");
//     if (token && token.split(".").length === 3) {
//       try {
//         const payloadBase64 = token.split(".")[1];
//         const payloadJson = atob(payloadBase64);
//         const decoded = JSON.parse(payloadJson);
//         console.log("Payload décodé du token :", decoded);
//         return decoded;
//       } catch (error) {
//         console.error("Erreur lors du décodage du token :", error);
//       }
//     } else {
//       console.error("Token mal formé ou absent.");
//     }
//     return null;
//   }

//   /**
//    * Obtient l'ID de l'utilisateur à partir du token
//    */
//   public getIdFromToken(): number | undefined {
//     const data = this.decodeToken();
//     return data?.id;
//   }

//   /**
//    * Obtient l'ID du joueur à partir du token
//    */
//   public getPlayerIdFromToken(): number | undefined {
//     const data = this.decodeToken();
//     return data?.playerId;
//   }

//   /**
//    * Méthode générique pour émettre des événements WebSocket
//    */
//   private emitEvent<T>(event: string, data: any): Promise<T> {
//     return this.ensureSocketConnection().then(() => {
//       return new Promise((resolve, reject) => {
//         this.socket!.emit(event, data, (response: any) => {
//           if (response?.success) {
//             console.log(`${event} réussi`, response.data);
//             resolve(response.data);
//           } else {
//             console.error(`${event} échoué`, response?.error || response);
//             reject(response?.error || new Error(`Erreur lors de l'événement ${event}`));
//           }
//         });
//       });
//     });
//   }

//   /**
//    * Crée un nouveau round
//    */
//   async createRound(createRoundDto: CreateRoundDto): Promise<any> {
//     const playerId = this.getPlayerIdFromToken();
//     if (!playerId) {
//       throw new Error("Impossible de récupérer l'ID du joueur depuis le token.");
//     }

//     return this.emitEvent<any>("createRound", { ...createRoundDto, playerId });
//   }

//   /**
//    * Récupère tous les rounds
//    */
//   async getRounds(): Promise<any[]> {
//     return this.emitEvent<any[]>("getRounds", {});
//   }

//   /**
//    * Confirme un joueur dans un round
//    */
//   async confirmPlayer(roundId: number): Promise<any> {
//     const playerId = this.getPlayerIdFromToken();
//     if (!playerId) {
//       throw new Error("Impossible de récupérer l'ID du joueur depuis le token.");
//     }

//     return this.emitEvent<any>("confirmPlayer", { roundId, playerId });
//   }

//   /**
//    * Écoute les événements pour les rounds créés
//    */
//   listenToRounds(callback: (round: any) => void): void {
//     if (!this.socket) {
//       console.error("Le WebSocket n'est pas connecté.");
//       return;
//     }

//     this.socket.on("roundCreated", callback);
//   }

//   /**
//    * Déconnexion propre du service
//    */
//   disconnect(): void {
//     if (this.socket && this.socket.connected) {
//       this.socket.disconnect();
//       console.log("Déconnecté proprement du serveur WebSocket.");
//     }
//   }
// }

// export default new RoundService();

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
