import {
  UserAuthenticationInputDTO,
  UserAuthenticationOutputDTO,
} from '@/app/dtos/UserAuthenticationDTO';
import { ITokenManager } from '@/domain/auth/ITokenManager';
import { ITokenRepository } from '@/domain/repositories/ITokenRepository';
import { IUserRepository } from '@/domain/repositories/IUserRepository';
import { IPasswordHasher } from '@domain/services/IPasswordHasher';
import { Exception } from '@/Exception';

export class UserAuthenticationUseCase {
  constructor(
    private userRepository: IUserRepository,
    private tokenRepository: ITokenRepository,
    private passwordHasher: IPasswordHasher,
    private tokenManager: ITokenManager,
  ) {}

  async execute(
    input: UserAuthenticationInputDTO,
  ): Promise<UserAuthenticationOutputDTO> {
    const foundUser = await this.userRepository.findByUsername(input.username);
    const isValidPassword = await this.passwordHasher.comparePassword(
      input.password,
      foundUser?.password || '',
    );
    if (!foundUser || !isValidPassword)
      throw new Exception({ code: 401, message: 'Invalid credentials' });
    if (!foundUser.email_verified_at)
      throw new Exception({ code: 422, message: 'Unverified email' });
    const token = this.tokenManager.create({
      userId: foundUser.id,
      type: 'default',
    });
    const refreshToken = this.tokenManager.create(
      {
        userId: foundUser.id,
        type: 'default',
      },
      {
        expiresIn: '7days',
      },
    );
    await this.tokenRepository.create({
      id: token.id,
      user_id: foundUser.id,
    });
    await this.tokenRepository.create({
      id: refreshToken.id,
      user_id: foundUser.id,
    });

    return { token, refreshToken };
  }
}
