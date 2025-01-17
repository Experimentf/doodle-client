import { Socket } from 'socket.io-client';

export interface HunchInterface {
  senderId: Socket['id'];
  message: string;
  status: '0' | '1' | '2';
}
