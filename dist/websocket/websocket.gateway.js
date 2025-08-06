"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebsocketGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const jwt_1 = require("@nestjs/jwt");
const boards_service_1 = require("../boards/boards.service");
let WebsocketGateway = class WebsocketGateway {
    constructor(jwtService, boardsService) {
        this.jwtService = jwtService;
        this.boardsService = boardsService;
    }
    async handleConnection(client) {
        try {
            const token = client.handshake.auth.token;
            if (!token) {
                client.disconnect();
                return;
            }
            const decoded = this.jwtService.verify(token);
            client.userId = decoded.sub;
            console.log(`User ${client.userId} connected`);
        }
        catch (error) {
            console.log('Authentication failed:', error.message);
            client.disconnect();
        }
    }
    handleDisconnect(client) {
        console.log(`User ${client.userId} disconnected`);
    }
    async handleJoinBoard(boardId, client) {
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
        }
        catch (error) {
            client.emit('error', 'Failed to join board');
        }
    }
    handleBlockUpdate(data, client) {
        if (client.boardId) {
            client.to(client.boardId).emit('block-updated', data);
        }
    }
    handleBlockCreate(data, client) {
        if (client.boardId) {
            client.to(client.boardId).emit('block-created', data);
        }
    }
    handleBlockDelete(data, client) {
        if (client.boardId) {
            client.to(client.boardId).emit('block-deleted', data);
        }
    }
    handleBlockMove(data, client) {
        if (client.boardId) {
            client.to(client.boardId).emit('block-moved', data);
        }
    }
};
exports.WebsocketGateway = WebsocketGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], WebsocketGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('join-board'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], WebsocketGateway.prototype, "handleJoinBoard", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('block-updated'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], WebsocketGateway.prototype, "handleBlockUpdate", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('block-created'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], WebsocketGateway.prototype, "handleBlockCreate", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('block-deleted'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], WebsocketGateway.prototype, "handleBlockDelete", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('block-moved'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], WebsocketGateway.prototype, "handleBlockMove", null);
exports.WebsocketGateway = WebsocketGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: process.env.FRONTEND_URL || 'http://localhost:3000',
            methods: ['GET', 'POST'],
            credentials: true,
        },
    }),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        boards_service_1.BoardsService])
], WebsocketGateway);
//# sourceMappingURL=websocket.gateway.js.map