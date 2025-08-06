import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, isValidObjectId } from 'mongoose';
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
      console.log('Creating block with data:', createBlockDto, 'User:', userId);

      // Validate boardId format
      if (!isValidObjectId(createBlockDto.boardId)) {
        throw new BadRequestException('Invalid board ID format');
      }

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

      console.log('Block saved successfully:', savedBlock._id);

      return savedBlock.populate(['createdBy']);
    } catch (error) {
      console.error('Error creating block:', error);
      throw error;
    }
  }

  async update(id: string, updateBlockDto: UpdateBlockDto, userId: string): Promise<Block> {
    try {
      console.log('Updating block:', id, 'with data:', updateBlockDto, 'User:', userId);
  
      // Validate block ID format
      if (!isValidObjectId(id)) {
        throw new BadRequestException('Invalid block ID format');
      }
  
      const block = await this.blockModel.findById(id);
      if (!block) {
        throw new NotFoundException('Block not found');
      }
  
      console.log('Found block:', block._id, 'BoardId:', block.boardId);
  
      // Verify board access
      const board = await this.boardModel.findById(block.boardId);
      if (!board) {
        throw new NotFoundException('Associated board not found');
      }
  
      const hasAccess = board.owner.toString() === userId || 
                       board.collaborators.some(collaborator => collaborator.toString() === userId);
      
      if (!hasAccess) {
        throw new ForbiddenException('Access denied');
      }
  
      // Validate update data
      if (Object.keys(updateBlockDto).length === 0) {
        throw new BadRequestException('No update data provided');
      }
  
      // Clean position data - remove dropEffect if present
      const cleanUpdateData = { ...updateBlockDto };
      if (cleanUpdateData.position && cleanUpdateData.position.dropEffect) {
        const { dropEffect, ...cleanPosition } = cleanUpdateData.position;
        cleanUpdateData.position = cleanPosition;
      }
  
      // Update with timestamp
      const updateData = {
        ...cleanUpdateData,
        lastEdited: new Date(),
      };
  
      console.log('Updating with cleaned data:', updateData);
  
      const updatedBlock = await this.blockModel.findByIdAndUpdate(
        id, 
        updateData, 
        { new: true, runValidators: true }
      ).populate(['createdBy']);
  
      if (!updatedBlock) {
        throw new NotFoundException('Block not found after update');
      }
  
      console.log('Block updated successfully:', updatedBlock._id);
  
      return updatedBlock;
    } catch (error) {
      console.error('Error updating block:', error);
      throw error;
    }
  }
  

  async remove(id: string, userId: string): Promise<void> {
    try {
      console.log('Deleting block:', id, 'User:', userId);

      // Validate block ID format
      if (!isValidObjectId(id)) {
        throw new BadRequestException('Invalid block ID format');
      }

      const block = await this.blockModel.findById(id);
      if (!block) {
        throw new NotFoundException('Block not found');
      }

      // Verify board access
      const board = await this.boardModel.findById(block.boardId);
      if (!board) {
        throw new NotFoundException('Associated board not found');
      }

      const hasAccess = board.owner.toString() === userId || 
                       board.collaborators.some(collaborator => collaborator.toString() === userId);
      
      if (!hasAccess) {
        throw new ForbiddenException('Access denied');
      }

      await this.blockModel.findByIdAndDelete(id);
      console.log('Block deleted successfully:', id);
    } catch (error) {
      console.error('Error deleting block:', error);
      throw error;
    }
  }

  async findByBoard(boardId: string, userId: string): Promise<Block[]> {
    try {
      console.log('Finding blocks for board:', boardId, 'User:', userId);

      // Validate board ID format
      if (!isValidObjectId(boardId)) {
        throw new BadRequestException('Invalid board ID format');
      }

      // Verify board exists and user has access
      const board = await this.boardModel.findById(boardId);
      if (!board) {
        throw new NotFoundException('Board not found');
      }

      const hasAccess = board.owner.toString() === userId || 
                       board.collaborators.some(collaborator => collaborator.toString() === userId) ||
                       board.isPublic;
      
      if (!hasAccess) {
        throw new ForbiddenException('Access denied');
      }

      const blocks = await this.blockModel
        .find({ boardId: new Types.ObjectId(boardId) })
        .populate(['createdBy'])
        .sort({ createdAt: -1 });

      console.log(`Found ${blocks.length} blocks for board ${boardId}`);
      
      return blocks;
    } catch (error) {
      console.error('Error fetching blocks:', error);
      throw error;
    }
  }
}
