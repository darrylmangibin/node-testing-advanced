import hashPassword from '@src/utils/password/hash.password';
import { model, PaginateModel } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import Comment from '../comments/comment.model';
import Post from '../post/post.model';
import { UserData, UserDocument } from './user.interface';

import UserSchema from './user.schema';

UserSchema.plugin(paginate);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  this.password = await hashPassword(this.password);
});

UserSchema.pre<UserDocument>('remove', async function (next) {
  await Post.deleteMany({ user: this._id });
  await Comment.deleteMany({ user: this._id });

  next();
});

const User = model<UserData, PaginateModel<UserDocument>>('User', UserSchema);

export default User;
