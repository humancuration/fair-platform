import { SimpleGit, simpleGit } from 'simple-git';
import { db } from "~/utils/db.server";
import type { PlaylistVersion } from "~/types/version";
import * as fs from 'fs';

export class RepositoryService {
  private git: SimpleGit;
  private basePath: string;

  constructor(basePath: string) {
    this.basePath = basePath;
    this.git = simpleGit(basePath);
  }

  async initRepository(playlistId: string): Promise<void> {
    const repoPath = `${this.basePath}/${playlistId}`;
    await this.git.cwd(repoPath);
    
    // Initialize if not already a git repo
    const isRepo = await this.git.checkIsRepo();
    if (!isRepo) {
      await this.git.init();
      // Create initial commit with empty playlist structure
      await this.git.add('.');
      await this.git.commit('Initial playlist structure');
    }
  }

  async createVersion(
    playlistId: string, 
    changes: { added: string[]; removed: string[]; reordered: boolean },
    author: { id: string; name: string; type: 'human' | 'ai' },
    metadata?: {
      aiGenerated?: boolean;
      confidence?: number;
      reason?: string;
    }
  ): Promise<PlaylistVersion> {
    await this.git.cwd(`${this.basePath}/${playlistId}`);

    // Create branch for this version
    const branchName = `version-${Date.now()}`;
    await this.git.checkoutLocalBranch(branchName);

    // Apply changes
    const playlistData = await this.getPlaylistData(playlistId);
    const updatedData = this.applyChanges(playlistData, changes);
    await this.savePlaylistData(playlistId, updatedData);

    // Commit changes
    await this.git.add('.');
    const commitMessage = this.generateCommitMessage(changes, metadata);
    const commitResult = await this.git.commit(commitMessage);

    // Store version in database
    const version = await db.playlistVersion.create({
      data: {
        playlistId,
        parentVersionId: await this.getCurrentVersionId(playlistId),
        changes,
        author: {
          connect: { id: author.id }
        },
        metadata: {
          aiGenerated: metadata?.aiGenerated || false,
          confidence: metadata?.confidence,
          reason: metadata?.reason,
        },
        commitHash: commitResult.commit,
        branchName,
      }
    });

    // Return to main branch
    await this.git.checkout('main');
    return version;
  }

  async createFork(
    playlistId: string,
    userId: string,
    name: string,
    description?: string
  ): Promise<void> {
    const forkPath = `${this.basePath}/forks/${userId}/${playlistId}`;
    
    // Clone original repository
    await this.git.clone(`${this.basePath}/${playlistId}`, forkPath);
    
    // Initialize fork metadata
    await db.playlistFork.create({
      data: {
        name,
        description,
        originalPlaylistId: playlistId,
        userId,
        divergencePoint: await this.getCurrentVersionId(playlistId),
      }
    });
  }

  async mergeFork(
    playlistId: string,
    forkId: string,
    strategy: 'rebase' | 'merge' = 'rebase'
  ): Promise<void> {
    const fork = await db.playlistFork.findUnique({
      where: { id: forkId },
      include: { user: true }
    });

    if (!fork) throw new Error('Fork not found');

    const forkPath = `${this.basePath}/forks/${fork.userId}/${playlistId}`;
    await this.git.cwd(`${this.basePath}/${playlistId}`);

    // Add fork as remote
    await this.git.addRemote(forkId, forkPath);

    if (strategy === 'rebase') {
      await this.git.rebase([`${forkId}/main`]);
    } else {
      await this.git.merge([`${forkId}/main`]);
    }

    // Clean up
    await this.git.removeRemote(forkId);
  }

  private async getPlaylistData(playlistId: string): Promise<any> {
    const filePath = `${this.basePath}/${playlistId}/playlist.json`;
    return JSON.parse(await fs.readFile(filePath, 'utf-8'));
  }

  private async savePlaylistData(playlistId: string, data: any): Promise<void> {
    const filePath = `${this.basePath}/${playlistId}/playlist.json`;
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  }

  private generateCommitMessage(
    changes: { added: string[]; removed: string[]; reordered: boolean },
    metadata?: { aiGenerated?: boolean; reason?: string }
  ): string {
    const parts = [];
    if (changes.added.length) parts.push(`Added ${changes.added.length} tracks`);
    if (changes.removed.length) parts.push(`Removed ${changes.removed.length} tracks`);
    if (changes.reordered) parts.push('Reordered tracks');
    
    let message = parts.join(', ');
    if (metadata?.aiGenerated) {
      message += '\n\nAI-Generated Change';
      if (metadata.reason) message += `\nReason: ${metadata.reason}`;
    }
    
    return message;
  }

  private async getCurrentVersionId(playlistId: string): Promise<string> {
    const currentVersion = await db.playlistVersion.findFirst({
      where: { playlistId },
      orderBy: { createdAt: 'desc' }
    });
    return currentVersion?.id || '';
  }

  private applyChanges(
    playlistData: any,
    changes: { added: string[]; removed: string[]; reordered: boolean }
  ): any {
    // Implementation for applying changes to playlist data
    return playlistData;
  }
}
