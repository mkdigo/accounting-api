import { User } from '@/domain/entities/User';
import { IUserRepository } from '@/domain/repositories/IUserRepository';
import { UserCreateInputDTO } from '../../dtos/UserCreateDTO';
import { Exception } from '@/Exception';
import { IPasswordHasher } from '@/domain/services/IPasswordHasher';

export class UserCreateUseCase {
  constructor(
    private userRepository: IUserRepository,
    private passwordHasher: IPasswordHasher,
  ) {}

  public async execute(input: UserCreateInputDTO): Promise<User> {
    const emailExist = await this.userRepository.findByEmail(input.email);
    if (emailExist)
      throw new Exception({
        code: 409,
        message: 'This email has already been taken.',
      });
    const usernameExist = await this.userRepository.findByUsername(
      input.username,
    );
    if (usernameExist)
      throw new Exception({
        code: 409,
        message: 'This username has already been taken.',
      });
    const password = await this.passwordHasher.hashPassword(
      input.password.value,
    );
    const newUser = this.userRepository.create({ ...input, password });
    return newUser;
  }
}
