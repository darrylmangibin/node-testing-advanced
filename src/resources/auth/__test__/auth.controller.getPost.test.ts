import PostFactory from '@src/resources/post/post.factory';
import { PostDocument } from '@src/resources/post/post.interface';
import { httpSupertestRequest } from '@src/utils/customSupertest';
import { AUTH_CONTROLLER_PATH, AUTH_POSTS_ENDPOINT } from '../auth.constants';

describe(AUTH_CONTROLLER_PATH, () => {
  describe(`AuthController.getPosts GET - ${AUTH_POSTS_ENDPOINT}`, () => {
    it('should return current user posts only', async () => {
      const otherPosts = await new PostFactory().createMany(5);
      const currentUserPosts = await new PostFactory().createMany(5, {
        user: regularUser.id,
      });

      const res = await httpSupertestRequest({
        endpoint: AUTH_POSTS_ENDPOINT,
        method: 'GET',
        token: regularToken,
      });

      const docsIds = res.body.docs.map((doc: PostDocument) => doc.id);

      docsIds.forEach((id: string) => {
        expect(currentUserPosts.map(post => post.id).includes(id)).toBeTruthy();
        expect(otherPosts.map(post => post.id).includes(id)).toBeFalsy();
      });
    });
  });
});
