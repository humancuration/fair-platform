export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  coverArt?: string;
  waveformData?: number[];
  quantumSignature?: {
    resonance: number;
    entanglement: number[];
    harmonicField: number[];
  };
}

export interface Playlist {
  id: string;
  title: string;
  description?: string;
  tracks: Track[];
  isCollaborative: boolean;
  hasAICuration: boolean;
  isEducational: boolean;
  createdAt: string;
  updatedAt: string;
  creatorId: string;
}

export interface Contributor {
  id: string;
  name: string;
  avatar: string;
  role: 'creator' | 'collaborator' | 'curator';
  contributions: number;
}
