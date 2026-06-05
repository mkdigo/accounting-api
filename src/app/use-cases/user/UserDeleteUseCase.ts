import { IUserRepository } from '@/domain/repositories/IUserRepository';
import { Exception } from '@/Exception';

export class UserDeleteUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: string): Promise<void> {
    const foundUser = await this.userRepository.findById(id);
    if (!foundUser)
      throw new Exception({
        code: 404,
        message: 'User not found',
      });
    await this.userRepository.delete(id);
  }
}
