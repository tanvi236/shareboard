import { Document, Types } from 'mongoose';
export type BlockDocument = Block & Document;
export declare class Block {
    type: string;
    content: string;
    position: {
        x: number;
        y: number;
    };
    boardId: Types.ObjectId;
    createdBy: Types.ObjectId;
    lastEdited: Date;
    width: number;
    height: number;
}
export declare const BlockSchema: import("mongoose").Schema<Block, import("mongoose").Model<Block, any, any, any, Document<unknown, any, Block> & Block & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Block, Document<unknown, {}, import("mongoose").FlatRecord<Block>> & import("mongoose").FlatRecord<Block> & {
    _id: Types.ObjectId;
}>;
