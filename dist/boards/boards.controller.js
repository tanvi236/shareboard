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
exports.BoardsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const boards_service_1 = require("./boards.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const get_user_decorator_1 = require("../auth/decorators/get-user.decorator");
const boards_service_2 = require("./boards.service");
let BoardsController = class BoardsController {
    constructor(boardsService) {
        this.boardsService = boardsService;
    }
    async findAll(user) {
        const boards = await this.boardsService.findAll(user._id.toString());
        return {
            success: true,
            data: boards,
        };
    }
    async findOne(id, user) {
        const board = await this.boardsService.findOne(id, user._id.toString());
        return {
            success: true,
            data: board,
        };
    }
    async getBoardWithBlocks(id, user) {
        const board = await this.boardsService.findBoardWithBlocks(id, user._id.toString());
        return {
            success: true,
            data: board,
        };
    }
    async create(createBoardDto, user) {
        const board = await this.boardsService.create(createBoardDto, user._id.toString());
        return {
            success: true,
            data: board,
        };
    }
    async update(id, updateBoardDto, user) {
        const board = await this.boardsService.update(id, updateBoardDto, user._id.toString());
        return {
            success: true,
            data: board,
        };
    }
    async remove(id, user) {
        await this.boardsService.remove(id, user._id.toString());
        return {
            success: true,
            message: 'Board deleted successfully',
        };
    }
    async addCollaborator(id, { email }, user) {
        const board = await this.boardsService.addCollaborator(id, email, user._id.toString());
        return {
            success: true,
            data: board,
        };
    }
};
exports.BoardsController = BoardsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all boards for user (owned + collaborated)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Boards retrieved successfully' }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BoardsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get board by id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Board retrieved successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BoardsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/blocks'),
    (0, swagger_1.ApiOperation)({ summary: 'Get board with all blocks' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Board with blocks retrieved successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BoardsController.prototype, "getBoardWithBlocks", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create new board' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Board created successfully' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [boards_service_2.CreateBoardDto, Object]),
    __metadata("design:returntype", Promise)
], BoardsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update board' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Board updated successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, boards_service_2.UpdateBoardDto, Object]),
    __metadata("design:returntype", Promise)
], BoardsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ description: 'Board deleted successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BoardsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/collaborators'),
    (0, swagger_1.ApiOperation)({ summary: 'Add collaborator to board' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Collaborator added successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], BoardsController.prototype, "addCollaborator", null);
exports.BoardsController = BoardsController = __decorate([
    (0, swagger_1.ApiTags)('boards'),
    (0, common_1.Controller)('boards'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __metadata("design:paramtypes", [boards_service_1.BoardsService])
], BoardsController);
//# sourceMappingURL=boards.controller.js.map