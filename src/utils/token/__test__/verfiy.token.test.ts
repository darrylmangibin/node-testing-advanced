import ErrorException from '@src/utils/exceptions/error.exception';
import { Types } from 'mongoose';
import signToken from '../sign.token';
import verifyToken, { isAppPayload } from '../verify.token';

describe('@utils/token', () => {
  describe('verifyToken', () => {
    it('should decode the token', async () => {
      const id = new Types.ObjectId().toString();

      const token = signToken({ id });

      const decoded = await verifyToken(token);

      if (isAppPayload(decoded)) {
        expect(decoded.id).toEqual(id);
      } else {
        expect(decoded).toBeInstanceOf(ErrorException);
      }
    });
  });
});
