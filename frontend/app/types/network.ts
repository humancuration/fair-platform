export interface NetworkNode {
  id: string;
  name: string;
  influence: number;
  activity: number;
  group: string;
}

export interface NetworkLink {
  source: string;
  target: string;
  strength: number;
  type: 'comment' | 'reaction' | 'share' | 'collaboration';
}
