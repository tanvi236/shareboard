import { Document, Types } from 'mongoose';
export type BoardDocument = Board & Document;
export declare class Board {
    name: string;
    owner: Types.ObjectId;
    collaborators: Types.ObjectId[];
    blocks: Types.ObjectId[];
    isPublic: boolean;
}
export declare const BoardSchema: import("mongoose").Schema<Board, import("mongoose").Model<Board, any, any, any, Document<unknown, any, Board> & Board & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Board, Document<unknown, {}, import("mongoose").FlatRecord<Board>> & import("mongoose").FlatRecord<Board> & {
    _id: Types.ObjectId;
}>;
