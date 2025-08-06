import { BoardsService } from './boards.service';
import { UserDocument } from '../users/schemas/user.schema';
import { CreateBoardDto, UpdateBoardDto } from './boards.service';
import { BoardWithPopulatedBlocks } from './types/board.types';
export declare class BoardsController {
    private readonly boardsService;
    constructor(boardsService: BoardsService);
    findAll(user: UserDocument): Promise<{
        success: boolean;
        data: import("./schemas/board.schema").Board[];
    }>;
    findOne(id: string, user: UserDocument): Promise<{
        success: boolean;
        data: import("./schemas/board.schema").Board;
    }>;
    getBoardWithBlocks(id: string, user: UserDocument): Promise<{
        success: boolean;
        data: BoardWithPopulatedBlocks;
    }>;
    create(createBoardDto: CreateBoardDto, user: UserDocument): Promise<{
        success: boolean;
        data: import("./schemas/board.schema").Board;
    }>;
    update(id: string, updateBoardDto: UpdateBoardDto, user: UserDocument): Promise<{
        success: boolean;
        data: import("./schemas/board.schema").Board;
    }>;
    remove(id: string, user: UserDocument): Promise<{
        success: boolean;
        message: string;
    }>;
    addCollaborator(id: string, { email }: {
        email: string;
    }, user: UserDocument): Promise<{
        success: boolean;
        data: import("./schemas/board.schema").Board;
    }>;
}
