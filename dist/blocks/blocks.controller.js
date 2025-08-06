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
exports.BlocksController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const blocks_service_1 = require("./blocks.service");
const create_block_dto_1 = require("./dto/create-block.dto");
const update_block_dto_1 = require("./dto/update-block.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const get_user_decorator_1 = require("../auth/decorators/get-user.decorator");
let BlocksController = class BlocksController {
    constructor(blocksService) {
        this.blocksService = blocksService;
    }
    async create(createBlockDto, user) {
        try {
            const block = await this.blocksService.create(createBlockDto, user._id.toString());
            return {
                success: true,
                message: 'Block created successfully',
                data: block,
            };
        }
        catch (error) {
            console.error('Error in create block controller:', error);
            throw error;
        }
    }
    async findByBoard(boardId, user) {
        try {
            const blocks = await this.blocksService.findByBoard(boardId, user._id.toString());
            return {
                success: true,
                data: blocks,
            };
        }
        catch (error) {
            console.error('Error in findByBoard controller:', error);
            throw error;
        }
    }
    async update(id, updateBlockDto, user) {
        try {
            console.log('=== PATCH /blocks/:id DEBUG ===');
            console.log('Block ID:', id);
            console.log('Raw Body:', updateBlockDto);
            console.log('User ID:', user._id.toString());
            console.log('Body keys:', Object.keys(updateBlockDto));
            console.log('Body values:', Object.values(updateBlockDto));
            console.log('================================');
            const block = await this.blocksService.update(id, updateBlockDto, user._id.toString());
            return {
                success: true,
                message: 'Block updated successfully',
                data: block,
            };
        }
        catch (error) {
            console.error('Error in update block controller:', error);
            console.error('Error name:', error.name);
            console.error('Error message:', error.message);
            throw error;
        }
    }
    async remove(id, user) {
        try {
            await this.blocksService.remove(id, user._id.toString());
            return {
                success: true,
                message: 'Block deleted successfully',
            };
        }
        catch (error) {
            console.error('Error in remove block controller:', error);
            throw error;
        }
    }
};
exports.BlocksController = BlocksController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new block' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Block created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Board not found' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_block_dto_1.CreateBlockDto, Object]),
    __metadata("design:returntype", Promise)
], BlocksController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('board/:boardId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all blocks for a board' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Blocks retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Board not found' }),
    __param(0, (0, common_1.Param)('boardId')),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BlocksController.prototype, "findByBoard", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a block' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Block updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Block not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_block_dto_1.UpdateBlockDto, Object]),
    __metadata("design:returntype", Promise)
], BlocksController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a block' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Block deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Block not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BlocksController.prototype, "remove", null);
exports.BlocksController = BlocksController = __decorate([
    (0, swagger_1.ApiTags)('blocks'),
    (0, common_1.Controller)('blocks'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __metadata("design:paramtypes", [blocks_service_1.BlocksService])
], BlocksController);
//# sourceMappingURL=blocks.controller.js.map