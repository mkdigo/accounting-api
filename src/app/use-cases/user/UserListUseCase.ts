import { User } from '@/domain/entities/User';
import { IUserRepository } from '@/domain/repositories/IUserRepository';

export class UserListUseCase {
  constructor(private userRepository: IUserRepository) {}

  public async execute(search: string): Promise<User[]> {
    return await this.userRepository.list(search);
  }
}
