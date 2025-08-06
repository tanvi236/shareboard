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
exports.InvitationsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const invitation_schema_1 = require("./schemas/invitation.schema");
const board_schema_1 = require("../boards/schemas/board.schema");
const user_schema_1 = require("../users/schemas/user.schema");
const email_service_1 = require("../email/email.service");
const crypto_1 = require("crypto");
let InvitationsService = class InvitationsService {
    constructor(invitationModel, boardModel, userModel, emailService) {
        this.invitationModel = invitationModel;
        this.boardModel = boardModel;
        this.userModel = userModel;
        this.emailService = emailService;
    }
    async createInvitation(boardId, email, inviterId) {
        console.log("createInvitation called with boardId:", boardId, "email:", email, "inviterId:", inviterId);
        console.log('typeof boardId:', typeof boardId, 'length:', boardId.length, 'value:', boardId);
        if (!(0, mongoose_2.isValidObjectId)(boardId)) {
            throw new common_1.BadRequestException('Invalid board ID format');
        }
        const board = await this.boardModel.findById(new mongoose_2.Types.ObjectId(boardId));
        console.log("Board found:", board);
        if (!board) {
            throw new common_1.NotFoundException('Board not found');
        }
        if (board.owner.toString() !== inviterId) {
            throw new common_1.ForbiddenException('Only board owner can send invitations');
        }
        const existingCollaborator = await this.userModel.findOne({ email });
        if (existingCollaborator &&
            board.collaborators.some(collab => collab.toString() === existingCollaborator._id.toString())) {
            throw new common_1.BadRequestException('User is already a collaborator');
        }
        const existingInvitation = await this.invitationModel.findOne({
            boardId: new mongoose_2.Types.ObjectId(boardId),
            email,
            status: 'pending',
        });
        if (existingInvitation) {
            throw new common_1.BadRequestException('Invitation already sent to this email');
        }
        const token = (0, crypto_1.randomBytes)(32).toString('hex');
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        const invitation = new this.invitationModel({
            boardId: new mongoose_2.Types.ObjectId(boardId),
            invitedBy: new mongoose_2.Types.ObjectId(inviterId),
            email,
            token,
            expiresAt,
            invitedUser: existingCollaborator?._id || null,
        });
        await invitation.save();
        const inviter = await this.userModel.findById(inviterId);
        return invitation.populate(['boardId', 'invitedBy']);
    }
    async acceptInvitation(token, userId) {
        const invitation = await this.invitationModel
            .findOne({ token, status: 'pending' })
            .populate(['boardId', 'invitedBy']);
        if (!invitation) {
            throw new common_1.NotFoundException('Invitation not found or already used');
        }
        if (invitation.expiresAt < new Date()) {
            invitation.status = 'expired';
            await invitation.save();
            throw new common_1.BadRequestException('Invitation has expired');
        }
        let user = await this.userModel.findOne({ email: invitation.email });
        let requiresRegistration = false;
        if (!user && !userId) {
            requiresRegistration = true;
            return {
                board: invitation.boardId,
                requiresRegistration
            };
        }
        if (userId) {
            user = await this.userModel.findById(userId);
            if (!user || user.email !== invitation.email) {
                throw new common_1.ForbiddenException('Invalid user for this invitation');
            }
        }
        const board = await this.boardModel.findById(invitation.boardId);
        if (!board.collaborators.includes(user._id)) {
            board.collaborators.push(user._id);
            await board.save();
        }
        invitation.status = 'accepted';
        invitation.acceptedAt = new Date();
        invitation.invitedUser = user._id;
        await invitation.save();
        const populatedBoard = await this.boardModel
            .findById(invitation.boardId)
            .populate(['owner', 'collaborators']);
        return {
            board: populatedBoard,
            requiresRegistration: false
        };
    }
    async getInvitationByToken(token) {
        const invitation = await this.invitationModel
            .findOne({ token })
            .populate(['boardId', 'invitedBy']);
        if (!invitation) {
            throw new common_1.NotFoundException('Invitation not found');
        }
        return invitation;
    }
    async getUserInvitations(email) {
        return this.invitationModel
            .find({ email, status: 'pending' })
            .populate(['boardId', 'invitedBy'])
            .sort({ createdAt: -1 });
    }
    async getBoardInvitations(boardId, userId) {
        const board = await this.boardModel.findById(boardId);
        if (!board) {
            throw new common_1.NotFoundException('Board not found');
        }
        if (board.owner.toString() !== userId) {
            throw new common_1.ForbiddenException('Only board owner can view invitations');
        }
        return this.invitationModel
            .find({ boardId: new mongoose_2.Types.ObjectId(boardId) })
            .populate(['invitedBy', 'invitedUser'])
            .sort({ createdAt: -1 });
    }
};
exports.InvitationsService = InvitationsService;
exports.InvitationsService = InvitationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(invitation_schema_1.Invitation.name)),
    __param(1, (0, mongoose_1.InjectModel)(board_schema_1.Board.name)),
    __param(2, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        email_service_1.EmailService])
], InvitationsService);
//# sourceMappingURL=invitations.service.js.map