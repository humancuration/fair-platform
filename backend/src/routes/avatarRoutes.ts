import express from 'express';
import { createAvatar, getAvatar, updateAvatar, getUserInventory, addItemToInventory } from '../controllers/avatarController';
import { authenticateJWT } from '../middleware/auth'; // Assuming you have an authentication middleware

const router = express.Router();

router.post('/avatar', authenticateJWT, createAvatar);
router.get('/avatar/:userId', authenticateJWT, getAvatar);
router.put('/avatar/:userId', authenticateJWT, updateAvatar);
router.get('/inventory/:userId', authenticateJWT, getUserInventory);
router.post('/inventory', authenticateJWT, addItemToInventory);

export default router;
