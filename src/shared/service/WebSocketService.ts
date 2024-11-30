import { io, Socket } from 'socket.io-client';

const url = 'http://localhost:3002';
class WebSocketService {
  private static socket: Socket | null = null;
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

  static getSocket(): Socket | null {
    return this.socket;
  }

  static closeSocket() {
    this.socket?.disconnect();
    this.socket = null;
  }

  static sendMessage<T>(event: string, message: any): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      if (this.socket) {
        this.socket.emit(event, message, (response: any) => {
          if (response?.success) {
            resolve(response.data); // Résoudre avec les données
          } else {
            reject(response?.error || new Error('Erreur lors de l\'événement'));
          }
        });
      } else {
        reject(new Error('Socket is not initialized'));
      }
    });
  }
}

export default WebSocketService;
