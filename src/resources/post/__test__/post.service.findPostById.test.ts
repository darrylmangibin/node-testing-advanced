import ErrorException from '@src/utils/exceptions/error.exception';
import { Types } from 'mongoose';
import { POST_SERVICE_PATH } from '../post.constants';
import PostFactory from '../post.factory';
import Post from '../post.model';
import PostService from '../post.service';

describe(POST_SERVICE_PATH, () => {
  describe('PostService.findPostById', () => {
    it('should return 404 error', async () => {
      const invalidId = new Types.ObjectId().toString();

      await new PostService().findPostById(invalidId).catch(error => {
        expect(error).toBeInstanceOf(ErrorException);
        expect(error).toMatchObject({
          message: 'Post not found',
          statusCode: 404,
        });
      });
    });

    it('should return post', async () => {
      const postFromFactory = await new PostFactory().create();

      let postFromService = await new PostService().findPostById(postFromFactory.id);

      expect(postFromService).toMatchObject({
        id: postFromFactory.id,
      });
    });
  });
});
