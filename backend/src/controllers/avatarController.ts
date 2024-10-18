import { Request, Response } from 'express';
import { Avatar } from '../models/Avatar';
import { Inventory } from '../models/Inventory';
import { Item } from '../models/Item';
import { Achievement } from '../models/Achievement';

export const createAvatar = async (req: Request, res: Response) => {
  try {
    const { userId, baseImage, accessories, colors, outfit } = req.body;
    const avatar = await Avatar.create({ userId, baseImage, accessories, colors, outfit });
    res.status(201).json(avatar);
  } catch (error) {
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
  try {
    const { userId } = req.params;
    const { baseImage, accessories, colors, outfit, mood, xp, level } = req.body;
    const avatar = await Avatar.findOne({ where: { userId } });
    if (!avatar) {
      return res.status(404).json({ message: 'Avatar not found' });
    }
    await avatar.update({ baseImage, accessories, colors, outfit, mood, xp, level });
    res.json(avatar);
  } catch (error) {
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
  try {
    const { userId } = req.params;
    const { xpGained } = req.body;
    const avatar = await Avatar.findOne({ where: { userId } });
    if (!avatar) {
      return res.status(404).json({ message: 'Avatar not found' });
    }
    
    let newXp = avatar.xp + xpGained;
    let newLevel = avatar.level;
    
    while (newXp >= newLevel * 100) {
      newXp -= newLevel * 100;
      newLevel++;
    }
    
    await avatar.update({ xp: newXp, level: newLevel });
    res.json({ xp: newXp, level: newLevel });
  } catch (error) {
    res.status(500).json({ message: 'Error updating XP and level', error });
  }
};
