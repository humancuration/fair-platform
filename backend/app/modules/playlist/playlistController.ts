import { Request, Response } from 'express';
import Playlist from './playlistModel';
import { v4 as uuidv4 } from 'uuid';

export const createPlaylist = async (req: Request, res: Response) => {
  try {
    const { name, description, groupId } = req.body;
    const ownerId = req.user.id; // Assuming the user ID is attached to the request by the auth middleware

    const playlist = await Playlist.create({
      name,
      description,
      ownerId,
      groupId,
    });

    res.status(201).json(playlist);
  } catch (error) {
    res.status(500).json({ message: 'Error creating playlist', error });
  }
};

export const getPlaylists = async (req: Request, res: Response) => {
  try {
    const ownerId = req.user.id;
    const playlists = await Playlist.findAll({ where: { ownerId } });
    res.json(playlists);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching playlists', error });
  }
};

export const getPlaylistById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const playlist = await Playlist.findByPk(id);
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }
    res.json(playlist);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching playlist', error });
  }
};

export const updatePlaylist = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const playlist = await Playlist.findByPk(id);
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }
    await playlist.update({ name, description });
    res.json(playlist);
  } catch (error) {
    res.status(500).json({ message: 'Error updating playlist', error });
  }
};

export const deletePlaylist = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const playlist = await Playlist.findByPk(id);
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }
    await playlist.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting playlist', error });
  }
};

export const addMediaItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { type, title, url } = req.body;
    const playlist = await Playlist.findByPk(id);
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }
    const newMediaItem = { id: uuidv4(), type, title, url };
    playlist.mediaItems = [...playlist.mediaItems, newMediaItem];
    await playlist.save();
    res.status(201).json(newMediaItem);
  } catch (error) {
    res.status(500).json({ message: 'Error adding media item', error });
  }
};

export const reorderMediaItems = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { mediaItems } = req.body;
    const playlist = await Playlist.findByPk(id);
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }
    playlist.mediaItems = mediaItems;
    await playlist.save();
    res.json(playlist);
  } catch (error) {
    res.status(500).json({ message: 'Error reordering media items', error });
  }
};

export const removeMediaItem = async (req: Request, res: Response) => {
  try {
    const { id, mediaId } = req.params;
    const playlist = await Playlist.findByPk(id);
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }
    playlist.mediaItems = playlist.mediaItems.filter(item => item.id !== mediaId);
    await playlist.save();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error removing media item', error });
  }
};

export const sharePlaylist = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { groupId } = req.body;
    const playlist = await Playlist.findByPk(id);
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }
    playlist.groupId = groupId;
    await playlist.save();
    res.json(playlist);
  } catch (error) {
    res.status(500).json({ message: 'Error sharing playlist', error });
  }
};
