import { Request, Response } from 'express';
import { Survey } from '../models/Survey';
// Import other models as needed (Discussion, LearningModule, etc.)

class SearchController {
  public async globalSearch(req: Request, res: Response) {
    try {
      const { q } = req.query;
      if (typeof q !== 'string') {
        return res.status(400).json({ message: 'Invalid search query' });
      }

      // Perform basic search across different content types
      const surveys = await Survey.find({ $text: { $search: q } }).limit(5);
      // Add similar searches for other content types

      const results = {
        surveys,
        // Add other content type results here
      };

      res.json(results);
    } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({ message: 'Error performing search' });
    }
  }
}

export default new SearchController();