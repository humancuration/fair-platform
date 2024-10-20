import fs from 'fs';
import path from 'path';
import ReactDOMServer from 'react-dom/server';
import AffiliateLinksPage from '../../frontend/src/pages/AffiliateLinksPage';
import logger from '../../utils/logger';

interface StaticFiles {
  html: string;
  css: string;
  js: string;
}

export const generateStaticFiles = async (): Promise<StaticFiles> => {
  try {
    // Generate HTML
    const html = ReactDOMServer.renderToStaticMarkup(<AffiliateLinksPage />);
    
    // Read CSS and JS files
    const css = await fs.promises.readFile(path.join(__dirname, '../../frontend/src/styles.css'), 'utf-8');
    const js = await fs.promises.readFile(path.join(__dirname, '../../frontend/src/scripts.js'), 'utf-8');

    logger.info('Static files generated successfully');
    return { html, css, js };
  } catch (error) {
    logger.error('Error generating static files:', error);
    throw new Error(`Failed to generate static files: ${error.message}`);
  }
};

export const writeStaticFiles = async (outputDir: string, files: StaticFiles): Promise<void> => {
  try {
    await fs.promises.mkdir(outputDir, { recursive: true });
    await Promise.all([
      fs.promises.writeFile(path.join(outputDir, 'index.html'), files.html),
      fs.promises.writeFile(path.join(outputDir, 'styles.css'), files.css),
      fs.promises.writeFile(path.join(outputDir, 'scripts.js'), files.js),
    ]);
    logger.info(`Static files written to ${outputDir}`);
  } catch (error) {
    logger.error('Error writing static files:', error);
    throw new Error(`Failed to write static files: ${error.message}`);
  }
};
