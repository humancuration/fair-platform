import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import logger from '../utils/logger';

const NEXTCLOUD_URL = process.env.NEXTCLOUD_URL;
const NEXTCLOUD_USERNAME = process.env.NEXTCLOUD_USERNAME;
const NEXTCLOUD_PASSWORD = process.env.NEXTCLOUD_PASSWORD;

const nextcloudApi = axios.create({
  baseURL: NEXTCLOUD_URL,
  auth: {
    username: NEXTCLOUD_USERNAME!,
    password: NEXTCLOUD_PASSWORD!,
  },
});

export const createNextcloudFolder = async (folderName: string): Promise<boolean> => {
  try {
    const response = await nextcloudApi.request({
      method: 'MKCOL',
      url: `/remote.php/dav/files/${NEXTCLOUD_USERNAME}/${folderName}`,
    });
    logger.info(`Created Nextcloud folder: ${folderName}`);
    return response.status === 201;
  } catch (error) {
    logger.error('Error creating Nextcloud folder:', error);
    throw new Error(`Failed to create Nextcloud folder: ${error.message}`);
  }
};

export const uploadFileToNextcloud = async (localFilePath: string, remoteFilePath: string): Promise<void> => {
  try {
    const fileContent = fs.createReadStream(localFilePath);
    const form = new FormData();
    form.append('file', fileContent);

    await nextcloudApi.put(`/remote.php/dav/files/${NEXTCLOUD_USERNAME}/${remoteFilePath}`, form, {
      headers: form.getHeaders(),
    });
    logger.info(`Uploaded file to Nextcloud: ${remoteFilePath}`);
  } catch (error) {
    logger.error('Error uploading file to Nextcloud:', error);
    throw new Error(`Failed to upload file to Nextcloud: ${error.message}`);
  }
};
