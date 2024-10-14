import { Request, Response } from 'express';
import { Avatar } from '../models/Avatar';
import { Inventory } from '../models/Inventory';
import { Item } from '../models/Item';

export const createAvatar = async (req: Request, res: Response) => {
  try {
    const { userId, baseImage, accessories, colors } = req.body;
    const avatar = await Avatar.create({ userId, baseImage, accessories, colors });
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
    const { baseImage, accessories, colors } = req.body;
    const avatar = await Avatar.findOne({ where: { userId } });
    if (!avatar) {
      return res.status(404).json({ message: 'Avatar not found' });
    }
    await avatar.update({ baseImage, accessories, colors });
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
