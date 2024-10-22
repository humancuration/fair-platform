import { Request, Response } from 'express';
import { Avatar } from './Avatar';
import { Inventory } from '../inventory/Inventory';
import { Item } from '../item/Item';
import { Achievement } from '../achievement/Achievement';
import { sequelize } from '../../config/database';
import { 
  processAvatarEmotion, 
  calculateNewMood, 
  generateEmotionAnimation 
} from '../../services/AvatarEmotionService';

export const createAvatar = async (req: Request, res: Response) => {
  const t = await sequelize.transaction();
  try {
    const { userId, baseImage, accessories, colors, outfit } = req.body;
    const avatar = await Avatar.create({ userId, baseImage, accessories, colors, outfit }, { transaction: t });
    await t.commit();
    res.status(201).json(avatar);
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: 'Error creating avatar', error });
  }
};

export const getAvatar = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const avatar = await Avatar.findOne({ where: { userId } });
    if (!avatar) {
      return res.status(404).json({ message: 'Avatar not found' });
    }
    res.json(avatar);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching avatar', error });
  }
};

export const updateAvatar = async (req: Request, res: Response) => {
  const t = await sequelize.transaction();
  try {
    const { userId } = req.params;
    const { baseImage, accessories, colors, outfit, mood, xp, level } = req.body;
    const avatar = await Avatar.findOne({ where: { userId }, transaction: t });
    if (!avatar) {
      await t.rollback();
      return res.status(404).json({ message: 'Avatar not found' });
    }
    await avatar.update({ baseImage, accessories, colors, outfit, mood, xp, level }, { transaction: t });
    await t.commit();
    res.json(avatar);
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: 'Error updating avatar', error });
  }
};

export const getUserInventory = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const inventory = await Inventory.findAll({
      where: { userId },
      include: [{ model: Item }],
    });
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching inventory', error });
  }
};

export const addItemToInventory = async (req: Request, res: Response) => {
  try {
    const { userId, itemId } = req.body;
    const [inventory, created] = await Inventory.findOrCreate({
      where: { userId, itemId },
      defaults: { quantity: 1 },
    });
    if (!created) {
      await inventory.increment('quantity');
    }
    res.status(201).json(inventory);
  } catch (error) {
    res.status(500).json({ message: 'Error adding item to inventory', error });
  }
};

export const getAchievements = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const achievements = await Achievement.findAll({ where: { userId } });
    res.json(achievements);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching achievements', error });
  }
};

export const addAchievement = async (req: Request, res: Response) => {
  try {
    const { userId, achievementId } = req.body;
    const achievement = await Achievement.create({ userId, achievementId });
    res.status(201).json(achievement);
  } catch (error) {
    res.status(500).json({ message: 'Error adding achievement', error });
  }
};

export const updateXpAndLevel = async (req: Request, res: Response) => {
  const t = await sequelize.transaction();
  try {
    const { userId } = req.params;
    const { xpGained } = req.body;
    const avatar = await Avatar.findOne({ where: { userId }, transaction: t });
    if (!avatar) {
      await t.rollback();
      return res.status(404).json({ message: 'Avatar not found' });
    }
    
    let newXp = avatar.xp + xpGained;
    let newLevel = avatar.level;
    
    while (newXp >= newLevel * 100) {
      newXp -= newLevel * 100;
      newLevel++;
    }
    
    await avatar.update({ xp: newXp, level: newLevel }, { transaction: t });
    await t.commit();
    res.json({ xp: newXp, level: newLevel });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: 'Error updating XP and level', error });
  }
};

export const updateAvatarEmotion = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { emotion, intensity } = req.body;
    const avatar = await Avatar.findOne({ where: { userId } });
    if (!avatar) {
      return res.status(404).json({ message: 'Avatar not found' });
    }
    await avatar.update({ emotion, emotionIntensity: intensity });
    res.json(avatar);
  } catch (error) {
    res.status(500).json({ message: 'Error updating avatar emotion', error });
  }
};

export const getAvatarEmotion = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const avatar = await Avatar.findOne({ where: { userId } });
    if (!avatar) {
      return res.status(404).json({ message: 'Avatar not found' });
    }
    res.json({ emotion: avatar.emotion, intensity: avatar.emotionIntensity });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching avatar emotion', error });
  }
};

export const updateAvatarBackground = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { backgroundId } = req.body;
    const avatar = await Avatar.findOne({ where: { userId } });
    if (!avatar) {
      return res.status(404).json({ message: 'Avatar not found' });
    }
    await avatar.update({ background: backgroundId });
    res.json(avatar);
  } catch (error) {
    res.status(500).json({ message: 'Error updating avatar background', error });
  }
};

export const updateAvatarMood = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { mood } = req.body;
    const avatar = await Avatar.findOne({ where: { userId } });
    if (!avatar) {
      return res.status(404).json({ message: 'Avatar not found' });
    }
    await avatar.update({ mood });
    res.json(avatar);
  } catch (error) {
    res.status(500).json({ message: 'Error updating avatar mood', error });
  }
};

// Add interactive avatar features
export const updateAvatarInteraction = async (req: Request, res: Response) => {
  const t = await sequelize.transaction();
  try {
    const { userId } = req.params;
    const { interactionType, context } = req.body;
    
    const avatar = await Avatar.findOne({ where: { userId }, transaction: t });
    if (!avatar) {
      await t.rollback();
      return res.status(404).json({ message: 'Avatar not found' });
    }

    // Process emotional response
    const emotionalResponse = await processAvatarEmotion(interactionType, context);
    const newMood = calculateNewMood(avatar.mood, emotionalResponse);
    
    // Update avatar state
    await avatar.update({
      mood: newMood,
      emotionIntensity: emotionalResponse.intensity,
      lastInteraction: new Date()
    }, { transaction: t });

    // Generate animation data
    const animationData = generateEmotionAnimation(newMood, emotionalResponse.intensity);
    
    await t.commit();
    res.json({ avatar, animationData });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: 'Error updating avatar interaction', error });
  }
};

// Add new functions to handle avatar interactions
export const handleDailyReward = async (req: Request, res: Response) => {
  const t = await sequelize.transaction();
  try {
    const { userId } = req.params;
    const avatar = await Avatar.findOne({ where: { userId }, transaction: t });
    
    if (!avatar) {
      await t.rollback();
      return res.status(404).json({ message: 'Avatar not found' });
    }

    const now = new Date();
    const lastReward = new Date(avatar.lastDailyReward);
    const timeDiff = now.getTime() - lastReward.getTime();
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    if (daysDiff < 1) {
      await t.rollback();
      return res.status(400).json({ message: 'Daily reward already claimed' });
    }

    // Calculate streak
    const newStreakCount = daysDiff === 1 ? avatar.streakCount + 1 : 1;
    const baseReward = 100;
    const streakBonus = Math.floor(newStreakCount / 5) * 50;
    const totalReward = baseReward + streakBonus;

    await avatar.update({
      xp: avatar.xp + totalReward,
      lastDailyReward: now,
      streakCount: newStreakCount,
      energy: Math.min(avatar.energy + 25, 100),
      happiness: Math.min(avatar.happiness + 10, 100),
    }, { transaction: t });

    await t.commit();
    res.json({ 
      reward: totalReward, 
      streakCount: newStreakCount, 
      nextStreakBonus: Math.floor((newStreakCount + 1) / 5) * 50 
    });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: 'Error processing daily reward', error });
  }
};

export const trainAvatarStat = async (req: Request, res: Response) => {
  const t = await sequelize.transaction();
  try {
    const { userId } = req.params;
    const { stat } = req.body;
    
    const avatar = await Avatar.findOne({ where: { userId }, transaction: t });
    if (!avatar) {
      await t.rollback();
      return res.status(404).json({ message: 'Avatar not found' });
    }

    if (avatar.energy < 10) {
      await t.rollback();
      return res.status(400).json({ message: 'Not enough energy' });
    }

    const stats = { ...avatar.stats };
    stats[stat] = Math.min(stats[stat] + 1, 100);

    await avatar.update({
      stats,
      energy: avatar.energy - 10,
      xp: avatar.xp + 25
    }, { transaction: t });

    await t.commit();
    res.json({ stats, energy: avatar.energy, xp: avatar.xp });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: 'Error training avatar', error });
  }
};

export const restAvatar = async (req: Request, res: Response) => {
  const t = await sequelize.transaction();
  try {
    const { userId } = req.params;
    const avatar = await Avatar.findOne({ where: { userId }, transaction: t });
    
    if (!avatar) {
      await t.rollback();
      return res.status(404).json({ message: 'Avatar not found' });
    }

    const energyGain = Math.min(avatar.energy + 50, 100);
    await avatar.update({ 
      energy: energyGain,
      lastInteraction: new Date()
    }, { transaction: t });

    await t.commit();
    res.json({ energy: energyGain });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: 'Error resting avatar', error });
  }
};
