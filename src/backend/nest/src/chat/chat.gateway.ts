import { SubscribeMessage, WebSocketGateway, MessageBody,  WebSocketServer} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import {
  ServerToClientEvents,
  ClientToServerEvents,
  Message,
} from './chat.interface';
import { Server } from 'socket.io';

@WebSocketGateway(
  {
    cors: {
      origin: '*',
    },
  }
)
export class ChatGateway {
  @WebSocketServer() server: Server = new Server<
    ServerToClientEvents,
    ClientToServerEvents
  >();

  private logger = new Logger('ChatGateway');

  @SubscribeMessage('chat')
  async handleEvent(@MessageBody() payload: Message): Promise<Message> {
    this.logger.log(payload);
    this.server.emit('chat', payload); // broadcast messages
    return payload;
  }
}
