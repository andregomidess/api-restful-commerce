import { getCustomRepository } from 'typeorm';
import { ProductRepository } from '../typeorm/repositories/productsRepository';
import AppError from '@shared/errors/AppError';
import Product from '../typeorm/entities/Product';
import RedisCache from '@shared/cache/RedisCache';

interface IRequest {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

class UpdateProductService {
  public async execute({
    id,
    name,
    quantity,
    price,
  }: IRequest): Promise<Product> {
    const productRepository = getCustomRepository(ProductRepository);

    const product = await productRepository.findOne(id);

    if (!product) {
      throw new AppError('Product not found');
    }

    const productExists = await productRepository.findByname(name);

    if (productExists && name !== product.name) {
      throw new AppError('One product already exists with this name');
    }

    const redisCache = new RedisCache();

    await redisCache.invalidate('api-vendas-PRODUCT_LIST');

    product.name = name;
    product.quantity = quantity;
    product.price = price;

    await productRepository.save(product);

    return product;
  }
}

export default UpdateProductService;
