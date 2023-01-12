import { faker } from '@faker-js/faker';
import { Error } from 'mongoose';
import { POST_SERVICE_PATH } from '../post.constants';
import { PostData } from '../post.interface';
import Post from '../post.model';
import PostService from '../post.service';

describe(POST_SERVICE_PATH, () => {
  describe('PostService.createPost', () => {
    it('should return 422 error', async () => {
      await new PostService()
        .createPost({
          title: '',
          user: '',
        })
        .catch(error => {
          expect(error).toBeInstanceOf(Error.ValidationError);
          expect(error).toMatchObject({
            errors: {
              user: expect.anything(),
              title: expect.anything(),
            },
          });
        });
    });

    it('should return post', async () => {
      const input = {
        title: faker.lorem.sentence(),
        description: faker.lorem.paragraph(),
        user: regularUser.id,
      } satisfies Partial<PostData>;

      const post = await new PostService().createPost(input);

      const newPost = await Post.findById(post.id);

      expect(newPost).not.toBeNull();
      expect(newPost).toMatchObject({
        id: post.id,
      });
    });
  });
});
