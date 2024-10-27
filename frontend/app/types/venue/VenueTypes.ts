import { IconType } from 'react-icons';

export interface FairVenue {
  id: string;
  name: string;
  type: 'learning' | 'collaboration' | 'performance' | 'community' | 'research';
  accessibility: {
    languages: string[];
    captioning: boolean;
    signLanguageSupport: boolean;
    screenReaderOptimized: boolean;
    lowBandwidthMode: boolean;
  };
  capacity: {
    min: number;
    max: number;
    optimal: number;
    dynamicScaling: boolean;
  };
  resources: {
    computePower: number;
    storageSpace: number;
    bandwidth: number;
  };
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  amenities: string[];
  vibes: string[];
  creator: {
    id: string;
    username: string;
    avatar: string;
  };
}

export interface VenueZone {
  id: string;
  name: string;
  type: 'chill' | 'energetic' | 'mystical' | 'nature' | 'urban' | 'cosmic' | 'fusion' | 'experimental';
  capacity: {
    optimal: number;
    maximum: number;
  };
  musicStyles: string[];
  environmentalEffects: {
    particles: string[];
    lighting: string[];
    weather: string[];
  };
  crowdBehavior: {
    danceability: number;
    socialInteraction: number;
    flowPatterns: string[];
  };
}
