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
exports.BlocksService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const block_schema_1 = require("./schemas/block.schema");
const board_schema_1 = require("../boards/schemas/board.schema");
let BlocksService = class BlocksService {
    constructor(blockModel, boardModel) {
        this.blockModel = blockModel;
        this.boardModel = boardModel;
    }
    async create(createBlockDto, userId) {
        try {
            console.log('Creating block with data:', createBlockDto, 'User:', userId);
            if (!(0, mongoose_2.isValidObjectId)(createBlockDto.boardId)) {
                throw new common_1.BadRequestException('Invalid board ID format');
            }
            const board = await this.boardModel.findById(createBlockDto.boardId);
            if (!board) {
                throw new common_1.NotFoundException('Board not found');
            }
            const hasAccess = board.owner.toString() === userId ||
                board.collaborators.some(collaborator => collaborator.toString() === userId);
            if (!hasAccess) {
                throw new common_1.ForbiddenException('Access denied');
            }
            const blockData = {
                ...createBlockDto,
                boardId: new mongoose_2.Types.ObjectId(createBlockDto.boardId),
                createdBy: new mongoose_2.Types.ObjectId(userId),
                lastEdited: new Date(),
            };
            const createdBlock = new this.blockModel(blockData);
            const savedBlock = await createdBlock.save();
            console.log('Block saved successfully:', savedBlock._id);
            return savedBlock.populate(['createdBy']);
        }
        catch (error) {
            console.error('Error creating block:', error);
            throw error;
        }
    }
    async update(id, updateBlockDto, userId) {
        try {
            console.log('Updating block:', id, 'with data:', updateBlockDto, 'User:', userId);
            if (!(0, mongoose_2.isValidObjectId)(id)) {
                throw new common_1.BadRequestException('Invalid block ID format');
            }
            const block = await this.blockModel.findById(id);
            if (!block) {
                throw new common_1.NotFoundException('Block not found');
            }
            console.log('Found block:', block._id, 'BoardId:', block.boardId);
            const board = await this.boardModel.findById(block.boardId);
            if (!board) {
                throw new common_1.NotFoundException('Associated board not found');
            }
            const hasAccess = board.owner.toString() === userId ||
                board.collaborators.some(collaborator => collaborator.toString() === userId);
            if (!hasAccess) {
                throw new common_1.ForbiddenException('Access denied');
            }
            if (Object.keys(updateBlockDto).length === 0) {
                throw new common_1.BadRequestException('No update data provided');
            }
            const cleanUpdateData = { ...updateBlockDto };
            if (cleanUpdateData.position && cleanUpdateData.position.dropEffect) {
                const { dropEffect, ...cleanPosition } = cleanUpdateData.position;
                cleanUpdateData.position = cleanPosition;
            }
            const updateData = {
                ...cleanUpdateData,
                lastEdited: new Date(),
            };
            console.log('Updating with cleaned data:', updateData);
            const updatedBlock = await this.blockModel.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).populate(['createdBy']);
            if (!updatedBlock) {
                throw new common_1.NotFoundException('Block not found after update');
            }
            console.log('Block updated successfully:', updatedBlock._id);
            return updatedBlock;
        }
        catch (error) {
            console.error('Error updating block:', error);
            throw error;
        }
    }
    async remove(id, userId) {
        try {
            console.log('Deleting block:', id, 'User:', userId);
            if (!(0, mongoose_2.isValidObjectId)(id)) {
                throw new common_1.BadRequestException('Invalid block ID format');
            }
            const block = await this.blockModel.findById(id);
            if (!block) {
                throw new common_1.NotFoundException('Block not found');
            }
            const board = await this.boardModel.findById(block.boardId);
            if (!board) {
                throw new common_1.NotFoundException('Associated board not found');
            }
            const hasAccess = board.owner.toString() === userId ||
                board.collaborators.some(collaborator => collaborator.toString() === userId);
            if (!hasAccess) {
                throw new common_1.ForbiddenException('Access denied');
            }
            await this.blockModel.findByIdAndDelete(id);
            console.log('Block deleted successfully:', id);
        }
        catch (error) {
            console.error('Error deleting block:', error);
            throw error;
        }
    }
    async findByBoard(boardId, userId) {
        try {
            console.log('Finding blocks for board:', boardId, 'User:', userId);
            if (!(0, mongoose_2.isValidObjectId)(boardId)) {
                throw new common_1.BadRequestException('Invalid board ID format');
            }
            const board = await this.boardModel.findById(boardId);
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
                .find({ boardId: new mongoose_2.Types.ObjectId(boardId) })
                .populate(['createdBy'])
                .sort({ createdAt: -1 });
            console.log(`Found ${blocks.length} blocks for board ${boardId}`);
            return blocks;
        }
        catch (error) {
            console.error('Error fetching blocks:', error);
            throw error;
        }
    }
};
exports.BlocksService = BlocksService;
exports.BlocksService = BlocksService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(block_schema_1.Block.name)),
    __param(1, (0, mongoose_1.InjectModel)(board_schema_1.Board.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], BlocksService);
//# sourceMappingURL=blocks.service.js.map