import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { BoardsService } from '../boards/boards.service';
interface AuthenticatedSocket extends Socket {
    userId?: string;
    boardId?: string;
}
export declare class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private jwtService;
    private boardsService;
    server: Server;
    constructor(jwtService: JwtService, boardsService: BoardsService);
    handleConnection(client: AuthenticatedSocket): Promise<void>;
    handleDisconnect(client: AuthenticatedSocket): void;
    handleJoinBoard(boardId: string, client: AuthenticatedSocket): Promise<void>;
    handleBlockUpdate(data: any, client: AuthenticatedSocket): void;
    handleBlockCreate(data: any, client: AuthenticatedSocket): void;
    handleBlockDelete(data: any, client: AuthenticatedSocket): void;
    handleBlockMove(data: any, client: AuthenticatedSocket): void;
}
export {};
