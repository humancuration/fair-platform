import express from 'express';
import * as playlistController from './playlistController';
import { authenticateJWT } from '../../middleware/authMiddleware';

const router = express.Router();

router.use(authenticateJWT);

router.post('/', playlistController.createPlaylist);
router.get('/', playlistController.getPlaylists);
router.get('/:id', playlistController.getPlaylistById);
router.put('/:id', playlistController.updatePlaylist);
router.delete('/:id', playlistController.deletePlaylist);
router.post('/:id/media', playlistController.addMediaItem);
router.put('/:id/media/reorder', playlistController.reorderMediaItems);
router.delete('/:id/media/:mediaId', playlistController.removeMediaItem);
router.post('/:id/share', playlistController.sharePlaylist);

export default router;
