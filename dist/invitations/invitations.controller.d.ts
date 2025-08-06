import { InvitationsService } from './invitations.service';
import { UserDocument } from '../users/schemas/user.schema';
declare class SendInvitationDto {
    boardId: string;
    email: string;
}
declare class GetUserInvitationsDto {
    email: string;
}
export declare class InvitationsController {
    private readonly invitationsService;
    constructor(invitationsService: InvitationsService);
    sendInvitation({ boardId, email }: SendInvitationDto, user: UserDocument): Promise<{
        success: boolean;
        message: string;
        data: import("./schemas/invitation.schema").Invitation;
    }>;
    getUserInvitations(getUserInvitationsDto: GetUserInvitationsDto, user: UserDocument): Promise<{
        success: boolean;
        data: import("./schemas/invitation.schema").Invitation[];
    }>;
    getInvitationByToken(token: string): Promise<{
        success: boolean;
        data: import("./schemas/invitation.schema").Invitation;
    }>;
    acceptInvitation(token: string, req: any): Promise<{
        success: boolean;
        message: string;
        data: {
            board: import("../boards/schemas/board.schema").Board;
            requiresRegistration: boolean;
        };
    }>;
    getBoardInvitations(boardId: string, user: UserDocument): Promise<{
        success: boolean;
        data: import("./schemas/invitation.schema").Invitation[];
    }>;
    resendInvitation(invitationId: string, user: UserDocument): Promise<{
        success: boolean;
        message: string;
    }>;
    cancelInvitation(invitationId: string, user: UserDocument): Promise<{
        success: boolean;
        message: string;
    }>;
}
export {};
