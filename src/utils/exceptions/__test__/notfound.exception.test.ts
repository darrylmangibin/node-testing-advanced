import notfoundException from '../notfound.exception';

describe('@utils/exceptions', () => {
  describe('notfoundException', () => {
    it('should throw default message', () => {
      expect(() => {
        notfoundException();
      }).toThrow('Record not found');
    });

    it('should throw with custom message', () => {
      const message = 'Some messages';

      expect(() => {
        notfoundException(message);
      }).toThrowError(message);
    });
  });
});
