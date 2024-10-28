import { Request, Response } from 'express';
import { createGiteaRepository, getGiteaIssues } from './giteaService';
import { triggerDroneBuild, _getDroneBuildStatus } from '../../services/droneService';
import { PrismaClient } from '@prisma/client';
import { json } from '@remix-run/node';

const prisma = new PrismaClient();

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

export class VersionControlService {
  // Track changes for any entity
  async trackChange<T extends { id: string }>({
    entityId,
    entityType,
    changes,
    userId,
  }: {
    entityId: string;
    entityType: 'playlist' | 'product' | 'marketplace',
    changes: Partial<T>,
    userId: string;
  }) {
    return await prisma.changeHistory.create({
      data: {
        entityId,
        entityType,
        changes: changes as any, // Prisma will handle JSON serialization
        userId,
        timestamp: new Date(),
      }
    });
  }

  // Get version history
  async getVersionHistory(entityId: string) {
    return await prisma.changeHistory.findMany({
      where: { entityId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          }
        }
      },
      orderBy: {
        timestamp: 'desc'
      }
    });
  }

  // Revert to specific version
  async revertToVersion(entityId: string, versionId: string) {
    const version = await prisma.changeHistory.findUnique({
      where: { id: versionId }
    });

    if (!version) {
      throw new Error('Version not found');
    }

    // Perform the revert based on entity type
    switch (version.entityType) {
      case 'playlist':
        await prisma.playlist.update({
          where: { id: entityId },
          data: version.changes as any
        });
        break;
      // Add other entity types as needed
    }

    return json({ success: true });
  }
}
