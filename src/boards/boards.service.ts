import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Board, BoardDocument } from './schemas/board.schema';
import { User, UserDocument } from '../users/schemas/user.schema';

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
  ) {}

  // Updated to include boards where user is collaborator
  async findAll(userId: string): Promise<Board[]> {
    return this.boardModel
      .find({
        $or: [
          { owner: userId },           // Boards owned by user
          { collaborators: userId }    // Boards where user is a collaborator
        ]
      })
      .populate(['owner', 'collaborators'])
      .sort({ updatedAt: -1 });
  }

  async findOne(id: string, userId: string): Promise<Board> {
    const board = await this.boardModel
      .findById(id)
      .populate(['owner', 'collaborators']);

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
