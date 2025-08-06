import { Model } from 'mongoose';
import { Board, BoardDocument } from './schemas/board.schema';
export declare class CreateBoardDto {
    name: string;
    isPublic?: boolean;
}
export declare class UpdateBoardDto {
    name?: string;
    isPublic?: boolean;
}
export declare class BoardsService {
    private boardModel;
    constructor(boardModel: Model<BoardDocument>);
    findAll(userId: string): Promise<Board[]>;
    findOne(id: string, userId: string): Promise<Board>;
    create(createBoardDto: CreateBoardDto, userId: string): Promise<Board>;
    update(id: string, updateBoardDto: UpdateBoardDto, userId: string): Promise<Board>;
    remove(id: string, userId: string): Promise<void>;
    addCollaborator(id: string, email: string, userId: string): Promise<Board>;
}
