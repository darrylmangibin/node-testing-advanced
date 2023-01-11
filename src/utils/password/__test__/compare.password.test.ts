import comparePassword from '../compare.password';
import hashPassword from '../hash.password';

describe('@utils/password', () => {
  describe('comparePassword', () => {
    it('should return false when plain text password and hashed mismatch', async () => {
      const password = '123456';
      const wrongPassword = 'Hg8n7G&*HI';

      const hashedPassword = await hashPassword(password);

      const isMatchPassword = await comparePassword(wrongPassword, hashedPassword);

      expect(isMatchPassword).toBeFalsy();
    });

    it('should return true when plain text password and hashed match', async () => {
      const password = '123456';

      const hashedPassword = await hashPassword(password);

      const isMatchPassword = await comparePassword(password, hashedPassword);

      expect(isMatchPassword).toBeTruthy();
    });
  });
});
