import { Repository, Commit } from '../types';
import { getLog } from '../versionControlService';
import logger from '../../../utils/logger';

interface CommitStats {
  totalCommits: number;
  commitsByAuthor: Record<string, number>;
  commitsByDay: Record<string, number>;
  averageCommitsPerDay: number;
}

interface FileStats {
  totalFiles: number;
  filesByType: Record<string, number>;
  totalSize: number;
  largestFiles: Array<{ name: string; size: number }>;
}

export class RepositoryStatsService {
  async getCommitStats(repository: Repository, days: number = 30): Promise<CommitStats> {
    try {
      const commits = await getLog(repository.name, days * 2); // Fetch more commits to ensure coverage
      const now = new Date();
      const startDate = new Date(now.setDate(now.getDate() - days));

      const commitsByAuthor: Record<string, number> = {};
      const commitsByDay: Record<string, number> = {};
      let totalCommits = 0;

      commits.forEach((commit: Commit) => {
        const commitDate = new Date(commit.author.timestamp);
        if (commitDate >= startDate) {
          // Count by author
          const author = commit.author.email;
          commitsByAuthor[author] = (commitsByAuthor[author] || 0) + 1;

          // Count by day
          const dayKey = commitDate.toISOString().split('T')[0];
          commitsByDay[dayKey] = (commitsByDay[dayKey] || 0) + 1;

          totalCommits++;
        }
      });

      const averageCommitsPerDay = totalCommits / days;

      return {
        totalCommits,
        commitsByAuthor,
        commitsByDay,
        averageCommitsPerDay
      };
    } catch (error) {
      logger.error('Error getting commit stats:', error);
      throw new Error('Failed to get commit statistics');
    }
  }

  async getFileStats(repository: Repository): Promise<FileStats> {
    try {
      // Implementation would depend on your storage system
      // This is a placeholder structure
      return {
        totalFiles: 0,
        filesByType: {},
        totalSize: 0,
        largestFiles: []
      };
    } catch (error) {
      logger.error('Error getting file stats:', error);
      throw new Error('Failed to get file statistics');
    }
  }
}

export const repositoryStatsService = new RepositoryStatsService();
