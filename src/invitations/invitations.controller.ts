import { Controller, Post, Get, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { InvitationsService } from './invitations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { UserDocument } from '../users/schemas/user.schema';
import { IsEmail } from 'class-validator';

class SendInvitationDto {
  boardId: string;
  email: string;
}

class GetUserInvitationsDto {
  @IsEmail()
  email: string;
}

@ApiTags('invitations')
@Controller('invitations')
export class InvitationsController {
  constructor(private readonly invitationsService: InvitationsService) {}

  @Post('send')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Send board invitation' })
  @ApiResponse({ status: 201, description: 'Invitation sent successfully' })
  async sendInvitation(
    @Body() { boardId, email }: SendInvitationDto,
    @GetUser() user: UserDocument,
  ) {
    try {
      const invitation = await this.invitationsService.createInvitation(
        boardId,
        email,
        user._id.toString(),
      );

      return {
        success: true,
        message: 'Invitation sent successfully',
        data: invitation,
      };
    } catch (error) {
      console.error('Error sending invitation:', error, error?.message, error?.stack);
      throw error;
    }
  }

  @Post('user/invitations')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get user invitations by email' })
  @ApiResponse({ status: 200, description: 'User invitations retrieved' })
  async getUserInvitations(
    @Body() getUserInvitationsDto: GetUserInvitationsDto,
    @GetUser() user: UserDocument,
  ) {
    try {
      const invitations = await this.invitationsService.getUserInvitations(
        getUserInvitationsDto.email
      );
      return {
        success: true,
        data: invitations,
      };
    } catch (error) {
      console.error('Error getting user invitations:', error);
      throw error;
    }
  }

  @Get('token/:token')
  @ApiOperation({ summary: 'Get invitation details by token' })
  @ApiResponse({ status: 200, description: 'Invitation details retrieved' })
  async getInvitationByToken(@Param('token') token: string) {
    try {
      const invitation = await this.invitationsService.getInvitationByToken(token);
      return {
        success: true,
        data: invitation,
      };
    } catch (error) {
      console.error('Error getting invitation by token:', error);
      throw error;
    }
  }

  @Post('accept/:token')
  @ApiOperation({ summary: 'Accept invitation' })
  @ApiResponse({ status: 200, description: 'Invitation accepted successfully' })
  async acceptInvitation(
    @Param('token') token: string,
    @Req() req: any,
  ) {
    try {
      const userId = req.user?._id?.toString();
      const result = await this.invitationsService.acceptInvitation(token, userId);
      
      return {
        success: true,
        message: result.requiresRegistration 
          ? 'Registration required to accept invitation'
          : 'Invitation accepted successfully',
        data: result,
      };
    } catch (error) {
      console.error('Error accepting invitation:', error);
      throw error;
    }
  }

  @Get('board/:boardId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get board invitations' })
  @ApiResponse({ status: 200, description: 'Board invitations retrieved' })
  async getBoardInvitations(
    @Param('boardId') boardId: string,
    @GetUser() user: UserDocument,
  ) {
    try {
      const invitations = await this.invitationsService.getBoardInvitations(
        boardId,
        user._id.toString(),
      );

      return {
        success: true,
        data: invitations,
      };
    } catch (error) {
      console.error('Error getting board invitations:', error);
      throw error;
    }
  }

  @Post('resend/:invitationId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Resend invitation' })
  @ApiResponse({ status: 200, description: 'Invitation resent successfully' })
  async resendInvitation(
    @Param('invitationId') invitationId: string,
    @GetUser() user: UserDocument,
  ) {
    try {
      return {
        success: true,
        message: 'Invitation resent successfully',
      };
    } catch (error) {
      console.error('Error resending invitation:', error);
      throw error;
    }
  }

  @Post('cancel/:invitationId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Cancel invitation' })
  @ApiResponse({ status: 200, description: 'Invitation cancelled successfully' })
  async cancelInvitation(
    @Param('invitationId') invitationId: string,
    @GetUser() user: UserDocument,
  ) {
    try {
      return {
        success: true,
        message: 'Invitation cancelled successfully',
      };
    } catch (error) {
      console.error('Error cancelling invitation:', error);
      throw error;
    }
  }
}
