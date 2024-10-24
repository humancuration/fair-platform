import { Router, Request, Response } from 'express';
import { uploadMiddleware } from '../../middleware/upload';
import { MinioClient } from '../../services/minio';  // This should work now with config/index.ts in place
import { authenticateJWT } from '../../middleware/auth';
import logger from '../../utils/logger';

// Add Multer type declarations
declare global {
  namespace Express {
    namespace Multer {
      interface File {
        fieldname: string;
        originalname: string;
        encoding: string;
        mimetype: string;
        size: number;
        destination: string;
        filename: string;
        path: string;
        buffer: Buffer;
      }
    }
  }
}

interface FileRequest extends Request {
  files?: Express.Multer.File[];
  file?: Express.Multer.File;
}

// Add error handler
const handleVersionControlError = (res: Response, error: any, action: string) => {
  logger.error(`Error during ${action}:`, error);
  res.status(500).json({ error: `Failed to ${action}` });
};

const router = Router();
const minioClient = new MinioClient();

router.post(
  '/:repoName/upload',
  authenticateJWT,
  uploadMiddleware.single('file'),
  async (req: FileRequest, res: Response) => {
    try {
      if (!req.file) {
        throw new Error('No file uploaded');
      }

      const result = await minioClient.uploadFile(
        req.params.repoName,
        req.file.originalname,
        req.file.buffer
      );

      logger.info(`File uploaded successfully to MinIO: ${req.file.originalname}`);

      res.json({
        message: 'File uploaded successfully',
        file: {
          filename: req.file.originalname,
          size: req.file.size,
          url: result.url
        }
      });
    } catch (error) {
      logger.error('Upload error:', error);
      res.status(500).json({ error: 'Failed to upload file' });
    }
  }
);

// Add support for multiple file uploads
router.post(
  '/:repoName/upload-multiple',
  uploadMiddleware.array('files', 10), // Allow up to 10 files
  async (req: FileRequest, res: Response) => {
    try {
      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        throw new Error('No files uploaded');
      }

      const fileDetails = req.files.map(file => ({
        filename: file.filename,
        path: file.path,
        size: file.size
      }));

      logger.info(`Multiple files uploaded successfully: ${fileDetails.length} files`);

      res.json({
        message: 'Files uploaded successfully',
        files: fileDetails
      });
    } catch (error) {
      handleVersionControlError(res, error, 'upload multiple files');
    }
  }
);

export default router;
