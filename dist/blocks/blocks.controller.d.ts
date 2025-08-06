import { BlocksService } from './blocks.service';
import { CreateBlockDto } from './dto/create-block.dto';
import { UpdateBlockDto } from './dto/update-block.dto';
import { UserDocument } from '../users/schemas/user.schema';
export declare class BlocksController {
    private readonly blocksService;
    constructor(blocksService: BlocksService);
    create(createBlockDto: CreateBlockDto, user: UserDocument): Promise<import("./schemas/block.schema").Block>;
    update(id: string, updateBlockDto: UpdateBlockDto, user: UserDocument): Promise<import("./schemas/block.schema").Block>;
    remove(id: string, user: UserDocument): Promise<void>;
}
