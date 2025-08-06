import { 
    Controller, 
    Post, 
    UseInterceptors, 
    UploadedFile, 
    ParseFilePipeBuilder,
    HttpStatus,
    Get,
    Param,
    Res,
    UseGuards
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { Response } from 'express';
  import * as path from 'path';
  import { UploadService } from './upload.service';
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  
  @Controller('upload')
  @UseGuards(JwtAuthGuard)
  export class UploadController {
    constructor(private readonly uploadService: UploadService) {}
  
    @Post('image')
    @UseInterceptors(FileInterceptor('image'))
    async uploadImage(
      @UploadedFile(
        new ParseFilePipeBuilder()
          .addFileTypeValidator({
            fileType: /(jpg|jpeg|png|gif|webp)$/,
          })
          .addMaxSizeValidator({
            maxSize: 5 * 1024 * 1024, // 5MB
          })
          .build({
            errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          }),
      )
      file: Express.Multer.File,
    ) {
      console.log('Received file:', file.originalname, file.size, 'bytes');
      
      const result = await this.uploadService.uploadImage(file);
      
      console.log('File uploaded successfully:', result.url);
      
      return {
        success: true,
        message: 'Image uploaded successfully',
        data: result
      };
    }
  
    @Get('images/:filename')
    async getImage(@Param('filename') filename: string, @Res() res: Response) {
      const filepath = path.join(process.cwd(), 'uploads', 'images', filename);
      return res.sendFile(filepath);
    }
  }
  