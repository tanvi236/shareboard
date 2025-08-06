import { BlocksService } from './blocks.service';
import { CreateBlockDto } from './dto/create-block.dto';
import { UpdateBlockDto } from './dto/update-block.dto';
import { UserDocument } from '../users/schemas/user.schema';
export declare class BlocksController {
    private readonly blocksService;
    constructor(blocksService: BlocksService);
    create(createBlockDto: CreateBlockDto, user: UserDocument): Promise<{
        success: boolean;
        message: string;
        data: import("./schemas/block.schema").Block;
    }>;
    findByBoard(boardId: string, user: UserDocument): Promise<{
        success: boolean;
        data: import("./schemas/block.schema").Block[];
    }>;
    update(id: string, updateBlockDto: UpdateBlockDto, user: UserDocument): Promise<{
        success: boolean;
        message: string;
        data: import("./schemas/block.schema").Block;
    }>;
    remove(id: string, user: UserDocument): Promise<{
        success: boolean;
        message: string;
    }>;
}
