import ErrorException from '@src/utils/exceptions/error.exception';
import { RequestHandler } from 'express';

const adminMiddleware: RequestHandler = (req, res, next) => {
  if (req.user.role === 'admin') {
    return next();
  }

  next(new ErrorException('Forbidden. Admin can only access this route', 403));
};

export default adminMiddleware;
