export interface User {
  id: string;
  username: string;
  email: string;
  giteaAccessToken?: string;
  githubAccessToken?: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthRequest extends Express.Request {
  user: User;
}
