// RoundService.ts
import axios from "axios";
import api from "../../api/api";
import { CreateRoundDto } from "../models/interface";

class RoundService {
  // Méthode pour créer une partie
  async createRound(createRoundDto: CreateRoundDto): Promise<CreateRoundDto> {
    try {
      const response = await api.post('/rounds', createRoundDto);
      return response.data; // Retourne les données de la partie créée
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Échec de la création du round');
      }
      throw new Error('Échec de la création du round');
    }
  }

  // Méthode pour récupérer les parties existantes
  async getRounds(): Promise<CreateRoundDto[]> {
    try {
      const response = await api.get('/findAllRounds');
      return response.data; // Retourne les données des parties existantes
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Échec du chargement des parties');
      }
      throw new Error('Échec du chargement des parties');
    }
  }
}

export default RoundService;
