import { io, Socket } from 'socket.io-client';

const url = 'http://localhost:3002';

class WebSocketService {
  private static socket: Socket | null = null;

  /**
   * Crée une instance de socket avec les options et le token d'autorisation.
   */
  static createInstanceSocket(url: string, token: string = '') {
    this.socket = io(url, {
      transportOptions: {
        polling: {
          extraHeaders: {
            authorization: `Bearer ${token}`,
          },
        },
      },
    });

    // Gestion des événements standards
    this.socket.on('connect', () => {
      console.log('Connected to the Socket.IO server');
    });

    this.socket.on('connect_error', (error: any) => {
      console.error('Socket.IO connection error:', error);
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected. Reconnecting...');
    });

    return this.socket;
  }

  /**
   * Récupère l'instance active du socket.
   */
  static getSocket(): Socket | null {
    return this.socket;
  }

  /**
   * Ferme la connexion WebSocket.
   */
  static closeSocket() {
    this.socket?.disconnect();
    this.socket = null;
  }

  /**
   * Envoie un message via le socket et gère les erreurs spécifiques du backend.
   * @param event Nom de l'événement émis.
   * @param message Données à envoyer.
   * @returns Promise avec les données de la réponse ou une erreur.
   */
  static sendMessage<T>(event: string, message: any): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      if (this.socket) {
        // Émettre un événement avec un callback pour la réponse
        this.socket.emit(event, message, (response: any) => {
          if (response?.success) {
            resolve(response.data); // Résoudre avec les données renvoyées
          } else {
            // Renvoyer une erreur avec le message spécifique du backend ou un message par défaut
            const errorMessage =
              response?.error?.message || 'Une erreur est survenue.';
            console.error(`Erreur lors de l'événement '${event}':`, errorMessage);
            reject(new Error(errorMessage));
          }
        });
      } else {
        // Gestion du cas où le socket n'est pas initialisé
        const errorMessage = 'Socket is not initialized';
        console.error(errorMessage);
        reject(new Error(errorMessage));
      }
    });
  }
}

export default WebSocketService;
