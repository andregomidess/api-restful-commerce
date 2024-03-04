import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import UsersController from '../controllers/UsersControllers';

const usersRouter = Router();
const userscontroller = new UsersController();

usersRouter.get('/', userscontroller.index);

usersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  userscontroller.create,
);

export default usersRouter;
