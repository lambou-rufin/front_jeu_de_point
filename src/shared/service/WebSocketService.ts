// WebSocketService.ts
import { io, Socket } from 'socket.io-client';

class WebSocketService {
  private static socket: Socket | null = null;

  static createInstanceSocket(url: string, token: string = '') {
    // console.log(token);
    
    this.socket = io(url, {
      transportOptions:{
        polling:{
          extraHeaders: {
            authorization: `Bearer ${token}`,
          },
        }
      }
    });

    this.socket.on('connect', () => {
      console.log('Connected to the Socket.IO server');
    });

    this.socket.on('connect_error', (error) => {
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

  static sendMessage(event: string, message: any) {
    if (this.socket) {
      this.socket.emit(event, message);
    } else {
      console.error('Socket is not initialized');
    }
  }
}

export default WebSocketService;
