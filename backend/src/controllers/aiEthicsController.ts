import { Request, Response } from 'express';
import { createAIEthicsCourse, addReflectionActivity } from '../services/moodleService';

export const createAIEthicsCourseHandler = async (req: Request, res: Response) => {
  try {
    const courseData = req.body;
    const course = await createAIEthicsCourse(courseData);
    res.status(201).json(course);
  } catch (error) {
    console.error('Error creating AI Ethics course:', error);
    res.status(500).json({ message: 'Error creating course' });
  }
};

export const addReflectionActivityHandler = async (req: Request, res: Response) => {
  try {
    const { courseId, sectionId, reflectionPrompt } = req.body;
    const activity = await addReflectionActivity(courseId, sectionId, reflectionPrompt);
    res.status(201).json(activity);
  } catch (error) {
    console.error('Error adding reflection activity:', error);
    res.status(500).json({ message: 'Error adding activity' });
  }
};