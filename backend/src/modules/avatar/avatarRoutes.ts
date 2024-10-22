import { Router } from 'express';
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
  updateAvatarBackground,
  updateAvatarMood,
  handleDailyReward,
  trainAvatarStat,
  restAvatar
} from './avatarController';
import { authenticateJWT } from '../../middleware/auth';
import { validateRequest } from '../../middleware/validateRequest';
import { body, param } from 'express-validator';

const router = Router();

const createAvatarSchema = [
  body('userId').isUUID(),
  body('baseImage').isString().notEmpty(),
  body('accessories').isArray(),
  body('colors').isObject(),
  body('outfit').optional().isString(),
];

const updateAvatarSchema = [
  param('userId').isUUID(),
  body('baseImage').optional().isString(),
  body('accessories').optional().isArray(),
  body('colors').optional().isObject(),
  body('outfit').optional().isString(),
  body('mood').optional().isString(),
  body('xp').optional().isInt(),
  body('level').optional().isInt(),
];

const updateXpSchema = [
  param('userId').isUUID(),
  body('xpGained').isInt({ min: 0 }),
];

const updateEmotionSchema = [
  param('userId').isUUID(),
  body('emotion').isString().notEmpty(),
  body('intensity').isInt({ min: 1, max: 10 }),
];

router.post('/avatar', authenticateJWT, createAvatarSchema, validateRequest, createAvatar);
router.get('/avatar/:userId', authenticateJWT, param('userId').isUUID(), validateRequest, getAvatar);
router.put('/avatar/:userId', authenticateJWT, updateAvatarSchema, validateRequest, updateAvatar);
router.get('/inventory/:userId', authenticateJWT, param('userId').isUUID(), validateRequest, getUserInventory);
router.post('/inventory', authenticateJWT, body('userId').isUUID(), body('itemId').isInt(), validateRequest, addItemToInventory);
router.get('/achievements/:userId', authenticateJWT, param('userId').isUUID(), validateRequest, getAchievements);
router.post('/achievements', authenticateJWT, body('userId').isUUID(), body('achievementId').isInt(), validateRequest, addAchievement);
router.put('/avatar/:userId/xp', authenticateJWT, updateXpSchema, validateRequest, updateXpAndLevel);
router.put('/avatar/:userId/emotion', authenticateJWT, updateEmotionSchema, validateRequest, updateAvatarEmotion);
router.get('/avatar/:userId/emotion', authenticateJWT, param('userId').isUUID(), validateRequest, getAvatarEmotion);
router.put('/avatar/:userId/background', authenticateJWT, param('userId').isUUID(), body('backgroundId').isString(), validateRequest, updateAvatarBackground);
router.put('/avatar/:userId/mood', authenticateJWT, param('userId').isUUID(), body('mood').isString(), validateRequest, updateAvatarMood);
router.post('/avatar/:userId/daily-reward', authenticateJWT, param('userId').isUUID(), validateRequest, handleDailyReward);
router.post('/avatar/:userId/train', 
  authenticateJWT, 
  [
    param('userId').isUUID(),
    body('stat').isIn(['strength', 'agility', 'intelligence', 'charisma'])
  ],
  validateRequest,
  trainAvatarStat
);
router.post('/avatar/:userId/rest', authenticateJWT, param('userId').isUUID(), validateRequest, restAvatar);

export default router;
