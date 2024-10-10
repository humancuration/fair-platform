import cron from 'node-cron';
import User from '../models/User';
import AnalyticsService from '../services/AnalyticsService';

const dataRetentionTask = () => {
  cron.schedule('0 0 * * *', async () => {
    console.log('Running daily data retention task');

    const users = await User.find();

    for (const user of users) {
      if (user.settings.anonymizeData) {
        await AnalyticsService.anonymizeUserData(user._id);
      } else {
        await AnalyticsService.deleteOldData(user.settings.dataRetentionPeriod);
      }
    }

    console.log('Data retention task completed');
  });
};

export default dataRetentionTask;