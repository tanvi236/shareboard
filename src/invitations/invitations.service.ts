import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, isValidObjectId } from 'mongoose';
import { Invitation, InvitationDocument } from './schemas/invitation.schema';
import { Board, BoardDocument } from '../boards/schemas/board.schema';
import { User, UserDocument } from '../users/schemas/user.schema';
import { EmailService } from '../email/email.service';
import { randomBytes } from 'crypto';

@Injectable()
export class InvitationsService {
  constructor(
    @InjectModel(Invitation.name) private invitationModel: Model<InvitationDocument>,
    @InjectModel(Board.name) private boardModel: Model<BoardDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private emailService: EmailService,
  ) {}

  async createInvitation(
    boardId: string,
    email: string,
    inviterId: string,
  ): Promise<Invitation> {
    
    // Check if board exists and user has permission
    if (!isValidObjectId(boardId)) {
      throw new BadRequestException('Invalid board ID format');
    }
    
    const board = await this.boardModel.findById(new Types.ObjectId(boardId));
    console.log("Board found:", board);
    
    if (!board) {
      throw new NotFoundException('Board not found');
    }
    
    if (board.owner.toString() !== inviterId) {
      throw new ForbiddenException('Only board owner can send invitations');
    }

    // Check if user is already a collaborator
    const existingCollaborator = await this.userModel.findOne({ email });
    if (existingCollaborator && 
        board.collaborators.some(collab => collab.toString() === existingCollaborator._id.toString())) {
      throw new BadRequestException('User is already a collaborator');
    }

    // Check if there's already a pending invitation
    const existingInvitation = await this.invitationModel.findOne({
      boardId: new Types.ObjectId(boardId),
      email,
      status: 'pending',
    });

    if (existingInvitation) {
      throw new BadRequestException('Invitation already sent to this email');
    }

    // Generate invitation token
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Expires in 7 days

    // Create invitation
    const invitation = new this.invitationModel({
      boardId: new Types.ObjectId(boardId),
      invitedBy: new Types.ObjectId(inviterId),
      email,
      token,
      expiresAt,
      invitedUser: existingCollaborator?._id || null,
    });

    await invitation.save();

    // Send invitation email (commented out for testing)
    const inviter = await this.userModel.findById(inviterId);
    // await this.emailService.sendInvitation(
    //   email,
    //   board.name,
    //   inviter.name,
    //   token,
    // );

    return invitation.populate(['boardId', 'invitedBy']);
  }

  async acceptInvitation(token: string, userId?: string): Promise<{ board: Board; requiresRegistration: boolean }> {
    const invitation = await this.invitationModel
      .findOne({ token, status: 'pending' })
      .populate(['boardId', 'invitedBy']);

    if (!invitation) {
      throw new NotFoundException('Invitation not found or already used');
    }

    if (invitation.expiresAt < new Date()) {
      invitation.status = 'expired';
      await invitation.save();
      throw new BadRequestException('Invitation has expired');
    }

    // Check if user exists
    let user = await this.userModel.findOne({ email: invitation.email });
    let requiresRegistration = false;

    if (!user && !userId) {
      requiresRegistration = true;
      return { 
        board: invitation.boardId as any, 
        requiresRegistration 
      };
    }

    if (userId) {
      user = await this.userModel.findById(userId);
      if (!user || user.email !== invitation.email) {
        throw new ForbiddenException('Invalid user for this invitation');
      }
    }

    // Add user as collaborator to the board
    const board = await this.boardModel.findById(invitation.boardId);
    if (!board.collaborators.includes(user._id)) {
      board.collaborators.push(user._id);
      await board.save();
    }

    // Update invitation status
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

  async getInvitationByToken(token: string): Promise<Invitation> {
    const invitation = await this.invitationModel
      .findOne({ token })
      .populate(['boardId', 'invitedBy']);

    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }

    return invitation;
  }

  async getUserInvitations(email: string): Promise<Invitation[]> {
    return this.invitationModel
      .find({ email, status: 'pending' })
      .populate(['boardId', 'invitedBy'])
      .sort({ createdAt: -1 });
  }

  async getBoardInvitations(boardId: string, userId: string): Promise<Invitation[]> {
    const board = await this.boardModel.findById(boardId);
    if (!board) {
      throw new NotFoundException('Board not found');
    }

    if (board.owner.toString() !== userId) {
      throw new ForbiddenException('Only board owner can view invitations');
    }

    return this.invitationModel
      .find({ boardId: new Types.ObjectId(boardId) })
      .populate(['invitedBy', 'invitedUser'])
      .sort({ createdAt: -1 });
  }
}
