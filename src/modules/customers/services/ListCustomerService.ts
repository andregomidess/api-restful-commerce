import { getCustomRepository } from 'typeorm';
import AppError from '@shared/errors/AppError';
import Customer from '../typeorm/entities/Customer';
import CustomersRepository from '../typeorm/repositories/CustomersRepository';

class ListCustomerService {
  public async execute(): Promise<Customer[]> {
    const custoemrsRepository = getCustomRepository(CustomersRepository);

    const customers = await custoemrsRepository.find();

    return customers;
  }
}

export default ListCustomerService;
