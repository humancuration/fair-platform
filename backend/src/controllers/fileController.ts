import { Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthenticatedRequest } from '../types/auth';
import logger from '../utils/logger';
import { createNotification } from './notificationController';
import { Readable } from 'stream';
import { MinioService } from '../services/minioService';

const minioService = new MinioService();

interface FileUploadMetadata {
  userId: string;
  type: 'AVATAR' | 'EVENT_IMAGE' | 'GROUP_IMAGE' | 'DOCUMENT';
  relatedId?: string;
}

export const uploadFile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: 'No file provided' });
    }

    const { type, relatedId } = req.body;
    const metadata: FileUploadMetadata = {
      userId,
      type,
      relatedId
    };

    const fileStream = Readable.from(file.buffer);
    const fileName = `${type.toLowerCase()}/${userId}/${Date.now()}-${file.originalname}`;
    
    await minioService.uploadFile(fileName, fileStream, file.mimetype);

    const uploadedFile = await prisma.file.create({
      data: {
        name: file.originalname,
        path: fileName,
        mimeType: file.mimetype,
        size: file.size,
        type,
        userId,
        ...(relatedId && { relatedId })
      }
    });

    if (type === 'EVENT_IMAGE' && relatedId) {
      await prisma.event.update({
        where: { id: relatedId },
        data: { imageUrl: fileName }
      });
    }

    res.status(201).json(uploadedFile);
  } catch (error) {
    logger.error('Error uploading file:', error);
    res.status(500).json({ message: 'Failed to upload file' });
  }
};

export const getFile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { fileId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const file = await prisma.file.findUnique({
      where: { id: fileId }
    });

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Check permissions based on file type and related resources
    const hasAccess = await checkFileAccess(userId, file);
    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const fileStream = await minioService.getFile(file.path);
    res.setHeader('Content-Type', file.mimeType);
    fileStream.pipe(res);
  } catch (error) {
    logger.error('Error fetching file:', error);
    res.status(500).json({ message: 'Failed to fetch file' });
  }
};

export const deleteFile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { fileId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const file = await prisma.file.findUnique({
      where: { id: fileId }
    });

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    if (file.userId !== userId) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user?.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Unauthorized to delete this file' });
      }
    }

    await minioService.deleteFile(file.path);
    await prisma.file.delete({
      where: { id: fileId }
    });

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    logger.error('Error deleting file:', error);
    res.status(500).json({ message: 'Failed to delete file' });
  }
};

async function checkFileAccess(userId: string, file: any): Promise<boolean> {
  // Public files are accessible to all authenticated users
  if (file.visibility === 'PUBLIC') {
    return true;
  }

  // File owners have access
  if (file.userId === userId) {
    return true;
  }

  // Check access based on file type and related resources
  switch (file.type) {
    case 'EVENT_IMAGE':
      return prisma.event.count({
        where: {
          id: file.relatedId,
          OR: [
            { createdById: userId },
            { group: { members: { some: { userId } } } }
          ]
        }
      }).then(count => count > 0);

    case 'GROUP_IMAGE':
      return prisma.groupMember.count({
        where: {
          groupId: file.relatedId,
          userId
        }
      }).then(count => count > 0);

    default:
      return false;
  }
}
