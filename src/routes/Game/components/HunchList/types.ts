import { Socket } from 'socket.io-client';

export interface HunchInterface {
  senderId: Socket['id'];
  message: string;
  status: 'error' | 'success' | 'close';
}
