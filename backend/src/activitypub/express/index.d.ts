import { User } from '../../modulesb/user/User';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
