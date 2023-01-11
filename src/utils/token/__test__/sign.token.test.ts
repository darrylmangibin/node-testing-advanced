import { Types } from 'mongoose';
import signToken from '../sign.token';

describe('@utils/token', () => {
  describe('sign.token', () => {
    it('should return token', () => {
      const id = new Types.ObjectId().toString();

      const token = signToken({ id });

      expect(typeof token).toBe('string');
    });
  });
});
