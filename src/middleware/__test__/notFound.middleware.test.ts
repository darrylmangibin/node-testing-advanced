import { app } from '@src/server';
import supertest from 'supertest';
import { HTTPError } from 'superagent';

describe('@middleware', () => {
  const isHTTPError = (error: boolean | HTTPError): error is HTTPError =>
    typeof error !== 'boolean';

  describe('notFoundMiddleware', () => {
    it('should return 404 response when no routes found', async () => {
      const path = '/api/not-found';

      const res = await supertest(app).get(path);

      expect(res.notFound).toBeTruthy();
      expect(res.status).toBe(404);

      if (isHTTPError(res.error)) {
        expect(res.body).toMatchObject({
          message: `Route ${res.error.method} ${res.error.path} does not exists`,
        });
      }
    });
  });
});
