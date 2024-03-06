import { getCustomRepository } from 'typeorm';
import AppError from '@shared/errors/AppError';
import { isAfter, addHours } from 'date-fns';
import UserRepository from '../typeorm/repositories/UserRepository';
import UserTokensRepository from '../typeorm/repositories/userTokensRepository';
import { hash } from 'bcryptjs';

interface IRequest {
  token: string;
  password: string;
}

class ResetPasswordService {
  public async execute({ token, password }: IRequest): Promise<void> {
    const userRepository = getCustomRepository(UserRepository);
    const userTokenRepository = getCustomRepository(UserTokensRepository);

    const userToken = await userTokenRepository.findByToken(token);

    if(!userToken){
      throw new AppError('User Token does not exists.');
    }

    const user = await userRepository.findById(userToken.user_id);

    if(!user){
      throw new AppError('User does not exists.');
    }

    const tokenCreatedAt = user.createdAt;
    const compareDate = addHours(tokenCreatedAt, 2);

    if(isAfter(Date.now(), compareDate)){
      throw new AppError('Token expired.');

    }

    user.password = await hash(password, 8);

    await userRepository.save(user);


  }
}

export default ResetPasswordService;
