import { getCustomRepository } from 'typeorm';
import { ProductRepository } from '../typeorm/repositories/productsRepository';
import AppError from '@shared/errors/AppError';
import Product from '../typeorm/entities/Product';

interface IRequest {
  id: string;
}

class ShowProductService {
  public async execute({ id }: IRequest): Promise<Product> {
    const productRepository = getCustomRepository(ProductRepository);

    const product = await productRepository.findOne(id);

    if (!product) {
      throw new AppError('Product not found');
    }

    return product;
  }
}

export default ShowProductService;
