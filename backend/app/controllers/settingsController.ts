import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import logger from '../utils/logger';
import { User } from '@prisma/client';

interface AuthenticatedRequest extends Request {
  user: User;
}

interface UserSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
}

export const getSettings = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const settings = await prisma.userSettings.findUnique({
      where: { userId }
    });

    if (!settings) {
      // Create default settings if none exist
      const defaultSettings = await prisma.userSettings.create({
        data: {
          userId,
          emailNotifications: true,
          pushNotifications: true,
          theme: 'system',
          language: 'en',
          timezone: 'UTC'
        }
      });
      return res.json(defaultSettings);
    }

    res.json(settings);
  } catch (error) {
    logger.error('Error fetching settings:', error);
    res.status(500).json({ message: 'Failed to fetch settings' });
  }
};

export const updateSettings = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const settings: Partial<UserSettings> = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const updatedSettings = await prisma.userSettings.upsert({
      where: { userId },
      create: {
        userId,
        ...settings,
        emailNotifications: settings.emailNotifications ?? true,
        pushNotifications: settings.pushNotifications ?? true,
        theme: settings.theme ?? 'system',
        language: settings.language ?? 'en',
        timezone: settings.timezone ?? 'UTC'
      },
      update: settings
    });

    res.json(updatedSettings);
  } catch (error) {
    logger.error('Error updating settings:', error);
    res.status(500).json({ message: 'Failed to update settings' });
  }
};

export const resetSettings = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const defaultSettings = await prisma.userSettings.upsert({
      where: { userId },
      create: {
        userId,
        emailNotifications: true,
        pushNotifications: true,
        theme: 'system',
        language: 'en',
        timezone: 'UTC'
      },
      update: {
        emailNotifications: true,
        pushNotifications: true,
        theme: 'system',
        language: 'en',
        timezone: 'UTC'
      }
    });

    res.json(defaultSettings);
  } catch (error) {
    logger.error('Error resetting settings:', error);
    res.status(500).json({ message: 'Failed to reset settings' });
  }
};
