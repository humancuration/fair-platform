import axios from 'axios';

export const createNextcloudFolder = async (folderName: string): Promise<boolean> => {
  try {
    const response = await axios.request({
      method: 'MKCOL',
      url: `${process.env.NEXTCLOUD_URL}/remote.php/dav/files/${process.env.NEXTCLOUD_USERNAME}/${folderName}`,
      auth: {
        username: process.env.NEXTCLOUD_USERNAME!,
        password: process.env.NEXTCLOUD_PASSWORD!,
      },
    });
    return response.status === 201;
  } catch (error) {
    console.error('Error creating Nextcloud folder:', error);
    throw error;
  }
};
