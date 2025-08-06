import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Block, BlockDocument } from './schemas/block.schema';
import { BoardsService } from '../boards/boards.service';
import { CreateBlockDto } from './dto/create-block.dto';
import { UpdateBlockDto } from './dto/update-block.dto';

@Injectable()
export class BlocksService {
  constructor(
    @InjectModel(Block.name) private blockModel: Model<BlockDocument>,
    private boardsService: BoardsService,
  ) {}

  async create(createBlockDto: CreateBlockDto, userId: string): Promise<BlockDocument> {
    // Check if user has access to the board
    const hasAccess = await this.boardsService.checkBoardAccess(createBlockDto.boardId, userId);
    if (!hasAccess) {
      throw new ForbiddenException('Access denied to board');
    }

    const block = new this.blockModel({
      ...createBlockDto,
      createdBy: userId,
      lastEdited: new Date(),
    });

    return block.save();
  }

  async update(id: string, updateBlockDto: UpdateBlockDto, userId: string): Promise<BlockDocument> {
    const block = await this.blockModel.findById(id).exec();
    if (!block) {
      throw new NotFoundException('Block not found');
    }

    // Check if user has access to the board
    const hasAccess = await this.boardsService.checkBoardAccess(block.boardId.toString(), userId);
    if (!hasAccess) {
      throw new ForbiddenException('Access denied to board');
    }

    Object.assign(block, updateBlockDto);
    block.lastEdited = new Date();
    
    return block.save();
  }

  async remove(id: string, userId: string): Promise<void> {
    const block = await this.blockModel.findById(id).exec();
    if (!block) {
      throw new NotFoundException('Block not found');
    }

    // Check if user has access to the board
    const hasAccess = await this.boardsService.checkBoardAccess(block.boardId.toString(), userId);
    if (!hasAccess) {
      throw new ForbiddenException('Access denied to board');
    }

    await this.blockModel.findByIdAndDelete(id).exec();
  }
}
