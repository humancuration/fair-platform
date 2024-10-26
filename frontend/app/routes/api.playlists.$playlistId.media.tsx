import { json, type ActionFunction } from '@remix-run/node';
import { prisma } from '../db.server';

export const action: ActionFunction = async ({ request, params }) => {
  const { playlistId } = params;
  const formData = await request.formData();
  const mediaItem = JSON.parse(formData.get('mediaItem') as string);

  const updatedPlaylist = await prisma.playlist.update({
    where: {
      id: playlistId,
    },
    data: {
      mediaItems: {
        create: mediaItem,
      },
    },
    include: {
      mediaItems: true,
    },
  });

  return json(updatedPlaylist);
};
