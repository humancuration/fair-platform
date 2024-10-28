import { User } from '../../modules/user/User';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
