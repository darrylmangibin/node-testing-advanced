import keysPaginate from '@src/utils/paginate/keys.paginate';
import { USER_ENDPOINT, USER_SERVICE_PATH } from '../user.constants';
import UserFactory from '../user.factory';
import UserService from '../user.service';

describe(USER_SERVICE_PATH, () => {
  describe(`UserService.findUsers GET - ${USER_ENDPOINT}`, () => {
    it('should return paginate results', async () => {
      const users = await new UserFactory().createMany(15);

      const limit = 10;
      const page = 1;

      const results = await new UserService().findUsers({}, { limit, page });

      expect(Object.keys(results)).toEqual(expect.arrayContaining(keysPaginate));
      expect(results.docs.length).toBe(limit);
      expect(results.totalDocs).toBe(users.length);
    });
  });
});
