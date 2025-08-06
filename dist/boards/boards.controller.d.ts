import { BoardsService } from './boards.service';
import { UserDocument } from '../users/schemas/user.schema';
import { CreateBoardDto, UpdateBoardDto } from './boards.service';
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
