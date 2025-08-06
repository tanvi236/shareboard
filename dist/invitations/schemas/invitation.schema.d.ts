import { Document, Types } from 'mongoose';
export type InvitationDocument = Invitation & Document;
export declare class Invitation {
    boardId: Types.ObjectId;
    invitedBy: Types.ObjectId;
    email: string;
    invitedUser: Types.ObjectId;
    status: string;
    token: string;
    expiresAt: Date;
    acceptedAt: Date;
}
export declare const InvitationSchema: import("mongoose").Schema<Invitation, import("mongoose").Model<Invitation, any, any, any, Document<unknown, any, Invitation> & Invitation & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Invitation, Document<unknown, {}, import("mongoose").FlatRecord<Invitation>> & import("mongoose").FlatRecord<Invitation> & {
    _id: Types.ObjectId;
}>;
