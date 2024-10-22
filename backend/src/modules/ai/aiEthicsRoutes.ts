import { Router } from 'express';
import { createAIEthicsCourseHandler, addReflectionActivityHandler } from './aiEthicsController';
import { authenticateJWT } from '../../middleware/auth';
import { body } from 'express-validator';
import { validateRequest } from '../../middleware/validateRequest';

const router = Router();

const createCourseSchema = [
  body('title').isString().notEmpty(),
  body('description').isString().notEmpty(),
  // Add more validation as needed
];

const addActivitySchema = [
  body('courseId').isInt(),
  body('sectionId').isInt(),
  body('reflectionPrompt').isString().notEmpty(),
];

router.post(
  '/courses',
  authenticateJWT,
  createCourseSchema,
  validateRequest,
  createAIEthicsCourseHandler
);

router.post(
  '/activities',
  authenticateJWT,
  addActivitySchema,
  validateRequest,
  addReflectionActivityHandler
);

export default router;
