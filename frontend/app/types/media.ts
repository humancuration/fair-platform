import type { Collaborator } from "./collaboration";

export interface MediaItem {
  id: string;
  type: 'music' | 'video' | 'social' | 'podcast' | 'research-presentation' | 'lecture';
  title: string;
  url: string;
  metadata: {
    creator: string;
    dateCreated: string;
    license: string;
    collectiveAttribution?: boolean;
  };
  collaboration?: {
    contributors: Collaborator[];
    shareAllocation: Record<string, number>;
    derivativeWorks: string[];
  };
  engagement: {
    views: number;
    likes: number;
    shares: number;
    comments: number;
    learningHours: number;
  };
  educational: {
    topics: string[];
    skillLevel: 'beginner' | 'intermediate' | 'advanced';
    relatedResources: string[];
    verifiedContent: boolean;
  };
  accessibility: {
    captions: boolean;
    transcripts: boolean;
    translations: string[];
    alternativeFormats: string[];
  };
  impact: {
    educationalValue: number;
    communityContribution: number;
    knowledgeSharing: number;
  };
}

export interface MediaCollection {
  id: string;
  title: string;
  description: string;
  items: MediaItem[];
  curator: string;
  collaborative: boolean;
  learningPath?: {
    sequence: string[];
    prerequisites: string[];
    outcomes: string[];
  };
}
