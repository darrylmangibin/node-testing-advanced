import { faker } from '@faker-js/faker';
import ErrorException from '@src/utils/exceptions/error.exception';
import { Error, Types } from 'mongoose';
import { POST_SERVICE_PATH } from '../post.constants';
import PostFactory from '../post.factory';
import { PostDocument } from '../post.interface';
import PostService from '../post.service';

describe(POST_SERVICE_PATH, () => {
  describe('PostService.findPostAndUpate', () => {
    let post: PostDocument;

    beforeEach(async () => {
      post = await new PostFactory().create();
    });

    it('shoud throw 404 error', async () => {
      await new PostService()
        .findPostAndUpdate(new Types.ObjectId().toString(), {
          title: faker.lorem.sentence(),
          description: faker.lorem.paragraph(),
        })
        .catch(error => {
          expect(error).toBeInstanceOf(ErrorException);
          expect(error).toMatchObject({
            message: 'Post not found',
            statusCode: 404,
          });
        });
    });

    it('shoud throw 422 error', async () => {
      await new PostService()
        .findPostAndUpdate(new Types.ObjectId().toString(), {
          title: '',
          description: '',
        })
        .catch(error => {
          expect(error).toBeInstanceOf(Error.ValidationError);
          expect(error.errors).toMatchObject({
            title: expect.anything(),
          });
        });
    });

    it('shoud return updated post', async () => {
      const updatedPostFromService = await new PostService().findPostAndUpdate(post.id, {
        title: faker.lorem.sentence(),
      });

      expect(updatedPostFromService).toMatchObject({
        title: expect.not.stringContaining(post.title),
      });
    });
  });
});
