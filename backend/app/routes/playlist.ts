import { Router } from 'express';
import { z } from 'zod';
import { playlistService } from '../services/playlist.service';
import { requireAuth } from '../middleware/auth';

const router = Router();

const PlaylistParamsSchema = z.object({
  playlistId: z.string()
});

router.get('/:playlistId', requireAuth, async (req, res) => {
  try {
    const { playlistId } = PlaylistParamsSchema.parse(req.params);
    const playlist = await playlistService.getPlaylistData(playlistId);
    res.json(playlist);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Failed to fetch playlist' });
  }
});

// ... other routes

export default router; 