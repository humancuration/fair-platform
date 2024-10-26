import type { ActionFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { prisma } from '~/utils/db.server';
import PlaylistForm from '~/components/forms/PlaylistForm';

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const title = formData.get('title');
  const description = formData.get('description');
  const isPublic = formData.get('isPublic') === 'on';

  if (!title) {
    return json({ error: 'Title is required' }, { status: 400 });
  }

  try {
    const playlist = await prisma.playlist.create({
      data: {
        title: title.toString(),
        description: description?.toString() || '',
        isPublic,
        // Add other fields as needed
      },
    });

    return redirect(`/playlists/${playlist.id}`);
  } catch (error) {
    console.error('Failed to create playlist:', error);
    return json({ error: 'Failed to create playlist' }, { status: 500 });
  }
};

export default function NewPlaylist() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Create New Playlist</h1>
      <PlaylistForm />
    </div>
  );
}
