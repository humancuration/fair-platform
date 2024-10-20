import cron from 'node-cron';
import User from '../user/User';
import AnalyticsService from './analyticsService';
import logger from '../../utils/logger';

const dataRetentionTask = () => {
  cron.schedule('0 0 * * *', async () => {
    logger.info('Starting daily data retention task');

    try {
      const users = await User.findAll();

      for (const user of users) {
        try {
          if (user.settings.anonymizeData) {
            await AnalyticsService.anonymizeUserData(user.id);
          } else {
            await AnalyticsService.deleteOldData(user.settings.dataRetentionPeriod);
          }
        } catch (error) {
          logger.error(`Error processing user ${user.id}: ${error}`);
        }
      }

      logger.info('Data retention task completed successfully');
    } catch (error) {
      logger.error(`Error in data retention task: ${error}`);
    }
  });
};

export default dataRetentionTask;
