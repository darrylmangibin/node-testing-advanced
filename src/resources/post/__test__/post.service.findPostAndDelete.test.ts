import ErrorException from '@src/utils/exceptions/error.exception';
import { Types } from 'mongoose';
import { POST_SERVICE_PATH } from '../post.constants';
import PostFactory from '../post.factory';
import Post from '../post.model';
import PostService from '../post.service';

describe(POST_SERVICE_PATH, () => {
  describe('PostService.findPostAndDelete', () => {
    it('should throw 404 error', async () => {
      await new PostService()
        .findPostAndDelete(new Types.ObjectId().toString())
        .catch(error => {
          expect(error).toBeInstanceOf(ErrorException);
          expect(error).toMatchObject({
            message: 'Post not found',
            statusCode: 404,
          });
        });
    });

    it('should return deleted post', async () => {
      const post = await new PostFactory().create();

      const deletedPost = await new PostService().findPostAndDelete(post.id);

      expect(deletedPost).toMatchObject({
        id: post.id,
      });
      expect(await Post.findById(post.id)).toBeNull();
    });
  });
});
