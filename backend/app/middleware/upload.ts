import { Request, Response, NextFunction } from 'express';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { AppError } from '../utils/errors';
import logger from '../utils/logger';
import { execSync } from 'child_process';

// Extend Express Request type
interface FileRequest extends Request {
  isLFSFile?: boolean;
  file?: Express.Multer.File;
  files?: Express.Multer.File[];
}

// File type configuration
type FileType = 'image' | 'document' | 'video' | 'lfs';

interface FileLimits {
  [key in FileType]: number;
}

// File size limits for different types
const limits: FileLimits = {
  'image': 5 * 1024 * 1024, // 5MB
  'document': 10 * 1024 * 1024, // 10MB
  'video': 100 * 1024 * 1024, // 100MB
  'lfs': 500 * 1024 * 1024 // 500MB
};

// Configure storage for different file types
const storage = multer.diskStorage({
  destination: (req: FileRequest, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    try {
      const repoPath = path.join(process.env.REPO_BASE_PATH || '../repositories', req.params.repoName);
      cb(null, repoPath);
    } catch (error) {
      cb(new Error('Error setting file destination'), '');
    }
  },
  filename: (req: FileRequest, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    try {
      const uniqueName = `${path.parse(file.originalname).name}-${uuidv4()}${path.extname(file.originalname)}`;
      cb(null, uniqueName);
    } catch (error) {
      cb(new Error('Error generating filename'), '');
    }
  }
});

// Helper to determine file type
const getFileType = (mimetype: string): FileType => {
  if (mimetype.startsWith('image/')) return 'image';
  if (mimetype.startsWith('video/')) return 'video';
  if (mimetype.includes('pdf') || mimetype.includes('document')) return 'document';
  return 'lfs';
};

// Helper to determine if file should use LFS
const shouldUseLFS = (mimetype: string, size: number): boolean => {
  const lfsPatterns = [
    /^image\/(psd|raw|tiff)$/,
    /^video\//,
    /^application\/(x-7z-compressed|zip|x-rar-compressed)$/,
    /\.(?:psd|ai|sketch)$/
  ];

  return size > 5 * 1024 * 1024 || // Files larger than 5MB
    lfsPatterns.some(pattern => pattern.test(mimetype));
};

// File filter with LFS handling
const fileFilter = (req: FileRequest, file: Express.Multer.File, cb: FileFilterCallback) => {
  try {
    const fileSize = parseInt(req.headers['content-length'] || '0');
    const fileType = getFileType(file.mimetype);
    
    if (shouldUseLFS(file.mimetype, fileSize)) {
      req.isLFSFile = true;
      if (fileSize > limits.lfs) {
        cb(new AppError('File too large for LFS handling', 400));
        return;
      }
    } else if (fileSize > limits[fileType]) {
      cb(new AppError(`File too large for ${fileType} type`, 400));
      return;
    }

    cb(null, true);
  } catch (error) {
    cb(new AppError('Error processing file', 500));
  }
};

// Create multer upload instance
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: limits.lfs }
});

// Middleware to handle Git LFS tracking
export const handleLFSTracking = async (req: FileRequest, res: Response, next: NextFunction) => {
  if (!req.file || !req.isLFSFile) {
    return next();
  }

  const repoPath = path.join(process.env.REPO_BASE_PATH || '../repositories', req.params.repoName);
  const filePath = req.file.path;

  try {
    // Ensure LFS is installed and configured
    execSync('git lfs install', { cwd: repoPath });
    
    // Track the file with Git LFS
    execSync(`git lfs track "${path.relative(repoPath, filePath)}"`, { cwd: repoPath });
    
    // Add the .gitattributes file
    execSync('git add .gitattributes', { cwd: repoPath });
    
    logger.info(`File tracked with Git LFS: ${filePath}`);
    next();
  } catch (error) {
    logger.error('Error handling LFS tracking:', error);
    next(new AppError('Failed to configure LFS tracking', 500));
  }
};

// Middleware to validate repository access
export const validateRepoAccess = async (req: FileRequest, res: Response, next: NextFunction) => {
  try {
    const { repoName } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError('Authentication required', 401);
    }

    const hasAccess = await checkRepoAccess(repoName, userId);
    if (!hasAccess) {
      throw new AppError('Repository access denied', 403);
    }
    next();
  } catch (error) {
    next(error instanceof AppError ? error : new AppError('Error validating repository access', 500));
  }
};

// Export configured upload middleware
export const uploadMiddleware = {
  single: (fieldName: string) => [
    validateRepoAccess,
    upload.single(fieldName),
    handleLFSTracking
  ],
  array: (fieldName: string, maxCount: number) => [
    validateRepoAccess,
    upload.array(fieldName, maxCount),
    handleLFSTracking
  ],
  fields: (fields: multer.Field[]) => [
    validateRepoAccess,
    upload.fields(fields),
    handleLFSTracking
  ]
};

// Helper function to check repository access
async function checkRepoAccess(repoName: string, userId: number): Promise<boolean> {
  // Implement your repository access check logic here
  // This should query your database to verify user permissions
  return true; // Placeholder
}
