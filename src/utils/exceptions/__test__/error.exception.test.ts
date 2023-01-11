import ErrorException from '../error.exception';

describe('@utils/exceptions', () => {
  describe('ErrorException', () => {
    it('should have message, statusCode and errorObject defined', () => {
      const message = 'Some message';
      const statusCode = 400;
      const errorObject = { success: false };

      const errorMethod = () => {
        return Promise.reject(new ErrorException(message, statusCode, errorObject));
      };

      expect(errorMethod()).rejects.toMatchObject({
        message,
        statusCode,
        errorObject,
      });
    });
  });
});
