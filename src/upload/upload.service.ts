import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadService {
  constructor(private configService: ConfigService) {}

  async uploadImage(file: Express.Multer.File): Promise<{ url: string; filename: string }> {
    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'uploads', 'images');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.originalname}`;
    const filepath = path.join(uploadDir, filename);

    // Save file to disk
    fs.writeFileSync(filepath, file.buffer);

    // Return URL that can be used to access the image
    const baseUrl = process.env.BASE_URL || 'http://localhost:5005';
    const url = `${baseUrl}/uploads/images/${filename}`;

    return {
      url,
      filename
    };
  }
}
