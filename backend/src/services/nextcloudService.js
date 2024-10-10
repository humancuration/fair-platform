const axios = require('axios');

const createNextcloudFolder = async (folderName) => {
  try {
    const response = await axios.request({
      method: 'MKCOL',
      url: `${process.env.NEXTCLOUD_URL}/remote.php/dav/files/${process.env.NEXTCLOUD_USERNAME}/${folderName}`,
      auth: {
        username: process.env.NEXTCLOUD_USERNAME,
        password: process.env.NEXTCLOUD_PASSWORD,
      },
    });
    return response.status === 201;
  } catch (error) {
    console.error('Error creating Nextcloud folder:', error);
    throw error;
  }
};

module.exports = { createNextcloudFolder };