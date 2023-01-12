import { faker } from '@faker-js/faker';
import FactoryDatabase from '@src/utils/database/factory.database';
import PostFactory from '../post/post.factory';
import UserFactory from '../user/user.factory';
import { CommentData, CommentDocument } from './comment.interface';
import Comment from './comment.model';

class CommentFactory extends FactoryDatabase<CommentDocument, CommentData> {
  public model = Comment;

  public data = async (arg?: Partial<CommentData>) => {
    return {
      body: faker.lorem.sentence(),
      user: arg?.user ? arg.user : (await new UserFactory().create()).id,
      post: arg?.post ? arg.post : (await new PostFactory().create()).id,
      ...arg,
    };
  };
}

export default CommentFactory;
