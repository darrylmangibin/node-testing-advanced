import jwt, { SignOptions } from 'jsonwebtoken';
import 'dotenv/config';

export interface SignToken {
  (payload: AppPayload, options?: SignOptions): string;
}

const signToken: SignToken = (payload, options) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET as jwt.Secret, {
    expiresIn: '30d',
    ...options,
  });

  return token;
};

export default signToken;
