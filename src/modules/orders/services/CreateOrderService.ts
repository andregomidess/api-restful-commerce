import { getCustomRepository } from 'typeorm';
import Order from '../typeorm/entities/Order';
import { OrdersRepository } from '../typeorm/repositories/OrdersRepository';
import CustomersRepository from '@modules/customers/typeorm/repositories/CustomersRepository';
import { ProductRepository } from '@modules/products/typeorm/repositories/productsRepository';
import AppError from '@shared/errors/AppError';

interface IProduct {
  id: string;
  quantity: number;
}
interface IRequest {
  customer_id: string;
  products: IProduct[];
}

class CreateOrderService {
  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const orderRepository = getCustomRepository(OrdersRepository);
    const customerRepository = getCustomRepository(CustomersRepository);
    const productRepository = getCustomRepository(ProductRepository);

    const customerExists = await customerRepository.findById(customer_id);

    if (!customerExists) {
      throw new AppError('Could not find customer with the given id');
    }

    const existsProducts = await productRepository.findAllByIds(products);

    if (!existsProducts.length) {
      throw new AppError('Could not find products with the given ids');
    }

    const existsProductsIds = existsProducts.map(product => product.id);

    const checkInexistentProduct = products.filter(
      product => !existsProductsIds.includes(product.id),
    );

    if (checkInexistentProduct.length) {
      throw new AppError(
        `Could not find product ${checkInexistentProduct[0].id}`,
      );
    }

    const quantityAvailable = products.filter(
      product =>
        existsProducts.filter(p => p.id === product.id)[0].quantity <
        product.quantity,
    );

    if (quantityAvailable.length) {
      throw new AppError(
        `The quantity  ${quantityAvailable[0].quantity} is not available for ${quantityAvailable[1].id}`,
      );
    }

    const serializedProduct = products.map(product => ({
      product_id: product.id,
      quantity: product.quantity,
      price: existsProducts.filter(p => p.id === product.id)[0].price,
    }));

    const order = await orderRepository.createOrder({
      customer: customerExists,
      products: serializedProduct,
    });

    const { order_products } = order;

    const updatedProductQauntity = order_products.map(product => ({
      id: product.id,
      quantity:
        existsProducts.filter(p => p.id === product.id)[0].quantity -
        product.quantity,
    }));

    await orderRepository.save(updatedProductQauntity);

    return order;
  }
}

export default CreateOrderService;
