import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BoardsService } from './boards.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { UserDocument } from '../users/schemas/user.schema';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardWithPopulatedBlocks } from './types/board.types';

@ApiTags('boards')
@Controller('boards')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all boards for user (owned + collaborated)' })
  @ApiResponse({ status: 200, description: 'Boards retrieved successfully' })
  async findAll(@GetUser() user: UserDocument) {
    const boards = await this.boardsService.findAll(user._id.toString());
    return {
      success: true,
      data: boards,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get board by id' })
  @ApiResponse({ status: 200, description: 'Board retrieved successfully' })
  async findOne(
    @Param('id') id: string,
    @GetUser() user: UserDocument,
  ) {
    const board = await this.boardsService.findOne(id, user._id.toString());
    return {
      success: true,
      data: board,
    };
  }

  @Get(':id/blocks')
  @ApiOperation({ summary: 'Get board with all blocks' })
  @ApiResponse({ status: 200, description: 'Board with blocks retrieved successfully' })
  async getBoardWithBlocks(
    @Param('id') id: string,
    @GetUser() user: UserDocument,
  ): Promise<{ success: boolean; data: BoardWithPopulatedBlocks }> {
    const board = await this.boardsService.findBoardWithBlocks(id, user._id.toString());
    return {
      success: true,
      data: board,
    };
  }

  @Post()
  @ApiOperation({ summary: 'Create new board' })
  @ApiResponse({ status: 201, description: 'Board created successfully' })
  async create(
    @Body() createBoardDto: CreateBoardDto,
    @GetUser() user: UserDocument,
  ) {
    const board = await this.boardsService.create(createBoardDto, user._id.toString());
    return {
      success: true,
      data: board,
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update board' })
  @ApiResponse({ status: 200, description: 'Board updated successfully' })
  async update(
    @Param('id') id: string,
    @Body() updateBoardDto: CreateBoardDto,
    @GetUser() user: UserDocument,
  ) {
    const board = await this.boardsService.update(id, updateBoardDto, user._id.toString());
    return {
      success: true,
      data: board,
    };
  }

  @Delete(':id')
  @ApiOperation({ description: 'Board deleted successfully' })
  async remove(
    @Param('id') id: string,
    @GetUser() user: UserDocument,
  ) {
    await this.boardsService.remove(id, user._id.toString());
    return {
      success: true,
      message: 'Board deleted successfully',
    };
  }

  @Post(':id/collaborators')
  @ApiOperation({ summary: 'Add collaborator to board' })
  @ApiResponse({ status: 200, description: 'Collaborator added successfully' })
  async addCollaborator(
    @Param('id') id: string,
    @Body() { email }: { email: string },
    @GetUser() user: UserDocument,
  ) {
    const board = await this.boardsService.addCollaborator(id, email, user._id.toString());
    return {
      success: true,
      data: board,
    };
  }
}
