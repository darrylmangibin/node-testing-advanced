import keysPaginate from '@src/utils/paginate/keys.paginate';
import { COMMENT_SERVICE_PATH } from '../comment.constant';
import CommentFactory from '../comment.factory';
import CommentService from '../comment.service';

describe(COMMENT_SERVICE_PATH, () => {
  describe('CommentService.findComments', () => {
    it('should return pagination results', async () => {
      const comments = await new CommentFactory().createMany(20);
      const query = {};
      const limit = 10;

      const results = await new CommentService().findComments(query, { limit });

      expect(Object.keys(results)).toEqual(expect.arrayContaining(keysPaginate));
      expect(results.docs.length).toBe(limit);
      expect(results.totalDocs).toBe(comments.length);
    });
  });
});
