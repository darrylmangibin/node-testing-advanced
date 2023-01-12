import { POST_ENDPOINT } from '@src/resources/post/post.constants';
import PostFactory from '@src/resources/post/post.factory';
import { PostDocument } from '@src/resources/post/post.interface';
import { httpSupertestRequest } from '@src/utils/customSupertest';
import keysPaginate from '@src/utils/paginate/keys.paginate';
import { PaginateOptions } from 'mongoose';
import { COMMENT_CONTROLLER_PATH, COMMENT_ENDPOINT } from '../comment.constant';
import CommentFactory from '../comment.factory';
import { CommentDocument } from '../comment.interface';

describe(COMMENT_CONTROLLER_PATH, () => {
  describe(`CommentController.findComments GET - ${POST_ENDPOINT}/:postId/comments`, () => {
    let comments: CommentDocument[];
    let otherComments: CommentDocument[];
    let post: PostDocument;

    beforeEach(async () => {
      post = await new PostFactory().create();
      comments = await new CommentFactory().createMany(20, { post: post.id });
      otherComments = await new CommentFactory().createMany(5);
    });

    it('should return pagination results', async () => {
      const res = await httpSupertestRequest({
        endpoint: `${POST_ENDPOINT}/${post.id}/comments`,
        method: 'GET',
        token: regularToken,
      });

      expect(res.status).toBe(200);
      expect(Object.keys(res.body)).toEqual(expect.arrayContaining(keysPaginate));
      expect(res.body.totalDocs).toBe(comments.length);
      res.body.docs.forEach((doc: CommentDocument) => {
        expect(doc.post.toString() === post.id);
      });
    });

    it('should populate user and post', async () => {
      const res = await httpSupertestRequest({
        endpoint: `${POST_ENDPOINT}/${post.id}/comments`,
        method: 'GET',
        token: regularToken,
        query: {
          limit: 10,
          populate: 'user post',
        },
      });

      expect(res.status).toBe(200);

      const randomDoc = res.body.docs[Math.floor(Math.random() * res.body.docs.length)];
      expect(randomDoc).toEqual(
        expect.objectContaining({
          user: expect.objectContaining({ id: expect.any(String) }),
          post: expect.objectContaining({ id: expect.any(String) }),
        })
      );
    });
  });
});
