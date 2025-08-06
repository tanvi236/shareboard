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
const blocks_service_1 = require("./blocks.service");
const create_block_dto_1 = require("./dto/create-block.dto");
const update_block_dto_1 = require("./dto/update-block.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const get_user_decorator_1 = require("../auth/decorators/get-user.decorator");
let BlocksController = class BlocksController {
    constructor(blocksService) {
        this.blocksService = blocksService;
    }
    create(createBlockDto, user) {
        return this.blocksService.create(createBlockDto, user._id.toString());
    }
    update(id, updateBlockDto, user) {
        return this.blocksService.update(id, updateBlockDto, user._id.toString());
    }
    remove(id, user) {
        return this.blocksService.remove(id, user._id.toString());
    }
};
exports.BlocksController = BlocksController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_block_dto_1.CreateBlockDto, Object]),
    __metadata("design:returntype", void 0)
], BlocksController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_block_dto_1.UpdateBlockDto, Object]),
    __metadata("design:returntype", void 0)
], BlocksController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BlocksController.prototype, "remove", null);
exports.BlocksController = BlocksController = __decorate([
    (0, common_1.Controller)('blocks'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [blocks_service_1.BlocksService])
], BlocksController);
//# sourceMappingURL=blocks.controller.js.map