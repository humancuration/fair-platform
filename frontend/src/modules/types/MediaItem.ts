export interface MediaItem {
  id: string;  // Required for playlist item identification
  type: 'music' | 'video' | 'social' | 'podcast';
  title: string;
  url: string;
}
