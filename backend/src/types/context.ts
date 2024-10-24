import { User } from '../models/User';

export interface IContext {
  currentUser?: User;
  token?: string;
}
