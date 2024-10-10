import fs from 'fs';
import path from 'path';
import ReactDOMServer from 'react-dom/server';
import AffiliateLinksPage from '../../frontend/src/pages/AffiliateLinksPage';

export const generateStaticFiles = async () => {
  // Generate HTML
  const html = ReactDOMServer.renderToStaticMarkup(<AffiliateLinksPage />);
  
  // Read CSS and JS files
  const css = fs.readFileSync(path.join(__dirname, '../../frontend/src/styles.css'), 'utf-8');
  const js = fs.readFileSync(path.join(__dirname, '../../frontend/src/scripts.js'), 'utf-8');

  return { html, css, js };
};