import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { AddCollaboratorDto } from './dto/add-collaborator.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { UserDocument } from '../users/schemas/user.schema';

@ApiTags('boards')
@Controller('boards')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new board' })
  @ApiResponse({ status: 201, description: 'Board successfully created' })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() createBoardDto: CreateBoardDto, @GetUser() user: UserDocument) {
    return this.boardsService.create(createBoardDto, user._id.toString());
  }

  @Get()
  @ApiOperation({ summary: 'Get all boards for current user' })
  @ApiResponse({ status: 200, description: 'Returns user boards' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findUserBoards(@GetUser() user: UserDocument) {
    return this.boardsService.findUserBoards(user._id.toString());
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get specific board with blocks' })
  @ApiParam({ name: 'id', description: 'Board ID' })
  @ApiResponse({ status: 200, description: 'Returns board with blocks' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - no access to board' })
  @ApiResponse({ status: 404, description: 'Board not found' })
  findOne(@Param('id') id: string, @GetUser() user: UserDocument) {
    return this.boardsService.findOne(id, user._id.toString());
  }

  @Post(':id/collaborators')
  @ApiOperation({ summary: 'Add collaborator to board' })
  @ApiParam({ name: 'id', description: 'Board ID' })
  @ApiResponse({ status: 200, description: 'Collaborator successfully added' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - only board owner can add collaborators' })
  @ApiResponse({ status: 404, description: 'Board or user not found' })
  addCollaborator(
    @Param('id') id: string,
    @Body() addCollaboratorDto: AddCollaboratorDto,
    @GetUser() user: UserDocument,
  ) {
    return this.boardsService.addCollaborator(id, addCollaboratorDto, user._id.toString());
  }
}
