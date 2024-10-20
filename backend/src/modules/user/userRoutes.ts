import express from 'express';
import UserController from '../../controllers/userController';
import { authenticateJWT } from '../../middleware/auth';

const router = express.Router();

router.get('/data', authenticateJWT, UserController.getUserData);
router.delete('/data/:dataType', authenticateJWT, UserController.deleteUserData);
router.get('/settings', authenticateJWT, UserController.getSettings);
router.patch('/settings', authenticateJWT, UserController.updateSettings);

export default router;
