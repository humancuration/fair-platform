import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { getTracks } from '~/services/music.server';
import EnhancedMusicPlayer from '~/components/music/EnhancedMusicPlayer';
import { MusicProvider } from '~/contexts/music';

export const loader: LoaderFunction = async () => {
  const tracks = await getTracks();
  return json({ tracks });
};

export default function PlayerRoute() {
  const { tracks } = useLoaderData<typeof loader>();

  return (
    <MusicProvider>
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900">
        <div className="container mx-auto py-8">
          <h1 className="text-4xl font-bold text-white mb-8">Music Player</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tracks.map(track => (
              <div
                key={track.id}
                className="bg-white/10 p-4 rounded-lg backdrop-blur-lg"
              >
                <img
                  src={track.coverArt}
                  alt={track.title}
                  className="w-full aspect-square object-cover rounded-lg mb-4"
                />
                <h3 className="text-white font-bold">{track.title}</h3>
                <p className="text-gray-300">{track.artist}</p>
              </div>
            ))}
          </div>
        </div>

        <EnhancedMusicPlayer />
      </div>
    </MusicProvider>
  );
}
