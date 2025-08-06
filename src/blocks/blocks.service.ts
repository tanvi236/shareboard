import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Block, BlockDocument } from './schemas/block.schema';
import { Board, BoardDocument } from '../boards/schemas/board.schema';
import { CreateBlockDto } from './dto/create-block.dto';
import { UpdateBlockDto } from './dto/update-block.dto';

@Injectable()
export class BlocksService {
  constructor(
    @InjectModel(Block.name) private blockModel: Model<BlockDocument>,
    @InjectModel(Board.name) private boardModel: Model<BoardDocument>,
  ) {}

  async create(createBlockDto: CreateBlockDto, userId: string): Promise<Block> {
    try {
      // Verify board exists and user has access
      const board = await this.boardModel.findById(createBlockDto.boardId);
      if (!board) {
        throw new NotFoundException('Board not found');
      }

      // Check if user has access to the board
      const hasAccess = board.owner.toString() === userId || 
                       board.collaborators.some(collaborator => collaborator.toString() === userId);
      
      if (!hasAccess) {
        throw new ForbiddenException('Access denied');
      }

      // Create the block with proper data
      const blockData = {
        ...createBlockDto,
        boardId: new Types.ObjectId(createBlockDto.boardId),
        createdBy: new Types.ObjectId(userId),
        lastEdited: new Date(),
      };

      const createdBlock = new this.blockModel(blockData);
      const savedBlock = await createdBlock.save();

      console.log('Block saved successfully:', savedBlock); // Debug log

      return savedBlock.populate(['createdBy']);
    } catch (error) {
      console.error('Error creating block:', error); // Debug log
      throw error;
    }
  }

  async update(id: string, updateBlockDto: UpdateBlockDto, userId: string): Promise<Block> {
    try {
      const block = await this.blockModel.findById(id);
      if (!block) {
        throw new NotFoundException('Block not found');
      }

      // Verify board access
      const board = await this.boardModel.findById(block.boardId);
      const hasAccess = board.owner.toString() === userId || 
                       board.collaborators.some(collaborator => collaborator.toString() === userId);
      
      if (!hasAccess) {
        throw new ForbiddenException('Access denied');
      }

      // Update with timestamp
      const updateData = {
        ...updateBlockDto,
        lastEdited: new Date(),
      };

      const updatedBlock = await this.blockModel.findByIdAndUpdate(
        id, 
        updateData, 
        { new: true }
      ).populate(['createdBy']);

      console.log('Block updated successfully:', updatedBlock); // Debug log

      return updatedBlock;
    } catch (error) {
      console.error('Error updating block:', error); // Debug log
      throw error;
    }
  }

  async remove(id: string, userId: string): Promise<void> {
    try {
      const block = await this.blockModel.findById(id);
      if (!block) {
        throw new NotFoundException('Block not found');
      }

      // Verify board access
      const board = await this.boardModel.findById(block.boardId);
      const hasAccess = board.owner.toString() === userId || 
                       board.collaborators.some(collaborator => collaborator.toString() === userId);
      
      if (!hasAccess) {
        throw new ForbiddenException('Access denied');
      }

      await this.blockModel.findByIdAndDelete(id);
      console.log('Block deleted successfully:', id); // Debug log
    } catch (error) {
      console.error('Error deleting block:', error); // Debug log
      throw error;
    }
  }

  async findByBoard(boardId: string): Promise<Block[]> {
    try {
      const blocks = await this.blockModel
        .find({ boardId: new Types.ObjectId(boardId) })
        .populate(['createdBy'])
        .sort({ createdAt: -1 });

      console.log(`Found ${blocks.length} blocks for board ${boardId}`); // Debug log
      
      return blocks;
    } catch (error) {
      console.error('Error fetching blocks:', error); // Debug log
      throw error;
    }
  }
}
