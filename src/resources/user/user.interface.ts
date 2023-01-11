import { Request, RequestHandler } from 'express';
import { Document, FilterQuery, PopulateOptions } from 'mongoose';

export type UserRole = 'admin' | 'user';

export interface UserData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface UserDocument extends Document, UserData, AppTimestamps {}

export interface UserReqParams {
  userId?: string;
}

export interface UserReqQuery {
  populate?: PopulateOptions;
  limit?: string;
  page?: string;
  filter?: FilterQuery<UserData>;
}

export type UserRequestHandler<T extends unknown = Request['body']> = RequestHandler<
  UserReqParams,
  UserDocument,
  T,
  UserReqQuery
>;
