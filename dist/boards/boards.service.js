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
exports.BoardsService = exports.UpdateBoardDto = exports.CreateBoardDto = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const board_schema_1 = require("./schemas/board.schema");
const block_schema_1 = require("../blocks/schemas/block.schema");
class CreateBoardDto {
}
exports.CreateBoardDto = CreateBoardDto;
class UpdateBoardDto {
}
exports.UpdateBoardDto = UpdateBoardDto;
let BoardsService = class BoardsService {
    constructor(boardModel, blockModel) {
        this.boardModel = boardModel;
        this.blockModel = blockModel;
    }
    async findAll(userId) {
        return this.boardModel
            .find({
            $or: [
                { owner: userId },
                { collaborators: userId }
            ]
        })
            .populate(['owner', 'collaborators'])
            .sort({ updatedAt: -1 });
    }
    async findOne(id, userId) {
        const board = await this.boardModel
            .findById(id)
            .populate(['owner', 'collaborators']);
        if (!board) {
            throw new common_1.NotFoundException('Board not found');
        }
        const hasAccess = board.owner._id.toString() === userId ||
            board.collaborators.some(collaborator => collaborator._id.toString() === userId) ||
            board.isPublic;
        if (!hasAccess) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return board;
    }
    async findBoardWithBlocks(id, userId) {
        const board = await this.boardModel
            .findById(id)
            .populate(['owner', 'collaborators'])
            .lean();
        if (!board) {
            throw new common_1.NotFoundException('Board not found');
        }
        const hasAccess = board.owner.toString() === userId ||
            board.collaborators.some(collaborator => collaborator.toString() === userId) ||
            board.isPublic;
        if (!hasAccess) {
            throw new common_1.ForbiddenException('Access denied');
        }
        const blocks = await this.blockModel
            .find({ boardId: new mongoose_2.Types.ObjectId(id) })
            .populate('createdBy')
            .sort({ createdAt: -1 })
            .lean();
        return {
            ...board,
            blocks: blocks
        };
    }
    async checkBoardAccess(boardId, userId) {
        try {
            const board = await this.boardModel
                .findById(boardId)
                .populate(['owner', 'collaborators']);
            if (!board) {
                return false;
            }
            const hasAccess = board.owner._id.toString() === userId ||
                board.collaborators.some(collaborator => collaborator._id.toString() === userId) ||
                board.isPublic;
            return hasAccess;
        }
        catch (error) {
            console.error('Error checking board access:', error);
            return false;
        }
    }
    async create(createBoardDto, userId) {
        const board = new this.boardModel({
            ...createBoardDto,
            owner: userId,
            collaborators: [],
            blocks: [],
        });
        await board.save();
        return board.populate(['owner', 'collaborators']);
    }
    async update(id, updateBoardDto, userId) {
        const board = await this.boardModel.findById(id);
        if (!board) {
            throw new common_1.NotFoundException('Board not found');
        }
        if (board.owner.toString() !== userId) {
            throw new common_1.ForbiddenException('Only board owner can update board');
        }
        Object.assign(board, updateBoardDto);
        await board.save();
        return board.populate(['owner', 'collaborators']);
    }
    async remove(id, userId) {
        const board = await this.boardModel.findById(id);
        if (!board) {
            throw new common_1.NotFoundException('Board not found');
        }
        if (board.owner.toString() !== userId) {
            throw new common_1.ForbiddenException('Only board owner can delete board');
        }
        await this.blockModel.deleteMany({ boardId: id });
        await this.boardModel.findByIdAndDelete(id);
    }
    async addCollaborator(id, email, userId) {
        const board = await this.boardModel.findById(id);
        if (!board) {
            throw new common_1.NotFoundException('Board not found');
        }
        if (board.owner.toString() !== userId) {
            throw new common_1.ForbiddenException('Only board owner can add collaborators');
        }
        return board.populate(['owner', 'collaborators']);
    }
};
exports.BoardsService = BoardsService;
exports.BoardsService = BoardsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(board_schema_1.Board.name)),
    __param(1, (0, mongoose_1.InjectModel)(block_schema_1.Block.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], BoardsService);
//# sourceMappingURL=boards.service.js.map