import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BlockDocument = Block & Document;

@Schema({ timestamps: true })
export class Block {
  @Prop({ required: true, enum: ['text', 'image', 'link'] })
  type: 'text' | 'image' | 'link';

  @Prop({ required: true, maxlength: 2000 })
  content: string;

  @Prop({
    type: {
      x: { type: Number, required: true, min: 0 },
      y: { type: Number, required: true, min: 0 },
    },
    required: true,
  })
  position: {
    x: number;
    y: number;
  };

  @Prop({ type: Types.ObjectId, ref: 'Board', required: true })
  boardId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  @Prop({ default: Date.now })
  lastEdited: Date;

  @Prop({ default: 200 })
  width: number;

  @Prop({ default: 150 })
  height: number;
}

export const BlockSchema = SchemaFactory.createForClass(Block);
