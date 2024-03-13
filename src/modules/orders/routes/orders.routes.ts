import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import OrderController from '../controllers/OrdersController';
import isAuthenticated from '@modules/users/middlewares/isAuthenticated';

const orderRouter = Router();
const ordersController = new OrderController();

orderRouter.use(isAuthenticated);

orderRouter.get(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  ordersController.show,
);
orderRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      customer_id: Joi.string().uuid().required(),
      products: Joi.required(),
    },
  }),
  ordersController.create,
);

export default orderRouter;
