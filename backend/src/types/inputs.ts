export interface UserInput {
  username: string;
  email: string;
  password: string;
  avatar?: string;
}

export interface GroupInput {
  name: string;
  description?: string;
  isPrivate?: boolean;
  avatar?: string;
}
