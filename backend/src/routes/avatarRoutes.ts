import express from 'express';
import { 
  createAvatar, 
  getAvatar, 
  updateAvatar, 
  getUserInventory, 
  addItemToInventory, 
  getAchievements, 
  addAchievement,
  updateXpAndLevel,
  updateAvatarEmotion,
  getAvatarEmotion,
  updateAvatarBackground
} from '../controllers/avatarController';
import { authenticateJWT } from '../middleware/auth';

const router = express.Router();

// Update the route handlers to use the correct request type
router.post('/avatar', authenticateJWT, createAvatar);
router.get('/avatar/:userId', authenticateJWT, getAvatar);
router.put('/avatar/:userId', authenticateJWT, updateAvatar);
router.get('/inventory/:userId', authenticateJWT, getUserInventory);
router.post('/inventory', authenticateJWT, addItemToInventory);
router.get('/achievements/:userId', authenticateJWT, getAchievements);
router.post('/achievements', authenticateJWT, addAchievement);
router.put('/avatar/:userId/xp', authenticateJWT, updateXpAndLevel);
router.put('/avatar/:userId/emotion', authenticateJWT, updateAvatarEmotion);
router.get('/avatar/:userId/emotion', authenticateJWT, getAvatarEmotion);
router.put('/avatar/:userId/background', authenticateJWT, updateAvatarBackground);

// No changes needed unless adding specific outfit routes

export default router;
