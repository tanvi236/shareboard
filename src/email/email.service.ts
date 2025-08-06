import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendInvitation(
    email: string,
    boardName: string,
    inviterName: string,
    invitationToken: string,
  ): Promise<void> {
    const acceptUrl = `${process.env.FRONTEND_URL}/invitation/accept/${invitationToken}`;
    
    const mailOptions = {
      from: process.env.SMTP_FROM || 'noreply@livebrainstorm.com',
      to: email,
      subject: `You've been invited to collaborate on "${boardName}"`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #667eea;">🚀 Live Brainstorm Invitation</h2>
          
          <p>Hello!</p>
          
          <p><strong>${inviterName}</strong> has invited you to collaborate on the board <strong>"${boardName}"</strong>.</p>
          
          <div style="margin: 30px 0; text-align: center;">
            <a href="${acceptUrl}" style="
              background: #667eea;
              color: white;
              padding: 15px 30px;
              text-decoration: none;
              border-radius: 8px;
              display: inline-block;
              font-weight: bold;
            ">Accept Invitation</a>
          </div>
          
          <p>Or copy and paste this link in your browser:</p>
          <p style="word-break: break-all; color: #667eea;">${acceptUrl}</p>
          
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            This invitation will expire in 7 days. If you don't have an account, you'll be prompted to create one.
          </p>
          
          <hr style="margin: 30px 0;">
          <p style="color: #999; font-size: 12px;">
            This invitation was sent by Live Brainstorm. If you didn't expect this invitation, you can safely ignore this email.
          </p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Invitation email sent to ${email}`);
    } catch (error) {
      console.error('Error sending invitation email:', error);
      throw new Error('Failed to send invitation email');
    }
  }
}
