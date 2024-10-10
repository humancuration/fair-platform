import express from 'express';
import SurveyController from '../controllers/SurveyController';
import { authenticateJWT } from '../middleware/auth';

const router = express.Router();

// ... existing routes ...

router.post('/:surveyId/link-content', authenticateJWT, SurveyController.linkContent);
router.get('/:surveyId/linked-content', authenticateJWT, SurveyController.getLinkedContent);

export default router;