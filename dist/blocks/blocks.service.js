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
const boards_service_1 = require("../boards/boards.service");
let BlocksService = class BlocksService {
    constructor(blockModel, boardsService) {
        this.blockModel = blockModel;
        this.boardsService = boardsService;
    }
    async create(createBlockDto, userId) {
        const hasAccess = await this.boardsService.checkBoardAccess(createBlockDto.boardId, userId);
        if (!hasAccess) {
            throw new common_1.ForbiddenException('Access denied to board');
        }
        const block = new this.blockModel({
            ...createBlockDto,
            createdBy: userId,
            lastEdited: new Date(),
        });
        return block.save();
    }
    async update(id, updateBlockDto, userId) {
        const block = await this.blockModel.findById(id).exec();
        if (!block) {
            throw new common_1.NotFoundException('Block not found');
        }
        const hasAccess = await this.boardsService.checkBoardAccess(block.boardId.toString(), userId);
        if (!hasAccess) {
            throw new common_1.ForbiddenException('Access denied to board');
        }
        Object.assign(block, updateBlockDto);
        block.lastEdited = new Date();
        return block.save();
    }
    async remove(id, userId) {
        const block = await this.blockModel.findById(id).exec();
        if (!block) {
            throw new common_1.NotFoundException('Block not found');
        }
        const hasAccess = await this.boardsService.checkBoardAccess(block.boardId.toString(), userId);
        if (!hasAccess) {
            throw new common_1.ForbiddenException('Access denied to board');
        }
        await this.blockModel.findByIdAndDelete(id).exec();
    }
};
exports.BlocksService = BlocksService;
exports.BlocksService = BlocksService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(block_schema_1.Block.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        boards_service_1.BoardsService])
], BlocksService);
//# sourceMappingURL=blocks.service.js.map