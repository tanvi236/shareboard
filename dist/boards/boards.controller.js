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
const create_board_dto_1 = require("./dto/create-board.dto");
const add_collaborator_dto_1 = require("./dto/add-collaborator.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const get_user_decorator_1 = require("../auth/decorators/get-user.decorator");
let BoardsController = class BoardsController {
    constructor(boardsService) {
        this.boardsService = boardsService;
    }
    create(createBoardDto, user) {
        return this.boardsService.create(createBoardDto, user._id.toString());
    }
    findUserBoards(user) {
        return this.boardsService.findUserBoards(user._id.toString());
    }
    findOne(id, user) {
        return this.boardsService.findOne(id, user._id.toString());
    }
    addCollaborator(id, addCollaboratorDto, user) {
        return this.boardsService.addCollaborator(id, addCollaboratorDto, user._id.toString());
    }
};
exports.BoardsController = BoardsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new board' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Board successfully created' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - validation failed' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_board_dto_1.CreateBoardDto, Object]),
    __metadata("design:returntype", void 0)
], BoardsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all boards for current user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns user boards' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BoardsController.prototype, "findUserBoards", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get specific board with blocks' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Board ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns board with blocks' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - no access to board' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Board not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BoardsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(':id/collaborators'),
    (0, swagger_1.ApiOperation)({ summary: 'Add collaborator to board' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Board ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Collaborator successfully added' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - only board owner can add collaborators' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Board or user not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, add_collaborator_dto_1.AddCollaboratorDto, Object]),
    __metadata("design:returntype", void 0)
], BoardsController.prototype, "addCollaborator", null);
exports.BoardsController = BoardsController = __decorate([
    (0, swagger_1.ApiTags)('boards'),
    (0, common_1.Controller)('boards'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __metadata("design:paramtypes", [boards_service_1.BoardsService])
], BoardsController);
//# sourceMappingURL=boards.controller.js.map