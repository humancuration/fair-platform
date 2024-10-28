import * as Minio from 'minio';
import { Readable } from 'stream';
import logger from './logger';

// Initialize MinIO client
const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.MINIO_PORT || '9000'),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin'
});

const BUCKET_NAME = process.env.MINIO_BUCKET_NAME || 'emojis';

// Ensure bucket exists
const initializeBucket = async () => {
  try {
    const bucketExists = await minioClient.bucketExists(BUCKET_NAME);
    if (!bucketExists) {
      await minioClient.makeBucket(BUCKET_NAME, process.env.MINIO_REGION || 'us-east-1');
      logger.info(`Created bucket: ${BUCKET_NAME}`);
    }
  } catch (error) {
    logger.error('Error initializing MinIO bucket:', error);
    throw error;
  }
};

initializeBucket();

export const uploadToMinIO = async (
  fileStream: Readable,
  fileName: string,
  contentType = 'image/png'
): Promise<string> => {
  try {
    await minioClient.putObject(BUCKET_NAME, fileName, fileStream, {
      'Content-Type': contentType
    });

    // Generate URL for the uploaded file
    const url = await minioClient.presignedGetObject(BUCKET_NAME, fileName, 24 * 60 * 60); // 24 hour expiry
    return url;
  } catch (error) {
    logger.error('Error uploading to MinIO:', error);
    throw new Error('Failed to upload file');
  }
};

export const deleteFromMinIO = async (fileName: string): Promise<void> => {
  try {
    await minioClient.removeObject(BUCKET_NAME, fileName);
  } catch (error) {
    logger.error('Error deleting from MinIO:', error);
    throw new Error('Failed to delete file');
  }
};
