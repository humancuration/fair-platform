import { Request, Response } from 'express';
import { createAIEthicsCourse, addReflectionActivity } from '../../services/moodleService';
import { AppError } from '../../utils/errors';
import logger from '../../utils/logger';

export const createAIEthicsCourseHandler = async (req: Request, res: Response) => {
  try {
    const courseData = req.body;
    const course = await createAIEthicsCourse(courseData);
    res.status(201).json(course);
  } catch (error) {
    logger.error('Error creating AI Ethics course:', error);
    throw new AppError('Error creating course', 500);
  }
};

export const addReflectionActivityHandler = async (req: Request, res: Response) => {
  try {
    const { courseId, sectionId, reflectionPrompt } = req.body;
    const activity = await addReflectionActivity(courseId, sectionId, reflectionPrompt);
    res.status(201).json(activity);
  } catch (error) {
    logger.error('Error adding reflection activity:', error);
    throw new AppError('Error adding activity', 500);
  }
};

// Add new AI-powered features
export const getPersonalizedLearningPath = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const userPreferences = await getUserPreferences(userId);
    const learningPath = await generatePersonalizedPath(userPreferences);
    res.status(200).json(learningPath);
  } catch (error) {
    logger.error('Error generating learning path:', error);
    throw new AppError('Error generating learning path', 500);
  }
};

export const getAIFeedback = async (req: Request, res: Response) => {
  try {
    const { submissionId } = req.params;
    const submission = await getSubmission(submissionId);
    const feedback = await generateAIFeedback(submission);
    res.status(200).json(feedback);
  } catch (error) {
    logger.error('Error generating AI feedback:', error);
    throw new AppError('Error generating feedback', 500);
  }
};
