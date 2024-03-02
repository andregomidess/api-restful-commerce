import { getCustomRepository } from 'typeorm';
import { ProductRepository } from '../typeorm/repositories/productsRepository';
import AppError from '@shared/errors/AppError';
import Product from '../typeorm/entities/Product';

interface IRequest {
  name: string;
  quantity: number;
  price: number;
}

class CreateProductService {
  public async execute({ name, quantity, price }: IRequest): Promise<Product> {
    const productRepository = getCustomRepository(ProductRepository);
    const productExists = await productRepository.findByname(name);
    if (productExists) {
      throw new AppError('One product already exists with this name');
    }

    const product = productRepository.create({
      name,
      quantity,
      price,
    });

    await productRepository.save(product);

    return product;
  }
}

export default CreateProductService;
