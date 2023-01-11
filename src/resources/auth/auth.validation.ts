import { UserData } from '@src/resources/user/user.interface';
import Joi from 'joi';

export const authRegisterValidation = Joi.object<UserData>({
  name: Joi.string().required(),
  email: Joi.string().required().email(),
  password: Joi.string().required().min(6),
});
