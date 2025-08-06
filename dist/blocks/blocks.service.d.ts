import { Model } from 'mongoose';
import { BlockDocument } from './schemas/block.schema';
import { BoardsService } from '../boards/boards.service';
import { CreateBlockDto } from './dto/create-block.dto';
import { UpdateBlockDto } from './dto/update-block.dto';
export declare class BlocksService {
    private blockModel;
    private boardsService;
    constructor(blockModel: Model<BlockDocument>, boardsService: BoardsService);
    create(createBlockDto: CreateBlockDto, userId: string): Promise<BlockDocument>;
    update(id: string, updateBlockDto: UpdateBlockDto, userId: string): Promise<BlockDocument>;
    remove(id: string, userId: string): Promise<void>;
}
