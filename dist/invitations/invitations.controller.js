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
exports.InvitationsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const invitations_service_1 = require("./invitations.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const get_user_decorator_1 = require("../auth/decorators/get-user.decorator");
const send_invitation_dto_1 = require("./dto/send-invitation.dto");
const get_user_invitations_dto_1 = require("./dto/get-user-invitations.dto");
let InvitationsController = class InvitationsController {
    constructor(invitationsService) {
        this.invitationsService = invitationsService;
    }
    async sendInvitation({ boardId, email }, user) {
        try {
            const invitation = await this.invitationsService.createInvitation(boardId, email, user._id.toString());
            return {
                success: true,
                message: 'Invitation sent successfully',
                data: invitation,
            };
        }
        catch (error) {
            console.error('Error sending invitation:', error, error?.message, error?.stack);
            throw error;
        }
    }
    async getInvitationByToken(token) {
        try {
            const invitation = await this.invitationsService.getInvitationByToken(token);
            return {
                success: true,
                data: invitation,
            };
        }
        catch (error) {
            console.error('Error getting invitation by token:', error);
            throw error;
        }
    }
    async acceptInvitation(token, req) {
        try {
            const userId = req.user?._id?.toString();
            const result = await this.invitationsService.acceptInvitation(token, userId);
            return {
                success: true,
                message: result.requiresRegistration
                    ? 'Registration required to accept invitation'
                    : 'Invitation accepted successfully',
                data: result,
            };
        }
        catch (error) {
            console.error('Error accepting invitation:', error);
            throw error;
        }
    }
    async getUserInvitations(getUserInvitationsDto, user) {
        try {
            const invitations = await this.invitationsService.getUserInvitations(getUserInvitationsDto.email);
            return {
                success: true,
                data: invitations,
            };
        }
        catch (error) {
            console.error('Error getting user invitations:', error);
            throw error;
        }
    }
    async getBoardInvitations(boardId, user) {
        try {
            const invitations = await this.invitationsService.getBoardInvitations(boardId, user._id.toString());
            return {
                success: true,
                data: invitations,
            };
        }
        catch (error) {
            console.error('Error getting board invitations:', error);
            throw error;
        }
    }
    async resendInvitation(invitationId, user) {
        try {
            return {
                success: true,
                message: 'Invitation resent successfully',
            };
        }
        catch (error) {
            console.error('Error resending invitation:', error);
            throw error;
        }
    }
    async cancelInvitation(invitationId, user) {
        try {
            return {
                success: true,
                message: 'Invitation cancelled successfully',
            };
        }
        catch (error) {
            console.error('Error cancelling invitation:', error);
            throw error;
        }
    }
};
exports.InvitationsController = InvitationsController;
__decorate([
    (0, common_1.Post)('send'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Send board invitation' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Invitation sent successfully' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [send_invitation_dto_1.SendInvitationDto, Object]),
    __metadata("design:returntype", Promise)
], InvitationsController.prototype, "sendInvitation", null);
__decorate([
    (0, common_1.Get)('token/:token'),
    (0, swagger_1.ApiOperation)({ summary: 'Get invitation details by token' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Invitation details retrieved' }),
    __param(0, (0, common_1.Param)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InvitationsController.prototype, "getInvitationByToken", null);
__decorate([
    (0, common_1.Post)('accept/:token'),
    (0, swagger_1.ApiOperation)({ summary: 'Accept invitation' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Invitation accepted successfully' }),
    __param(0, (0, common_1.Param)('token')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], InvitationsController.prototype, "acceptInvitation", null);
__decorate([
    (0, common_1.Post)('user/invitations'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user invitations by email' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User invitations retrieved' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_user_invitations_dto_1.GetUserInvitationsDto, Object]),
    __metadata("design:returntype", Promise)
], InvitationsController.prototype, "getUserInvitations", null);
__decorate([
    (0, common_1.Get)('board/:boardId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Get board invitations' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Board invitations retrieved' }),
    __param(0, (0, common_1.Param)('boardId')),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], InvitationsController.prototype, "getBoardInvitations", null);
__decorate([
    (0, common_1.Post)('resend/:invitationId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Resend invitation' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Invitation resent successfully' }),
    __param(0, (0, common_1.Param)('invitationId')),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], InvitationsController.prototype, "resendInvitation", null);
__decorate([
    (0, common_1.Post)('cancel/:invitationId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel invitation' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Invitation cancelled successfully' }),
    __param(0, (0, common_1.Param)('invitationId')),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], InvitationsController.prototype, "cancelInvitation", null);
exports.InvitationsController = InvitationsController = __decorate([
    (0, swagger_1.ApiTags)('invitations'),
    (0, common_1.Controller)('invitations'),
    __metadata("design:paramtypes", [invitations_service_1.InvitationsService])
], InvitationsController);
//# sourceMappingURL=invitations.controller.js.map