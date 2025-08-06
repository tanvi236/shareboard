import { Response } from 'express';
import { UploadService } from './upload.service';
export declare class UploadController {
    private readonly uploadService;
    constructor(uploadService: UploadService);
    uploadImage(file: Express.Multer.File): Promise<{
        success: boolean;
        message: string;
        data: {
            url: string;
            filename: string;
        };
    }>;
    getImage(filename: string, res: Response): Promise<void>;
}
