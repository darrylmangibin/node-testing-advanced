import CommentFactory from '@src/resources/comments/comment.factory';
import { CommentDocument } from '@src/resources/comments/comment.interface';
import Comment from '@src/resources/comments/comment.model';
import PostFactory from '@src/resources/post/post.factory';
import Post from '@src/resources/post/post.model';
import UserFactory from '@src/resources/user/user.factory';
import User from '@src/resources/user/user.model';
import 'colors';
import 'dotenv/config';
import connectDatabase from './connect.database';

class SeederDatabase {
  constructor() {
    if (process.env.NODE_ENV === 'development') {
      connectDatabase();
    }
  }

  public importData = async () => {
    try {
      console.log('Generating admin...'.green);
      const admin = await new UserFactory().create({
        email: 'admin@example.com',
        role: 'admin',
      });

      console.log('Generating users...'.green);
      const users = await new UserFactory().createMany(15);

      for await (let user of users) {
        console.log(`Generating posts of ${user.name}`.green);
        const randomPostCount = Math.floor(Math.random() * 20);

        await new PostFactory().createMany(randomPostCount, { user: user.id });
      }

      const posts = await Post.find();

      const commentsData: Partial<CommentDocument>[] = [];

      for await (let post of posts) {
        for await (let _k of Array.from({ length: 15 })) {
          const randomUser = users[Math.floor(Math.random() * users.length)];
          // await new CommentFactory().create({ post: post.id, user: randomUser.id });
          //
          commentsData.push({ post: post.id, user: randomUser.id });
        }
      }
      console.log(`Generating comments...`.blue);
      await new CommentFactory().insertMany(commentsData);

      console.log('Data imported...'.green.bold);

      process.exit();
    } catch (error) {
      console.error(error);

      process.exit(1);
    }
  };

  public destroyData = async () => {
    try {
      const userCountDocuments = await User.countDocuments();
      console.log(`Deleting ${userCountDocuments} users...`.red);
      await new UserFactory().deleteMany();

      const postCountDocuments = await Post.countDocuments();
      console.log(`Deleting ${postCountDocuments} posts...`.red);
      await new PostFactory().deleteMany();

      const commentCountDocuments = await Comment.countDocuments();
      console.log(`Deleting ${commentCountDocuments} posts...`.red);
      await new CommentFactory().deleteMany();

      console.log('Data destroyed...'.red.bold);

      process.exit();
    } catch (error) {
      console.error(error);

      process.exit(1);
    }
  };
}

export default SeederDatabase;
