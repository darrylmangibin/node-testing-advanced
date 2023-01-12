import Joi from 'joi';
import { UserData } from './user.interface';

export const userUpdateValidation = Joi.object<UserData>({
  name: Joi.string().required(),
  email: Joi.string().required().email(),
  role: Joi.string().required().valid('admin', 'user'),
});
