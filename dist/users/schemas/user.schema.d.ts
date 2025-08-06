import { Document, Types } from 'mongoose';
export type UserDocument = User & Document;
export declare class User {
    name: string;
    email: string;
    passwordHash: string;
    boards: Types.ObjectId[];
    comparePassword(password: string): Promise<boolean>;
}
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, Document<unknown, any, User> & User & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, Document<unknown, {}, import("mongoose").FlatRecord<User>> & import("mongoose").FlatRecord<User> & {
    _id: Types.ObjectId;
}>;
