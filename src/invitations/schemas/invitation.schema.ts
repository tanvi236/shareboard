import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type InvitationDocument = Invitation & Document;

@Schema({ timestamps: true })
export class Invitation {
  @Prop({ type: Types.ObjectId, ref: 'Board', required: true })
  boardId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  invitedBy: Types.ObjectId;

  @Prop({ required: true })
  email: string;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  invitedUser: Types.ObjectId;

  @Prop({ 
    enum: ['pending', 'accepted', 'rejected', 'expired'], 
    default: 'pending' 
  })
  status: string;

  @Prop({ required: true })
  token: string;

  @Prop({ required: true })
  expiresAt: Date;

  @Prop()
  acceptedAt: Date;
}

export const InvitationSchema = SchemaFactory.createForClass(Invitation);
