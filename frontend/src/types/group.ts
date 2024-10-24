export interface Achievement {
  id: number;
  name: string;
  description: string;
  dateEarned: string;
}

export interface Group {
  id: number;
  name: string;
  description: string;
  coverPhoto?: string;
  avatar?: string;
  memberCount: number;
  createdAt: string;
  achievements?: Achievement[];
  guidelines?: string[];
  customEmojis?: Record<string, string>;
}
