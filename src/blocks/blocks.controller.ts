import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { BlocksService } from './blocks.service';
import { CreateBlockDto } from './dto/create-block.dto';
import { UpdateBlockDto } from './dto/update-block.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { UserDocument } from '../users/schemas/user.schema';

@Controller('blocks')
@UseGuards(JwtAuthGuard)
export class BlocksController {
  constructor(private readonly blocksService: BlocksService) {}

  @Post()
  create(@Body() createBlockDto: CreateBlockDto, @GetUser() user: UserDocument) {
    return this.blocksService.create(createBlockDto, user._id.toString());
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBlockDto: UpdateBlockDto, @GetUser() user: UserDocument) {
    return this.blocksService.update(id, updateBlockDto, user._id.toString());
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user: UserDocument) {
    return this.blocksService.remove(id, user._id.toString());
  }
}
