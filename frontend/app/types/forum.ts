export interface MediaAttachment {
  id: string;
  type: 'image' | 'video' | 'audio' | 'document';
  url: string;
  preview_url?: string;
  description?: string;
  metadata?: {
    width?: number;
    height?: number;
    duration?: number;
    size?: number;
    mimeType?: string;
  };
}

export interface SemanticLink {
  targetId: string;
  type: string;
  relationship: string;
  strength: number;
  category: string;
  bidirectional: boolean;
  metadata?: {
    confidence: number;
    context: string[];
    validatedBy?: string[];
  };
}

export interface ThreadNode {
  id: string;
  post: {
    content: string;
    contentType: 'text' | 'code' | 'data' | 'media' | 'thread';
    mediaAttachments?: MediaAttachment[];
    semanticLinks?: SemanticLink[];
    federatedWith?: string[];
    aiGenerated?: boolean;
    aiMetadata?: {
      model: string;
      confidence: number;
      reasoningChain?: string[];
    };
  };
  branchId?: string;
  replies?: ThreadNode[];
  federatedReplies?: string[];
  metrics: {
    likes: number;
    reposts: number;
    replies: number;
    reach: number;
    impact: number;
  };
  collaborators?: {
    id: string;
    role: 'author' | 'editor' | 'contributor';
    contribution: string;
  }[];
  semanticContext?: {
    topics: string[];
    entities: string[];
    sentiment: number;
    complexity: number;
  };
}

export interface ThreadBranch {
  id: string;
  name: string;
  description?: string;
  creator: {
    id: string;
    name: string;
    type: 'human' | 'ai' | 'hybrid';
  };
  stats: {
    nodes: number;
    participants: number;
    activity: number;
    depth: number;
  };
  metadata: {
    createdAt: string;
    lastActive: string;
    status: 'active' | 'archived' | 'merged';
    parentBranch?: string;
    mergedInto?: string;
    aiGenerated?: boolean;
    federatedWith?: string[];
  };
  semanticContext?: {
    divergencePoint: string;
    divergenceReason: string;
    topicShift?: string[];
    convergenceProbability?: number;
  };
}

export interface ForumThread {
  id: string;
  title: string;
  rootPost: ThreadNode;
  branches: ThreadBranch[];
  visibility: 'public' | 'unlisted' | 'private';
  settings: {
    allowBranching: boolean;
    allowAIParticipation: boolean;
    allowFederation: boolean;
    moderationLevel: 'low' | 'medium' | 'high';
    semanticGrouping: boolean;
  };
  federation?: {
    instances: string[];
    protocol: 'activitypub' | 'custom';
    replicationStrategy: 'full' | 'partial';
  };
  aiModeration?: {
    enabled: boolean;
    model: string;
    policies: string[];
    actions: Array<{
      type: string;
      reason: string;
      timestamp: string;
    }>;
  };
}
