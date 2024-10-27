import { createClient } from 'minio';
import { prisma } from '../lib/prisma';
import type { Upload } from '@prisma/client';

const minioClient = createClient({
  endPoint: process.env.MINIO_ENDPOINT!,
  port: parseInt(process.env.MINIO_PORT || '9000'),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY!,
  secretKey: process.env.MINIO_SECRET_KEY!
});

const BUCKET_NAME = process.env.MINIO_BUCKET_NAME || 'minsite-uploads';

export class UploadService {
  static async ensureBucket() {
    const exists = await minioClient.bucketExists(BUCKET_NAME);
    if (!exists) {
      await minioClient.makeBucket(BUCKET_NAME);
    }
  }

  static async uploadFile(file: Express.Multer.File, userId: string, minsiteId: string): Promise<Upload> {
    await this.ensureBucket();

    const filename = `${Date.now()}-${file.originalname}`;
    const objectName = `${userId}/${minsiteId}/${filename}`;

    await minioClient.putObject(
      BUCKET_NAME,
      objectName,
      file.buffer,
      file.size,
      { 'Content-Type': file.mimetype }
    );

    const upload = await prisma.upload.create({
      data: {
        filename,
        contentType: file.mimetype,
        path: `/${BUCKET_NAME}/${objectName}`,
        size: file.size,
        userId,
        minsiteId
      }
    });

    return upload;
  }

  static async deleteFile(uploadId: string) {
    const upload = await prisma.upload.findUnique({
      where: { id: uploadId }
    });

    if (!upload) {
      throw new Error('Upload not found');
    }

    const objectName = upload.path.replace(`/${BUCKET_NAME}/`, '');
    await minioClient.removeObject(BUCKET_NAME, objectName);

    await prisma.upload.delete({
      where: { id: uploadId }
    });
  }

  static async getSignedUrl(uploadId: string, expirySeconds = 3600) {
    const upload = await prisma.upload.findUnique({
      where: { id: uploadId }
    });

    if (!upload) {
      throw new Error('Upload not found');
    }

    const objectName = upload.path.replace(`/${BUCKET_NAME}/`, '');
    return minioClient.presignedGetObject(BUCKET_NAME, objectName, expirySeconds);
  }
}
