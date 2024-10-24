export interface User {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
  giteaAccessToken?: string;
  githubAccessToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: Error | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  username: string;
  confirmPassword: string;
}
