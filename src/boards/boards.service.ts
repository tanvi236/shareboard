import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Board, BoardDocument } from './schemas/board.schema';
import { Block, BlockDocument } from '../blocks/schemas/block.schema';
import { UsersService } from '../users/users.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { AddCollaboratorDto } from './dto/add-collaborator.dto';

@Injectable()
export class BoardsService {
  constructor(
    @InjectModel(Board.name) private boardModel: Model<BoardDocument>,
    @InjectModel(Block.name) private blockModel: Model<BlockDocument>,
    private usersService: UsersService,
  ) {}

  async create(createBoardDto: CreateBoardDto, userId: string): Promise<BoardDocument> {
    const board = new this.boardModel({
      ...createBoardDto,
      owner: userId,
    });

    const savedBoard = await board.save();
    await this.usersService.addBoardToUser(userId, savedBoard._id.toString());
    
    return savedBoard;
  }

  async findUserBoards(userId: string): Promise<BoardDocument[]> {
    return this.boardModel
      .find({
        $or: [
          { owner: userId },
          { collaborators: userId },
        ],
      })
      .populate('owner', 'name email')
      .populate('collaborators', 'name email')
      .exec();
  }

  async findOne(id: string, userId: string): Promise<BoardDocument & { blocks: BlockDocument[] }> {
    const board = await this.boardModel
      .findById(id)
      .populate('owner', 'name email')
      .populate('collaborators', 'name email')
      .exec();

    if (!board) {
      throw new NotFoundException('Board not found');
    }

    // Check access
    const hasAccess = this.checkAccess(board, userId);
    if (!hasAccess) {
      throw new ForbiddenException('Access denied');
    }

    const blocks = await this.blockModel
      .find({ boardId: board._id })
      .populate('createdBy', 'name')
      .exec();

    return { ...board.toObject(), blocks } as BoardDocument & { blocks: BlockDocument[] };
  }

  async addCollaborator(boardId: string, addCollaboratorDto: AddCollaboratorDto, userId: string): Promise<void> {
    const board = await this.boardModel.findById(boardId).exec();
    if (!board) {
      throw new NotFoundException('Board not found');
    }

    if (board.owner.toString() !== userId) {
      throw new ForbiddenException('Only board owner can add collaborators');
    }

    const collaborator = await this.usersService.findOne(addCollaboratorDto.email);
    if (!collaborator) {
      throw new NotFoundException('User not found');
    }

    if (board.collaborators.some(id => id.toString() === collaborator._id.toString())) {
      throw new ForbiddenException('User is already a collaborator');
    }

    board.collaborators.push(collaborator._id);
    await board.save();
  }

  checkAccess(board: BoardDocument, userId: string): boolean {
    return (
      board.owner.toString() === userId ||
      board.collaborators.some(id => id.toString() === userId) ||
      board.isPublic
    );
  }

  async checkBoardAccess(boardId: string, userId: string): Promise<boolean> {
    const board = await this.boardModel.findById(boardId).exec();
    if (!board) return false;
    return this.checkAccess(board, userId);
  }
}
