import { IsEmail } from 'class-validator';

export class GetUserInvitationsDto {
  @IsEmail()
  email: string;
}
