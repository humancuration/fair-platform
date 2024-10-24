import { User } from '../../../backup/models/User';

export interface IContext {
  currentUser?: User;
  token?: string;
}
