import express from 'express';
import { triggerWorkflow, getWorkflowStatus } from '../controllers/n8nController';
import auth from '../middleware/auth';

const router = express.Router();

router.post('/trigger', auth, triggerWorkflow);
router.get('/status/:workflowId', auth, getWorkflowStatus);

export default router;