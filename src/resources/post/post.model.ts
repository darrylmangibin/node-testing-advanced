import { model, PaginateModel } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import Comment from '../comments/comment.model';
import { PostData, PostDocument } from './post.interface';

import PostSchema from './post.schema';

PostSchema.plugin(paginate);

PostSchema.pre<PostDocument>('remove', async function (next) {
  await Comment.deleteMany({ post: this._id });

  next();
});

PostSchema.virtual('comments', {
  ref: Comment,
  localField: '_id',
  foreignField: 'post',
  justOne: false,
});

const Post = model<PostData, PaginateModel<PostDocument>>('Post', PostSchema);

export default Post;
