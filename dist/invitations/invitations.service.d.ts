import { Model } from 'mongoose';
import { Invitation, InvitationDocument } from './schemas/invitation.schema';
import { Board, BoardDocument } from '../boards/schemas/board.schema';
import { UserDocument } from '../users/schemas/user.schema';
import { EmailService } from '../email/email.service';
export declare class InvitationsService {
    private invitationModel;
    private boardModel;
    private userModel;
    private emailService;
    constructor(invitationModel: Model<InvitationDocument>, boardModel: Model<BoardDocument>, userModel: Model<UserDocument>, emailService: EmailService);
    createInvitation(boardId: string, email: string, inviterId: string): Promise<Invitation>;
    acceptInvitation(token: string, userId?: string): Promise<{
        board: Board;
        requiresRegistration: boolean;
    }>;
    getInvitationByToken(token: string): Promise<Invitation>;
    getUserInvitations(email: string): Promise<Invitation[]>;
    getBoardInvitations(boardId: string, userId: string): Promise<Invitation[]>;
}
