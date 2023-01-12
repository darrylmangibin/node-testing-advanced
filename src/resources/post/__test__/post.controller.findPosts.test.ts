import { httpSupertestRequest } from '@src/utils/customSupertest';
import keysPaginate from '@src/utils/paginate/keys.paginate';
import { FilterQuery, PaginateOptions, PopulateOptions } from 'mongoose';
import { POST_CONTROLLER_PATH, POST_ENDPOINT } from '../post.constants';
import PostFactory from '../post.factory';
import { PostData, PostDocument } from '../post.interface';

describe(POST_CONTROLLER_PATH, () => {
  describe(`PostController.findPosts GET - ${POST_ENDPOINT}`, () => {
    let posts: PostDocument[];
    let limit = 10;
    let adminPosts: PostDocument[];
    let userPosts: PostDocument[];
    let filter: FilterQuery<PostData> = {};

    beforeEach(async () => {
      adminPosts = await new PostFactory().createMany(8);
      userPosts = await new PostFactory().createMany(10);

      posts = [...adminPosts, ...userPosts];
    });

    it('should return pagination results of posts', async () => {
      const res = await httpSupertestRequest({
        endpoint: POST_ENDPOINT,
        method: 'GET',
        token: regularToken,
      });

      expect(res.status).toBe(200);
      expect(Object.keys(res.body)).toEqual(expect.arrayContaining(keysPaginate));
      expect(res.body.docs.length).toEqual(limit);
      expect(res.body.totalDocs).toEqual(posts.length);
    });

    it('should populate users in the docs', async () => {
      const populate = [
        {
          path: 'user',
        },
      ] satisfies PaginateOptions['populate'];

      let res = await httpSupertestRequest({
        endpoint: POST_ENDPOINT,
        method: 'GET',
        token: regularToken,
      });

      res.body.docs.forEach((doc: PostDocument) => {
        expect(typeof doc.user).toBe('string');
      });

      res = await httpSupertestRequest({
        endpoint: POST_ENDPOINT,
        method: 'GET',
        token: regularToken,
        query: {
          populate,
        },
      });

      res.body.docs.forEach((doc: PostDocument) => {
        expect(typeof doc.user).toBe('object');
        expect(doc).toEqual(
          expect.objectContaining({
            id: expect.any(String),
          })
        );
      });
    });
  });
});