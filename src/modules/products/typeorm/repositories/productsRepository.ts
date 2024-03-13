import { EntityRepository, In, Repository } from 'typeorm';
import Product from '../entities/Product';

interface IFindProcuts {
  id: string;
}

@EntityRepository(Product)
export class ProductRepository extends Repository<Product> {
  public async findByname(name: string): Promise<Product | undefined> {
    const product = this.findOne({
      where: {
        name,
      },
    });

    return product;
  }

  public async findAllByIds(products: IFindProcuts[]): Promise<Product[]> {
    const productsId = products.map(product => product.id);

    const existsProducts = await this.find({
      where: {
        id: In(productsId),
      },
    });

    return existsProducts;
  }
}
