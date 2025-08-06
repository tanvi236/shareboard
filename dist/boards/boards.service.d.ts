import { Model } from 'mongoose';
import { BoardDocument } from './schemas/board.schema';
import { BlockDocument } from '../blocks/schemas/block.schema';
import { UsersService } from '../users/users.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { AddCollaboratorDto } from './dto/add-collaborator.dto';
export declare class BoardsService {
    private boardModel;
    private blockModel;
    private usersService;
    constructor(boardModel: Model<BoardDocument>, blockModel: Model<BlockDocument>, usersService: UsersService);
    create(createBoardDto: CreateBoardDto, userId: string): Promise<BoardDocument>;
    findUserBoards(userId: string): Promise<BoardDocument[]>;
    findOne(id: string, userId: string): Promise<BoardDocument & {
        blocks: BlockDocument[];
    }>;
    addCollaborator(boardId: string, addCollaboratorDto: AddCollaboratorDto, userId: string): Promise<void>;
    checkAccess(board: BoardDocument, userId: string): boolean;
    checkBoardAccess(boardId: string, userId: string): Promise<boolean>;
}
