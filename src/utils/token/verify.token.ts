import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import ErrorException from '../exceptions/error.exception';

export interface VerifyToken {
  (token: string): Promise<AppPayload | jwt.VerifyErrors>;
}

export const isAppPayload = (payload: unknown): payload is AppPayload =>
  typeof payload === 'object' && payload !== null && 'id' in payload;

const verifyToken: VerifyToken = async token => {
  return new Promise((resolve, reject) => {
    return jwt.verify(token, process.env.JWT_SECRET as jwt.Secret, (err, payload) => {
      if (err) reject(err);

      if (isAppPayload(payload)) {
        resolve(payload);
      } else {
        reject(new ErrorException('Invalid payload type', 401));
      }
    });
  });
};

export default verifyToken;
