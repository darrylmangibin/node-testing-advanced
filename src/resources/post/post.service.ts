import notfoundException from '@src/utils/exceptions/notfound.exception';
import mongoose, { FilterQuery, PaginateOptions } from 'mongoose';
import { PostData } from './post.interface';
import Post from './post.model';

class PostService {
  private Post = Post;

  public findPosts = async (query: FilterQuery<PostData>, options: PaginateOptions) => {
    try {
      const results = await this.Post.paginate(query, options);

      return results;
    } catch (error) {
      throw error;
    }
  };

  public findPostById = async (postId: string) => {
    try {
      const post = await this.Post.findById(postId);

      if (!post) {
        return notfoundException('Post not found');
      }

      return post;
    } catch (error) {
      throw error;
    }
  };

  public createPost = async (body: Partial<PostData>) => {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      const [post] = await this.Post.create([body], { session });

      await session.commitTransaction();
      await session.endSession();

      return post;
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();

      throw error;
    }
  };

  public findPostAndUpdate = async (postId: string, body: Partial<PostData>) => {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      const post = await this.Post.findByIdAndUpdate(postId, body, {
        new: true,
        runValidators: true,
        session,
      });

      if (!post) {
        return notfoundException('Post not found');
      }

      await session.commitTransaction();
      await session.endSession();

      return post;
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();

      throw error;
    }
  };

  public findPostAndDelete = async (postId: string) => {
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      const post = await this.Post.findOneAndRemove({ _id: postId }, { session });

      if (!post) {
        return notfoundException('Post not found');
      }

      await session.commitTransaction();
      await session.endSession();

      return post;
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
      throw error;
    }
  };
}

export default PostService;
