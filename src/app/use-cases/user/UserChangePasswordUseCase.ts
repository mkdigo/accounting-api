import { ITokenRepository } from '@/domain/repositories/ITokenRepository';
import { IUserRepository } from '@/domain/repositories/IUserRepository';
import { IPasswordHasher } from '@/domain/services/IPasswordHasher';
import { Password } from '@/domain/value-objects/Password';

export class UserChangePasswordUseCase {
  constructor(
    private userRepository: IUserRepository,
    private tokenRepository: ITokenRepository,
    private passwordHasher: IPasswordHasher,
  ) {}

  async execute(userId: string, newPassword: Password): Promise<void> {
    const hash = await this.passwordHasher.hashPassword(newPassword.value);
    await this.userRepository.changePassword(userId, hash);
    await this.tokenRepository.banAll(userId);
  }
}
