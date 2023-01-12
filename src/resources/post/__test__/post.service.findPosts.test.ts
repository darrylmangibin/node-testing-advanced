import keysPaginate from '@src/utils/paginate/keys.paginate';
import { POST_SERVICE_PATH } from '../post.constants';
import PostFactory from '../post.factory';
import PostService from '../post.service';

describe(POST_SERVICE_PATH, () => {
  describe('PostService.findPosts', () => {
    it('should return paginate posts results', async () => {
      const posts = await new PostFactory().createMany(20);
      const limit = 10;
      const page = 1;

      const results = await new PostService().findPosts({}, { limit, page });

      expect(Object.keys(results)).toEqual(expect.arrayContaining(keysPaginate));
      expect(results.docs.length).toEqual(limit);
      expect(results.totalDocs).toEqual(posts.length);
    });
  });
});
