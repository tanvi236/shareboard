import { ConfigService } from '@nestjs/config';
export declare class EmailService {
    private configService;
    private transporter;
    constructor(configService: ConfigService);
    sendInvitation(email: string, boardName: string, inviterName: string, invitationToken: string): Promise<void>;
}
