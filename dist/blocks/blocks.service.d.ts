import { Model } from 'mongoose';
import { Block, BlockDocument } from './schemas/block.schema';
import { BoardDocument } from '../boards/schemas/board.schema';
import { CreateBlockDto } from './dto/create-block.dto';
import { UpdateBlockDto } from './dto/update-block.dto';
export declare class BlocksService {
    private blockModel;
    private boardModel;
    constructor(blockModel: Model<BlockDocument>, boardModel: Model<BoardDocument>);
    create(createBlockDto: CreateBlockDto, userId: string): Promise<Block>;
    update(id: string, updateBlockDto: UpdateBlockDto, userId: string): Promise<Block>;
    remove(id: string, userId: string): Promise<void>;
    findByBoard(boardId: string): Promise<Block[]>;
}
