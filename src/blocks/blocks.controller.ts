import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BlocksService } from './blocks.service';
import { CreateBlockDto } from './dto/create-block.dto';
import { UpdateBlockDto } from './dto/update-block.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { UserDocument } from '../users/schemas/user.schema';

@ApiTags('blocks')
@Controller('blocks')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class BlocksController {
  constructor(private readonly blocksService: BlocksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new block' })
  @ApiResponse({ status: 201, description: 'Block created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @ApiResponse({ status: 404, description: 'Board not found' })
  async create(@Body() createBlockDto: CreateBlockDto, @GetUser() user: UserDocument) {
    try {
      const block = await this.blocksService.create(createBlockDto, user._id.toString());
      return {
        success: true,
        message: 'Block created successfully',
        data: block,
      };
    } catch (error) {
      console.error('Error in create block controller:', error);
      throw error;
    }
  }

  @Get('board/:boardId')
  @ApiOperation({ summary: 'Get all blocks for a board' })
  @ApiResponse({ status: 200, description: 'Blocks retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @ApiResponse({ status: 404, description: 'Board not found' })
  async findByBoard(@Param('boardId') boardId: string, @GetUser() user: UserDocument) {
    try {
      const blocks = await this.blocksService.findByBoard(boardId, user._id.toString());
      return {
        success: true,
        data: blocks,
      };
    } catch (error) {
      console.error('Error in findByBoard controller:', error);
      throw error;
    }
  }

  @Patch(':id')
@ApiOperation({ summary: 'Update a block' })
@ApiResponse({ status: 200, description: 'Block updated successfully' })
@ApiResponse({ status: 400, description: 'Bad Request' })
@ApiResponse({ status: 403, description: 'Access denied' })
@ApiResponse({ status: 404, description: 'Block not found' })
async update(
  @Param('id') id: string, 
  @Body() updateBlockDto: UpdateBlockDto, 
  @GetUser() user: UserDocument
) {
  try {
    // DEBUG: Log everything
    console.log('=== PATCH /blocks/:id DEBUG ===');
    console.log('Block ID:', id);
    console.log('Raw Body:', updateBlockDto);
    console.log('User ID:', user._id.toString());
    console.log('Body keys:', Object.keys(updateBlockDto));
    console.log('Body values:', Object.values(updateBlockDto));
    console.log('================================');
    
    const block = await this.blocksService.update(id, updateBlockDto, user._id.toString());
    return {
      success: true,
      message: 'Block updated successfully',
      data: block,
    };
  } catch (error) {
    console.error('Error in update block controller:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    throw error;
  }
}


  @Delete(':id')
  @ApiOperation({ summary: 'Delete a block' })
  @ApiResponse({ status: 200, description: 'Block deleted successfully' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @ApiResponse({ status: 404, description: 'Block not found' })
  async remove(@Param('id') id: string, @GetUser() user: UserDocument) {
    try {
      await this.blocksService.remove(id, user._id.toString());
      return {
        success: true,
        message: 'Block deleted successfully',
      };
    } catch (error) {
      console.error('Error in remove block controller:', error);
      throw error;
    }
  }
}
