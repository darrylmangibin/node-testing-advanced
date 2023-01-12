import { Schema } from 'mongoose';

import { PostData } from './post.interface';

const PostSchema = new Schema<PostData>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: String,
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export default PostSchema;
