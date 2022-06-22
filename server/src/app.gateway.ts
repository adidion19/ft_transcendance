import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { AppService } from './app.service';
import { Chat } from './chat.entity';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
})
export class AppGateway
 implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
 constructor(private appService: AppService) {}
 
 @WebSocketServer() server: Server;
 private logger: Logger = new Logger('AppGateway');
 users: number = 0;
 
 @SubscribeMessage('send_message')
 async handleSendMessage(client: Socket, payload: Chat): Promise<void> {
   await this.appService.createMessage(payload);
   this.server.emit('receive_message', payload);
 }
 
 afterInit(server: Server) {
  this.logger.log('Init');
   //Do stuffs
 }
 
 handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.users--;
    //this.server.emit('users', this.users);
   //Do stuffs
 }
 
 handleConnection(client: Socket, ...args: any[]) {
  this.logger.log(`Client connected: ${client.id}`);
  this.users++;
  this.server.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);
  
    socket.on("join_room", (data) => {
      socket.join(data);
    });
  
    socket.on("send_message", (data) => {
      socket.to(data.room).emit("receive_message", data);
    });
  });
}
}
