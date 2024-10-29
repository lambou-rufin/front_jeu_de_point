import { io } from 'socket.io-client';

class WebSocketService {
  private static socket: any;

  static createInstanceSocket(url: string) {
    // Utilisez le client Socket.IO pour se connecter
    this.socket = io(url, {
      transports: ['websocket']
    });

    this.socket.on('connect', () => {
      console.log('Connecté au serveur Socket.IO');
    });

    this.socket.on('disconnect', () => {
      console.log('Connexion Socket.IO fermée. Tentative de reconnexion...');
    });

    this.socket.on('connect_error', (error: any) => {
      console.error('Erreur de connexion Socket.IO :', error);
    });
  }

  static connect() {
    if (!this.socket) {
      console.warn('Socket non initialisé. Veuillez appeler createInstanceSocket d\'abord.');
      return;
    }
    this.socket.connect(); // Établissez la connexion WebSocket
  }

  static close() {
    if (this.socket) {
      this.socket.disconnect(); // Déconnectez le socket
      console.log('Socket déconnecté.');
    }
  }

  static sendMessage(event: string, data: any) {
    if (this.socket && this.socket.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn('Socket.IO non connecté. Message non envoyé :', { event, data });
    }
  }

  static onMessage(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('message', callback); // Écoutez les messages
    }
  }
}

export default WebSocketService;
