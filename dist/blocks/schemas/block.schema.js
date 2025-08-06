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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockSchema = exports.Block = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Block = class Block {
};
exports.Block = Block;
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['text', 'image', 'link'] }),
    __metadata("design:type", String)
], Block.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, maxlength: 2000 }),
    __metadata("design:type", String)
], Block.prototype, "content", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            x: { type: Number, required: true, min: 0 },
            y: { type: Number, required: true, min: 0 },
        },
        required: true,
    }),
    __metadata("design:type", Object)
], Block.prototype, "position", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Board', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Block.prototype, "boardId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Block.prototype, "createdBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Block.prototype, "lastEdited", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 200 }),
    __metadata("design:type", Number)
], Block.prototype, "width", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 150 }),
    __metadata("design:type", Number)
], Block.prototype, "height", void 0);
exports.Block = Block = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Block);
exports.BlockSchema = mongoose_1.SchemaFactory.createForClass(Block);
//# sourceMappingURL=block.schema.js.map