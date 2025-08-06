import {
    WebSocketGateway,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  import { UseGuards } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import { BoardsService } from '../boards/boards.service';
  import { WsJwtGuard } from './guards/ws-jwt.guard';
  
  interface AuthenticatedSocket extends Socket {
    userId?: string;
    boardId?: string;
  }
  
  @WebSocketGateway({
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  })
  export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;
  
    constructor(
      private jwtService: JwtService,
      private boardsService: BoardsService,
    ) {}
  
    async handleConnection(client: AuthenticatedSocket) {
      try {
        const token = client.handshake.auth.token;
        if (!token) {
          client.disconnect();
          return;
        }
  
        const decoded = this.jwtService.verify(token);
        client.userId = decoded.sub;
        
        console.log(`User ${client.userId} connected`);
      } catch (error) {
        console.log('Authentication failed:', error.message);
        client.disconnect();
      }
    }
  
    handleDisconnect(client: AuthenticatedSocket) {
      console.log(`User ${client.userId} disconnected`);
    }
  
    @SubscribeMessage('join-board')
    async handleJoinBoard(
      @MessageBody() boardId: string,
      @ConnectedSocket() client: AuthenticatedSocket,
    ) {
      try {
        if (!client.userId) {
          client.emit('error', 'Not authenticated');
          return;
        }
  
        const hasAccess = await this.boardsService.checkBoardAccess(boardId, client.userId);
        if (!hasAccess) {
          client.emit('error', 'Access denied');
          return;
        }
  
        client.boardId = boardId;
        client.join(boardId);
        client.emit('joined-board', boardId);
      } catch (error) {
        client.emit('error', 'Failed to join board');
      }
    }
  
    @SubscribeMessage('block-updated')
    handleBlockUpdate(
      @MessageBody() data: any,
      @ConnectedSocket() client: AuthenticatedSocket,
    ) {
      if (client.boardId) {
        client.to(client.boardId).emit('block-updated', data);
      }
    }
  
    @SubscribeMessage('block-created')
    handleBlockCreate(
      @MessageBody() data: any,
      @ConnectedSocket() client: AuthenticatedSocket,
    ) {
      if (client.boardId) {
        client.to(client.boardId).emit('block-created', data);
      }
    }
  
    @SubscribeMessage('block-deleted')
    handleBlockDelete(
      @MessageBody() data: any,
      @ConnectedSocket() client: AuthenticatedSocket,
    ) {
      if (client.boardId) {
        client.to(client.boardId).emit('block-deleted', data);
      }
    }
  
    @SubscribeMessage('block-moved')
    handleBlockMove(
      @MessageBody() data: any,
      @ConnectedSocket() client: AuthenticatedSocket,
    ) {
      if (client.boardId) {
        client.to(client.boardId).emit('block-moved', data);
      }
    }
  }
  