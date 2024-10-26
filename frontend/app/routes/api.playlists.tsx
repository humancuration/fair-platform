import { json, type LoaderFunction, type ActionFunction } from '@remix-run/node';
import { prisma } from '~/lib/db.server';

export const loader: LoaderFunction = async ({ request }) => {
  const playlists = await prisma.playlist.findMany({
    include: {
      mediaItems: true,
    },
  });
  
  return json(playlists);
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const groupId = formData.get('groupId') as string | undefined;

  const playlist = await prisma.playlist.create({
    data: {
      name,
      description,
      groupId,
      // Add other fields as needed
    },
    include: {
      mediaItems: true,
    },
  });

  return json(playlist);
};
