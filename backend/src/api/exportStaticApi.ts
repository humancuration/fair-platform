import express from 'express';
import { generateStaticFiles } from '@services/staticExportService';

const router = express.Router();

router.post('/export-static', async (_, res) => {
  try {
    const staticFiles = await generateStaticFiles();
    res.json(staticFiles);
  } catch (error) {
    console.error('Error generating static files:', error);
    res.status(500).json({ message: 'Failed to export static files.' });
  }
});

export default router;
