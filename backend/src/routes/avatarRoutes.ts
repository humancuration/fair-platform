import express from 'express';
import { 
  createAvatar, 
  getAvatar, 
  updateAvatar, 
  getUserInventory, 
  addItemToInventory, 
  getAchievements, 
  addAchievement,
  updateXpAndLevel
} from '../controllers/avatarController';
import { authenticateJWT, AuthRequest } from '../middleware/auth';

const router = express.Router();

router.post('/avatar', authenticateJWT, (req: AuthRequest, res) => createAvatar(req, res));
router.get('/avatar/:userId', authenticateJWT, (req: AuthRequest, res) => getAvatar(req, res));
router.put('/avatar/:userId', authenticateJWT, (req: AuthRequest, res) => updateAvatar(req, res));
router.get('/inventory/:userId', authenticateJWT, (req: AuthRequest, res) => getUserInventory(req, res));
router.post('/inventory', authenticateJWT, (req: AuthRequest, res) => addItemToInventory(req, res));
router.get('/achievements/:userId', authenticateJWT, (req: AuthRequest, res) => getAchievements(req, res));
router.post('/achievements', authenticateJWT, (req: AuthRequest, res) => addAchievement(req, res));
router.put('/avatar/:userId/xp', authenticateJWT, (req: AuthRequest, res) => updateXpAndLevel(req, res));

// No changes needed unless adding specific outfit routes

export default router;
