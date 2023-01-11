import comparePassword from '../compare.password';

import hashPassword from '../hash.password';

describe('@utils/password', () => {
  describe('hashPassword', () => {
    it('should return hashed password', async () => {
      const password = '123456';

      const hash = await hashPassword(password);

      const isMatchPassword = await comparePassword(password, hash);

      expect(hash).not.toEqual(password);
      expect(typeof hash).toBe('string');
      expect(isMatchPassword).toBeTruthy();
    });
  });
});
