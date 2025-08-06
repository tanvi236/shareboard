import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BoardDocument = Board & Document;

@Schema({ timestamps: true })
export class Board {
  
  @Prop({ required: true, trim: true, maxlength: 100 })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  collaborators: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Block' }], default: [] })
  blocks: Types.ObjectId[];

  @Prop({ default: false })
  isPublic: boolean;
}

export const BoardSchema = SchemaFactory.createForClass(Board);
