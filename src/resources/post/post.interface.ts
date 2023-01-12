import { Document } from 'mongoose';
import { CommentDocument } from '../comments/comment.interface';
import { UserDocument } from '../user/user.interface';

export interface PostData {
  title: string;
  description: string;
  user: string | UserDocument;
}

export interface PostDocument extends Document, PostData, AppTimestamps {
  comments?: CommentDocument[];
}
