import { Model } from 'mongoose';
import { Board, BoardDocument } from './schemas/board.schema';
import { BlockDocument } from '../blocks/schemas/block.schema';
import { BoardWithPopulatedBlocks } from './types/board.types';
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
    private blockModel;
    constructor(boardModel: Model<BoardDocument>, blockModel: Model<BlockDocument>);
    findAll(userId: string): Promise<Board[]>;
    findOne(id: string, userId: string): Promise<Board>;
    findBoardWithBlocks(id: string, userId: string): Promise<BoardWithPopulatedBlocks>;
    checkBoardAccess(boardId: string, userId: string): Promise<boolean>;
    create(createBoardDto: CreateBoardDto, userId: string): Promise<Board>;
    update(id: string, updateBoardDto: UpdateBoardDto, userId: string): Promise<Board>;
    remove(id: string, userId: string): Promise<void>;
    addCollaborator(id: string, email: string, userId: string): Promise<Board>;
}
