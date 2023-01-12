import ErrorException from '@src/utils/exceptions/error.exception';
import optionsPaginate from '@src/utils/paginate/options.paginate';
import signToken from '@src/utils/token/sign.token';
import { NextFunction, Request, Response } from 'express';
import { FilterQuery } from 'mongoose';
import { PostData } from '../post/post.interface';
import PostService from '../post/post.service';
import { UserRequestHandler } from '../user/user.interface';
import UserService from '../user/user.service';
import AuthService from './auth.service';

class AuthController {
  private userService = new UserService();
  private authService = new AuthService();
  private postService = new PostService();

  public register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.create(req.body);

      const token = signToken({ id: user.id });

      res.status(201).json({ token });
    } catch (error) {
      next(error);
    }
  };

  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.authService.login(req.body);

      const token = signToken({ id: user.id });

      res.status(200).json({ token });
    } catch (error) {
      next(error);
    }
  };

  public getProfile: UserRequestHandler = async (req, res, next) => {
    try {
      const user = await this.userService.findUserById(req.user.id, req.query.populate);

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };

  public updateProfile: UserRequestHandler = async (req, res, next) => {
    try {
      const updatedUser = await this.userService.findUserAndUpdate(req.user.id, req.body);

      res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  };

  public deleteProfile: UserRequestHandler = async (req, res, next) => {
    try {
      const deletedUser = await this.userService.findUserAndDelete(req.user.id);

      res.status(200).json(deletedUser);
    } catch (error) {
      next(error);
    }
  };

  public updatePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updatedUserPassword = await this.authService.updatePassword(
        req.user.id,
        req.body
      );

      res.status(200).json(updatedUserPassword);
    } catch (error) {
      next(error);
    }
  };

  public getPosts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = {
        user: req.user.id,
        ...(req.query.filter as unknown as FilterQuery<PostData>),
      } satisfies FilterQuery<PostData>;

      const options = optionsPaginate(req.query);

      const results = await this.postService.findPosts(query, options);

      res.status(200).json(results);
    } catch (error) {
      next(error);
    }
  };

  public testAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(200).json({
        reqUser: req.user,
        globalAuthUser: AuthUser,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
