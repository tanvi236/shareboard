import { IsEmail, IsMongoId } from 'class-validator';

export class SendInvitationDto {
  @IsMongoId()
  boardId: string;

  @IsEmail()
  email: string;
}
