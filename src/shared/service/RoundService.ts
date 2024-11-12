// RoundService.ts
import axios from "axios";
import api from "../../api/api";
import { ConfirmPlayerResponse, CreateRoundDto } from "../models/interface";

class RoundService {
  public getPseudo() {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const payloadBase64 = token.split(".")[1];
        const payloadJson = atob(payloadBase64);
        const data = JSON.parse(payloadJson);
        const pseudo = data.pseudo;

        return pseudo;
      } catch (error) {
        console.log("error");
      }
    }
  }

  public getIdFromToken() {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const payloadBase64 = token.split(".")[1];
        const payloadJson = atob(payloadBase64);
        const data = JSON.parse(payloadJson);
        const userId = data.id;

        return userId;
      } catch (error) {
        console.log("error");
      }
    }
  }

  // Méthode pour créer une partie
  async createRound(createRoundDto: CreateRoundDto): Promise<CreateRoundDto> {
    try {
      const response = await api.post("/rounds", createRoundDto);
      const pseudo = this.getPseudo();
      console.log(pseudo);
      return response.data; // Retourne les données de la partie créée
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Échec de la création du round"
        );
      }
      throw new Error("Échec de la création du round");
    }
  }

  // Méthode pour récupérer les parties existantes
  async getRounds(): Promise<CreateRoundDto[]> {
    try {
      const response = await api.get("/findAllRounds");
      return response.data; // Retourne les données des parties existantes
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Échec du chargement des parties"
        );
      }
      throw new Error("Échec du chargement des parties");
    }
  }
  // Méthode pour confirmer la participation d'un joueur à une partie
  async confirmPlayer(roundId: number, playerId: number): Promise<any> {
    const id = this.getIdFromToken();
    console.log(id);
    try {
      console.log(
        `Confirmer le round avec ID: ${roundId} pour le joueur ID: ${playerId}`
      ); // Log de vérification
      const response = await api.post(`/rounds/${roundId}/confirm`, {
        playerId,
      });
      return response.data; // Retourne les données de confirmation
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message ||
            "Échec de la confirmation de la participation"
        );
      }
      throw new Error("Échec de la confirmation de la participation");
    }
  }
}
export default RoundService;
