import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaPlay, FaPause, FaExpand, FaCompress, 
  FaVolumeMute, FaVolumeUp, FaDownload, FaImage 
} from "react-icons/fa";
import type { MediaAttachment } from "~/types/forum";

interface MediaGalleryProps {
  items: MediaAttachment[];
  onItemClick?: (media: MediaAttachment) => void;
  layout?: 'grid' | 'row' | 'masonry';
  aspectRatio?: 'original' | '16/9' | '4/3' | '1/1';
  maxHeight?: string;
  showControls?: boolean;
  enableTranscoding?: boolean;
}

export function MediaGallery({
  items,
  onItemClick,
  layout = 'grid',
  aspectRatio = 'original',
  maxHeight = '600px',
  showControls = true,
  enableTranscoding = true,
}: MediaGalleryProps) {
  const [activeItem, setActiveItem] = useState<MediaAttachment | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const getGridColumns = (count: number) => {
    if (count === 1) return 'grid-cols-1';
    if (count === 2) return 'grid-cols-2';
    if (count === 3) return 'grid-cols-3';
    if (count === 4) return 'grid-cols-2 md:grid-cols-4';
    return 'grid-cols-2 md:grid-cols-3';
  };

  const handleMediaClick = (media: MediaAttachment) => {
    setActiveItem(media);
    onItemClick?.(media);
  };

  const handleDownload = async (media: MediaAttachment) => {
    if (enableTranscoding) {
      // Request transcoded version if needed
      const transcodedUrl = await requestTranscodedVersion(media);
      window.open(transcodedUrl, '_blank');
    } else {
      window.open(media.url, '_blank');
    }
  };

  const requestTranscodedVersion = async (media: MediaAttachment) => {
    // Request transcoding with desired format/quality
    const response = await fetch(`/api/media/transcode`, {
      method: 'POST',
      body: JSON.stringify({
        url: media.url,
        format: getPreferredFormat(media.type),
        quality: 'high',
      }),
    });
    const { transcodedUrl } = await response.json();
    return transcodedUrl;
  };

  const getPreferredFormat = (type: MediaAttachment['type']) => {
    switch (type) {
      case 'video': return 'mp4';
      case 'audio': return 'mp3';
      case 'image': return 'webp';
      default: return undefined;
    }
  };

  return (
    <>
      <div 
        className={`
          ${layout === 'grid' ? `grid ${getGridColumns(items.length)} gap-2` : ''}
          ${layout === 'row' ? 'flex gap-2 overflow-x-auto' : ''}
          ${layout === 'masonry' ? 'columns-2 md:columns-3 gap-2' : ''}
        `}
        style={{ maxHeight }}
      >
        {items.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
              relative overflow-hidden rounded-lg cursor-pointer
              ${aspectRatio !== 'original' ? `aspect-[${aspectRatio}]` : ''}
              ${layout === 'row' ? 'flex-shrink-0 w-60' : ''}
            `}
            onClick={() => handleMediaClick(item)}
          >
            {item.type === 'image' ? (
              <img
                src={item.preview_url || item.url}
                alt={item.description || ''}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : item.type === 'video' ? (
              <div className="relative w-full h-full">
                <video
                  src={item.url}
                  poster={item.preview_url}
                  className="w-full h-full object-cover"
                  muted
                  playsInline
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <FaPlay className="text-white text-3xl" />
                </div>
              </div>
            ) : item.type === 'audio' ? (
              <div className="relative w-full h-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                <div className="p-4 rounded-full bg-white/10">
                  <FaPlay className="text-2xl" />
                </div>
              </div>
            ) : (
              <div className="relative w-full h-full bg-gradient-to-br from-gray-500/20 to-gray-700/20 flex items-center justify-center">
                <FaImage className="text-4xl opacity-50" />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {activeItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
            onClick={() => setActiveItem(null)}
          >
            <div className="relative max-w-7xl mx-auto p-4" onClick={e => e.stopPropagation()}>
              {activeItem.type === 'image' ? (
                <img
                  src={activeItem.url}
                  alt={activeItem.description || ''}
                  className="max-h-[90vh] w-auto mx-auto rounded-lg"
                />
              ) : activeItem.type === 'video' ? (
                <video
                  src={activeItem.url}
                  controls={showControls}
                  autoPlay={isPlaying}
                  muted={isMuted}
                  className="max-h-[90vh] w-auto mx-auto rounded-lg"
                />
              ) : activeItem.type === 'audio' ? (
                <audio
                  src={activeItem.url}
                  controls={showControls}
                  autoPlay={isPlaying}
                  muted={isMuted}
                  className="w-full"
                />
              ) : null}

              {showControls && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/50 rounded-full px-6 py-3 backdrop-blur-sm">
                  {(activeItem.type === 'video' || activeItem.type === 'audio') && (
                    <>
                      <button onClick={() => setIsPlaying(!isPlaying)}>
                        {isPlaying ? <FaPause /> : <FaPlay />}
                      </button>
                      <button onClick={() => setIsMuted(!isMuted)}>
                        {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                      </button>
                    </>
                  )}
                  <button onClick={() => setIsFullscreen(!isFullscreen)}>
                    {isFullscreen ? <FaCompress /> : <FaExpand />}
                  </button>
                  <button onClick={() => handleDownload(activeItem)}>
                    <FaDownload />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
