import express from 'express';
import { login, register, refreshToken } from '../controllers/authController';

const router = express.Router();

// Login Route
router.post('/login', login);

// Register Route
router.post('/register', register);

// Refresh Token Route
router.post('/refresh-token', refreshToken);

export default router;