import User from '../models/User';
import Notification from '../models/Notification';

export const sendNotification = async (userId: string, message: string) => {
  try {
    const notification = new Notification({
      user: userId,
      message,
      read: false,
      date: new Date(),
    });

    await notification.save();

    // Optionally, integrate with real-time services like WebSockets for instant notifications
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};