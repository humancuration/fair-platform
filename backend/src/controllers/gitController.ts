import { Request, Response } from 'express';
import { createGiteaRepository, getGiteaIssues } from '../services/giteaService';
import { triggerDroneBuild, _getDroneBuildStatus } from '../services/droneService';

export const createRepository = async (req: Request, res: Response) => {
  try {
    const repoData = req.body;
    const repository = await createGiteaRepository(repoData);
    res.status(201).json(repository);
  } catch (error) {
    console.error('Error creating repository:', error);
    res.status(500).json({ message: 'Error creating repository' });
  }
};

export const getIssues = async (req: Request, res: Response) => {
  try {
    const { owner, repo } = req.params;
    const issues = await getGiteaIssues(owner, repo);
    res.status(200).json(issues);
  } catch (error) {
    console.error('Error fetching issues:', error);
    res.status(500).json({ message: 'Error fetching issues' });
  }
};

export const triggerBuild = async (req: Request, res: Response) => {
  try {
    const { repo, branch } = req.body;
    const build = await triggerDroneBuild(repo, branch);
    res.status(200).json(build);
  } catch (error) {
    console.error('Error triggering build:', error);
    res.status(500).json({ message: 'Error triggering build' });
  }
};