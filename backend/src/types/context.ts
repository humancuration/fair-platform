import { User } from '@prisma/client';

export interface Context {
  user?: User;
  token?: string;
}
