import { Client } from 'minio';
import { config } from '../config';

export class MinioClient {
  private client: Client;

  constructor() {
    this.client = new Client({
      endPoint: config.minio.endpoint,
      port: config.minio.port,
      useSSL: config.minio.useSSL,
      accessKey: config.minio.accessKey,
      secretKey: config.minio.secretKey
    });
  }

  async uploadFile(bucket: string, filename: string, buffer: Buffer) {
    await this.client.putObject(bucket, filename, buffer);
    return {
      url: `${config.minio.publicUrl}/${bucket}/${filename}`
    };
  }
}
