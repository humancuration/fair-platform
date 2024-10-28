import { Router } from 'express';
import { getRecommendations } from '../../controllers/aiController';
import { authenticateJWT } from '../../middleware/auth';
import { query } from 'express-validator';
import { validateRequest } from '../../middleware/validateRequest';

const router = Router();

const getRecommendationsSchema = [
  query('user_id').isInt().notEmpty(),
];

router.get(
  '/recommendations',
  authenticateJWT,
  getRecommendationsSchema,
  validateRequest,
  getRecommendations
);

export default router;
 