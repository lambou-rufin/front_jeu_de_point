import io from 'socket.io-client';
import { CreateRoundDto } from "../models/interface";

// Classe de gestion des rounds
class RoundService {
  private socket;
  
  constructor() {
    // Connecte au serveur WebSocket sur le namespace 'rounds' (assure-toi que ton serveur WebSocket écoute bien sur ce namespace)
    this.socket = io('http://localhost:3002/rounds'); // L'adresse de ton serveur WebSocket
  }

  // Méthode pour obtenir le pseudo depuis le token
  public getPseudo() {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const payloadBase64 = token.split(".")[1];
        const payloadJson = atob(payloadBase64);
        const data = JSON.parse(payloadJson);
        return data.pseudo;
      } catch (error) {
        console.log("error");
      }
    }
  }

  // Méthode pour obtenir l'ID utilisateur depuis le token
  public getIdFromToken() {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const payloadBase64 = token.split(".")[1];
        const payloadJson = atob(payloadBase64);
        const data = JSON.parse(payloadJson);
        return data.id;
      } catch (error) {
        console.log("error");
      }
    }
  }

// Méthode pour créer une partie via WebSocket
async createRound(createRoundDto: CreateRoundDto): Promise<CreateRoundDto | void> {
  return new Promise((resolve, reject) => {
    createRoundDto.creatorId = this.getIdFromToken();
    this.socket.emit('createRound', createRoundDto, (response: any) => {
      if (response?.event === 'roundCreated') {
        console.log('Partie créée avec succès', response.data);
        resolve(response.data);
      } else {
        console.error('Erreur lors de la création de la partie', response?.data || response);
        reject(new Error('Erreur lors de la création de la partie'));
      }
    });
  });
}

  // Méthode pour récupérer toutes les parties existantes via WebSocket
  async getRounds(): Promise<any> {
    // Demande à obtenir les rounds existants via WebSocket (si nécessaire pour ton cas)
    this.socket.emit('getRounds', {}, (response: any) => {
      console.log('Réponse pour les rounds existants:', response);
      return response.data;
    });
  }
  
  // Méthode pour confirmer un joueur via WebSocket
  async confirmPlayer(roundId: number, playerId: number): Promise<any> {
    const id = this.getIdFromToken();
    this.socket.emit('confirmPlayer', { roundId, playerId, userId: id }, (response: any) => {
      if (response.event === 'playerConfirmed') {
        console.log('Participation confirmée pour le joueur');
        return response.data;
      } else {
        console.error('Erreur lors de la confirmation du joueur', response.data);
      }
    });
  }
}

export default new RoundService();
