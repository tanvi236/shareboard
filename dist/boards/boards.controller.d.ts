import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { AddCollaboratorDto } from './dto/add-collaborator.dto';
import { UserDocument } from '../users/schemas/user.schema';
export declare class BoardsController {
    private readonly boardsService;
    constructor(boardsService: BoardsService);
    create(createBoardDto: CreateBoardDto, user: UserDocument): Promise<import("./schemas/board.schema").BoardDocument>;
    findUserBoards(user: UserDocument): Promise<import("./schemas/board.schema").BoardDocument[]>;
    findOne(id: string, user: UserDocument): Promise<import("./schemas/board.schema").Board & import("mongoose").Document<any, any, any> & {
        blocks: import("../blocks/schemas/block.schema").BlockDocument[];
    }>;
    addCollaborator(id: string, addCollaboratorDto: AddCollaboratorDto, user: UserDocument): Promise<void>;
}
