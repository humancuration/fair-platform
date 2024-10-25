import { createRequestHandler } from '@remix-run/express';
import { ServerBuild } from '@remix-run/node';
import { renderToString } from 'react-dom/server';
import { logger } from '../../utils/logger';
import path from 'path';
import fs from 'fs/promises';

interface StaticExportOptions {
  build: ServerBuild;
  remixRoot: string;
  outputDir: string;
}

export class StaticExportService {
  async exportMinsite(slug: string, options: StaticExportOptions) {
    try {
      const { build, remixRoot, outputDir } = options;
      
      // Create request handler
      const handler = createRequestHandler(build, process.env.NODE_ENV);
      
      // Simulate request to get Remix response
      const request = new Request(`http://localhost/m/${slug}`);
      const response = await handler(request);
      
      // Get HTML content
      const html = await response.text();
      
      // Ensure output directory exists
      const minsiteDir = path.join(outputDir, slug);
      await fs.mkdir(minsiteDir, { recursive: true });
      
      // Write files
      await Promise.all([
        fs.writeFile(path.join(minsiteDir, 'index.html'), html),
        this.copyAssets(remixRoot, minsiteDir),
      ]);

      logger.info(`Static export completed for minsite: ${slug}`);
      return minsiteDir;
    } catch (error) {
      logger.error('Error in static export:', error);
      throw error;
    }
  }

  private async copyAssets(remixRoot: string, outputDir: string) {
    const publicDir = path.join(remixRoot, 'public');
    const buildDir = path.join(remixRoot, 'build');
    
    await Promise.all([
      fs.cp(publicDir, outputDir, { recursive: true }),
      fs.cp(buildDir, path.join(outputDir, 'build'), { recursive: true }),
    ]);
  }
}
