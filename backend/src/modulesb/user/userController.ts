import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import User, { UserDocument } from '../modules/user/User';
import AnalyticsService from '../services/analyticsService';
import { AuthRequest } from '../middleware/auth';

class UserController {
  async register(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, role } = req.body;

    try {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({ email, password: hashedPassword, role });

      const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });

      res.status(201).json({ token });
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  async login(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });

      res.status(200).json({ token });
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  async getUserData(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!._id;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      const analyticsData = await AnalyticsService.getUserData(userId);
      
      const userData = {
        profile: user.getPublicProfile(),
        analytics: analyticsData,
      };

      res.json(userData);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user data', error });
    }
  }

  async deleteUserData(req: Request, res: Response) {
    try {
      const userId = req.user._id;
      const { dataType } = req.params;

      switch (dataType) {
        case 'analytics':
          await AnalyticsService.deleteUserData(userId);
          break;
        // Handle other data types
        default:
          return res.status(400).json({ message: 'Invalid data type' });
      }

      res.json({ message: 'Data deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting user data', error });
    }
  }

  async updateSettings(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!._id;
      const { allowSearchAnalytics, allowBehavioralTracking, dataRetentionPeriod, anonymizeData } = req.body;

      const user = await User.findByIdAndUpdate(userId, {
        settings: { allowSearchAnalytics, allowBehavioralTracking, dataRetentionPeriod, anonymizeData }
      }, { new: true });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({ message: 'Settings updated successfully', settings: user.settings });
    } catch (error) {
      res.status(500).json({ message: 'Error updating settings', error });
    }
  }

  async getSettings(req: Request, res: Response) {
    try {
      const userId = req.user._id;
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json(user.settings);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching settings', error });
    }
  }

  // Implement other methods for settings, PoIP consent, etc.
}

export default new UserController();
