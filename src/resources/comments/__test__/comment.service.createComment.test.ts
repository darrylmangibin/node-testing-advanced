import { faker } from '@faker-js/faker';
import PostFactory from '@src/resources/post/post.factory';
import { Error } from 'mongoose';
import { COMMENT_SERVICE_PATH } from '../comment.constant';
import Comment from '../comment.model';
import CommentService from '../comment.service';

describe(COMMENT_SERVICE_PATH, () => {
  describe('CommentService.createComment', () => {
    it('should throw 422 error', async () => {
      await new CommentService()
        .createComment({
          body: '',
        })
        .catch(error => {
          expect(error).toBeInstanceOf(Error.ValidationError);
        });
    });

    it('should return created comment', async () => {
      const post = await new PostFactory().create();
      const body = {
        post: post.id,
        user: regularUser.id,
        body: faker.lorem.paragraph(),
      };
      const commentFromService = await new CommentService().createComment(body);

      const comment = await Comment.findById(commentFromService.id);

      expect(comment).not.toBeNull();
    });
  });
});
