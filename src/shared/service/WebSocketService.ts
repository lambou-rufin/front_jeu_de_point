// import { io, Socket } from 'socket.io-client';

// const url = 'http://localhost:3002';

// class WebSocketService {
//   private static socket: Socket | null = null;

//   /**
//    * Crée une instance de socket avec les options et le token d'autorisation.
//    */
//   static createInstanceSocket(url: string, token: string = '') {
//     this.socket = io(url, {
//       transportOptions: {
//         polling: {
//           extraHeaders: {
//             authorization: `Bearer ${token}`,
//           },
//         },
//       },
//     });

//     // Gestion des événements standards
//     this.socket.on('connect', () => {
//       console.log('Connected to the Socket.IO server');
//     });

//     this.socket.on('connect_error', (error: any) => {
//       console.error('Socket.IO connection error:', error);
//     });

//     this.socket.on('disconnect', () => {
//       console.log('Disconnected. Reconnecting...');
//     });

//     return this.socket;
//   }

//   /**
//    * Récupère l'instance active du socket.
//    */
//   static getSocket(): Socket | null {
//     return this.socket;
//   }

//   /**
//    * Ferme la connexion WebSocket.
//    */
//   static closeSocket() {
//     this.socket?.disconnect();
//     this.socket = null;
//   }

//   /**
//    * Envoie un message via le socket et gère les erreurs spécifiques du backend.
//    * @param event Nom de l'événement émis.
//    * @param message Données à envoyer.
//    * @returns Promise avec les données de la réponse ou une erreur.
//    */
//   static sendMessage<T>(event: string, message: any): Promise<T> {
//     return new Promise<T>((resolve, reject) => {
//       if (this.socket) {
//         // Émettre un événement avec un callback pour la réponse
//         this.socket.emit(event, message, (response: any) => {
//           if (response?.success) {
//             resolve(response.data); // Résoudre avec les données renvoyées
//           } else {
//             // Renvoyer une erreur avec le message spécifique du backend ou un message par défaut
//             const errorMessage =
//               response?.error?.message || 'Une erreur est survenue.';
//             console.error(`Erreur lors de l'événement '${event}':`, errorMessage);
//             reject(new Error(errorMessage));
//           }
//         });
//       } else {
//         // Gestion du cas où le socket n'est pas initialisé
//         const errorMessage = 'Socket is not initialized';
//         console.error(errorMessage);
//         reject(new Error(errorMessage));
//       }
//     });
//   }
// }

// export default WebSocketService;


import { io, Socket } from 'socket.io-client';

const url = 'http://localhost:3002';

class WebSocketService {
  private static socket: Socket | null = null;

  /**
   * Crée une instance de socket avec les options et le token d'autorisation.
   * @param url URL du serveur Socket.IO.
   * @param token Jeton d'autorisation (facultatif).
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
   * @returns Instance du socket ou `null` si non initialisé.
   */
  static getSocket(): Socket | null {
    return this.socket;
  }

  /**
   * Ferme la connexion WebSocket.
   */
  static closeSocket() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      console.log('WebSocket connection closed');
    }
  }

  /**
   * Envoie un message via le socket et gère les erreurs spécifiques du backend.
   * @param event Nom de l'événement émis.
   * @param message Données à envoyer.
   * @returns Promise avec les données de la réponse ou une erreur.
   */
  // static sendMessage<T>(event: string, message: any): Promise<T> {
  //   return new Promise<T>((resolve, reject) => {
  //     if (this.socket) {
  //       // Émettre un événement avec un callback pour la réponse
  //       this.socket.emit(event, message, (response: any) => {
  //         if (response?.success) {
  //           resolve(response.data); // Résoudre avec les données renvoyées
  //         } else {
  //           // Renvoyer une erreur avec le message spécifique du backend ou un message par défaut
  //           const errorMessage =
  //             response?.error?.message || 'Une erreur est survenue.';
  //           console.error(`Erreur lors de l'événement '${event}':`, errorMessage);
  //           reject(new Error(errorMessage));
  //         }
  //       });
  //     } else {
  //       const errorMessage = 'Socket is not initialized';
  //       console.error(errorMessage);
  //       reject(new Error(errorMessage));
  //     }
  //   });
  // }

  static sendMessage<T>(event: string, message: any): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      if (!this.socket) {
        const errorMessage = 'La socket WebSocket n’est pas initialisée.';
        console.error(errorMessage);
        return reject(new Error(errorMessage));
      }
  
      try {
        // Émettre un événement avec un callback pour attendre la réponse
        this.socket.emit(event, message, (response: any) => {
          if (response?.success) {
            // Résolution avec les données renvoyées par le backend
            resolve(response.data);
          } else {
            // Gestion des erreurs spécifiques renvoyées par le backend
            const errorMessage = response?.error?.message || 'Une erreur est survenue côté serveur.';
            console.error(`Erreur lors de l'événement '${event}':`, errorMessage);
            reject(new Error(errorMessage));
          }
        });
      } catch (error) {
        // Gestion des exceptions inattendues
        const errorMessage = `Exception lors de l'émission de l'événement '${event}': ${(error as Error).message}`;
        console.error(errorMessage);
        reject(new Error(errorMessage));
      }
    });
  }  

  /**
   * Écoute les événements provenant du serveur WebSocket.
   * @param event Nom de l'événement à écouter.
   * @param callback Fonction à exécuter lorsque l'événement est reçu.
   */
  static listen(event: string, callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on(event, callback);
    } else {
      console.error('Socket is not initialized. Cannot listen for events.');
    }
  }

  /**
   * Arrête l'écoute d'un événement spécifique.
   * @param event Nom de l'événement à arrêter d'écouter.
   */
  static off(event: string) {
    if (this.socket) {
      this.socket.off(event);
    } else {
      console.error('Socket is not initialized. Cannot stop listening for events.');
    }
  }
}

export default WebSocketService;
