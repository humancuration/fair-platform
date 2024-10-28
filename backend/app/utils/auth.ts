import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/constants';

interface TokenPayload {
  id: string;
  role?: string;
}

export const verifyToken = (token: string): Promise<TokenPayload> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded as TokenPayload);
      }
    });
  });
};
