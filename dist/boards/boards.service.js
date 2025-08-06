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
exports.BoardsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const board_schema_1 = require("./schemas/board.schema");
const block_schema_1 = require("../blocks/schemas/block.schema");
const users_service_1 = require("../users/users.service");
let BoardsService = class BoardsService {
    constructor(boardModel, blockModel, usersService) {
        this.boardModel = boardModel;
        this.blockModel = blockModel;
        this.usersService = usersService;
    }
    async create(createBoardDto, userId) {
        const board = new this.boardModel({
            ...createBoardDto,
            owner: userId,
        });
        const savedBoard = await board.save();
        await this.usersService.addBoardToUser(userId, savedBoard._id.toString());
        return savedBoard;
    }
    async findUserBoards(userId) {
        return this.boardModel
            .find({
            $or: [
                { owner: userId },
                { collaborators: userId },
            ],
        })
            .populate('owner', 'name email')
            .populate('collaborators', 'name email')
            .exec();
    }
    async findOne(id, userId) {
        const board = await this.boardModel
            .findById(id)
            .populate('owner', 'name email')
            .populate('collaborators', 'name email')
            .exec();
        if (!board) {
            throw new common_1.NotFoundException('Board not found');
        }
        const hasAccess = this.checkAccess(board, userId);
        if (!hasAccess) {
            throw new common_1.ForbiddenException('Access denied');
        }
        const blocks = await this.blockModel
            .find({ boardId: board._id })
            .populate('createdBy', 'name')
            .exec();
        return { ...board.toObject(), blocks };
    }
    async addCollaborator(boardId, addCollaboratorDto, userId) {
        const board = await this.boardModel.findById(boardId).exec();
        if (!board) {
            throw new common_1.NotFoundException('Board not found');
        }
        if (board.owner.toString() !== userId) {
            throw new common_1.ForbiddenException('Only board owner can add collaborators');
        }
        const collaborator = await this.usersService.findOne(addCollaboratorDto.email);
        if (!collaborator) {
            throw new common_1.NotFoundException('User not found');
        }
        if (board.collaborators.some(id => id.toString() === collaborator._id.toString())) {
            throw new common_1.ForbiddenException('User is already a collaborator');
        }
        board.collaborators.push(collaborator._id);
        await board.save();
    }
    checkAccess(board, userId) {
        return (board.owner.toString() === userId ||
            board.collaborators.some(id => id.toString() === userId) ||
            board.isPublic);
    }
    async checkBoardAccess(boardId, userId) {
        const board = await this.boardModel.findById(boardId).exec();
        if (!board)
            return false;
        return this.checkAccess(board, userId);
    }
};
exports.BoardsService = BoardsService;
exports.BoardsService = BoardsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(board_schema_1.Board.name)),
    __param(1, (0, mongoose_1.InjectModel)(block_schema_1.Block.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        users_service_1.UsersService])
], BoardsService);
//# sourceMappingURL=boards.service.js.map