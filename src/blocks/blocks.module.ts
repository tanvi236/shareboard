import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlocksService } from './blocks.service';
import { BlocksController } from './blocks.controller';
import { Block, BlockSchema } from './schemas/block.schema';
import { BoardsModule } from '../boards/boards.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Block.name, schema: BlockSchema }]),
    BoardsModule,
  ],
  controllers: [BlocksController],
  providers: [BlocksService],
})
export class BlocksModule {}
