import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlocksService } from './blocks.service';
import { BlocksController } from './blocks.controller';
import { Block, BlockSchema } from './schemas/block.schema';
import { Board, BoardSchema } from '../boards/schemas/board.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Block.name, schema: BlockSchema },
      { name: Board.name, schema: BoardSchema },
    ]),
  ],
  controllers: [BlocksController],
  providers: [BlocksService],
  exports: [BlocksService],
})
export class BlocksModule {}
