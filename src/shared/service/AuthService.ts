import axios from "axios";
import api from "../../api/api";
import { AuthResponse, SignInData, SignUpData } from "../models/interface";

class AuthService {
  // Méthode pour une requête protégée
  async fetchProtectedData(endpoint: string): Promise<any> {
    const token = localStorage.getItem('accessToken');

    const response = await api.get(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`, // Inclure le jeton dans les en-têtes
      },
    });

    return response.data;
  }
  // Méthode pour l'inscription
  async signUp(signUpData: SignUpData): Promise<void> {
    try {
      await api.post('/auth/signup', signUpData); // Utilisation du chemin uniquement
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Échec de l’inscription');
      }
      throw new Error('Échec de l’inscription');
    }
  }
  // Méthode pour la connexion
  async signIn(signInData: SignInData): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/signin', signInData); // Utilisation du chemin uniquement
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Échec de la connexion');
      }
      throw new Error('Échec de la connexion');
    }
  }
}

export default new AuthService();
