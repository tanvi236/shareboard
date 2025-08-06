import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Board, BoardDocument } from './schemas/board.schema';
import { Block, BlockDocument } from '../blocks/schemas/block.schema';
import { User, UserDocument } from '../users/schemas/user.schema';
import { BoardWithPopulatedBlocks } from './types/board.types';

export class CreateBoardDto {
  name: string;
  isPublic?: boolean;
}

export class UpdateBoardDto {
  name?: string;
  isPublic?: boolean;
}

@Injectable()
export class BoardsService {
  constructor(
    @InjectModel(Board.name) private boardModel: Model<BoardDocument>,
    @InjectModel(Block.name) private blockModel: Model<BlockDocument>,
  ) {}

  // Updated to include boards where user is collaborator AND populate blocks
  async findAll(userId: string): Promise<Board[]> {
    return this.boardModel
      .find({
        $or: [
          { owner: userId },           // Boards owned by user
          { collaborators: new Types.ObjectId(userId) }    // Boards where user is a collaborator
        ]
      })
      .populate(['owner', 'collaborators'])  // Don't populate blocks here for performance
      .sort({ updatedAt: -1 });
  }

  async findOne(id: string, userId: string): Promise<Board> {
    const board = await this.boardModel
      .findById(id)
      .populate(['owner', 'collaborators']);  // Don't populate blocks here

    if (!board) {
      throw new NotFoundException('Board not found');
    }

    // Check if user has access (owner or collaborator)
    const hasAccess = 
      board.owner._id.toString() === userId ||
      board.collaborators.some(collaborator => collaborator._id.toString() === userId) ||
      board.isPublic;

    if (!hasAccess) {
      throw new ForbiddenException('Access denied');
    }

    return board;
  }

  // Updated method to get board with all blocks - proper typing
  async findBoardWithBlocks(id: string, userId: string): Promise<BoardWithPopulatedBlocks> {
    const board = await this.boardModel
      .findById(id)
      .populate(['owner', 'collaborators'])
      .lean();

    if (!board) {
      throw new NotFoundException('Board not found');
    }
    // Check if user has access
    const hasAccess = 
      board.owner._id.toString() === userId ||
      (Array.isArray(board.collaborators) &&
        board.collaborators.some(
          (collaborator: any) =>
            (collaborator._id ? collaborator._id.toString() : collaborator.toString()) === userId
        )
      );
      // board.isPublic;

    if (!hasAccess) {
      throw new ForbiddenException('Access denied');
    }

    // Fetch all blocks for this board
    const blocks = await this.blockModel
      .find({ boardId: new Types.ObjectId(id) })
      .populate('createdBy')
      .sort({ createdAt: -1 })
      .lean();

    // Return properly typed object
    return {
      ...board,
      blocks: blocks as Block[]
    } as BoardWithPopulatedBlocks;
  }

  // Add the missing checkBoardAccess method for WebSocket gateway
  async checkBoardAccess(boardId: string, userId: string): Promise<boolean> {
    try {
      const board = await this.boardModel
        .findById(boardId)
        .populate(['owner', 'collaborators']);

      if (!board) {
        return false;
      }

      // Check if user has access (owner, collaborator, or public board)
      const hasAccess = 
        board.owner._id.toString() === userId ||
        board.collaborators.some(collaborator => collaborator._id.toString() === userId) ||
        board.isPublic;

      return hasAccess;
    } catch (error) {
      console.error('Error checking board access:', error);
      return false;
    }
  }

  async create(createBoardDto: CreateBoardDto, userId: string): Promise<Board> {
    const board = new this.boardModel({
      ...createBoardDto,
      owner: userId,
      collaborators: [],
      blocks: [],
    });

    await board.save();
    return board.populate(['owner', 'collaborators']);
  }

  async update(id: string, updateBoardDto: UpdateBoardDto, userId: string): Promise<Board> {
    const board = await this.boardModel.findById(id);

    if (!board) {
      throw new NotFoundException('Board not found');
    }

    if (board.owner.toString() !== userId) {
      throw new ForbiddenException('Only board owner can update board');
    }

    Object.assign(board, updateBoardDto);
    await board.save();

    return board.populate(['owner', 'collaborators']);
  }

  async remove(id: string, userId: string): Promise<void> {
    const board = await this.boardModel.findById(id);

    if (!board) {
      throw new NotFoundException('Board not found');
    }

    if (board.owner.toString() !== userId) {
      throw new ForbiddenException('Only board owner can delete board');
    }

    // Also delete all blocks associated with this board
    await this.blockModel.deleteMany({ boardId: id });
    await this.boardModel.findByIdAndDelete(id);
  }

  async addCollaborator(id: string, email: string, userId: string): Promise<Board> {
    const board = await this.boardModel.findById(id);

    if (!board) {
      throw new NotFoundException('Board not found');
    }

    if (board.owner.toString() !== userId) {
      throw new ForbiddenException('Only board owner can add collaborators');
    }

    // Implementation for adding collaborator would go here
    
    return board.populate(['owner', 'collaborators']);
  }
}
