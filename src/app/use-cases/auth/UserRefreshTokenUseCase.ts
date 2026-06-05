import { UserAuthenticationOutputDTO } from '@/app/dtos/UserAuthenticationDTO';
import { ITokenManager } from '@/domain/auth/ITokenManager';
import { ITokenRepository } from '@/domain/repositories/ITokenRepository';
import { IUserRepository } from '@/domain/repositories/IUserRepository';
import { Exception } from '@/Exception';

export class UserRefreshTokenUseCase {
  constructor(
    private userRepository: IUserRepository,
    private tokenRepository: ITokenRepository,
    private tokenManager: ITokenManager,
  ) {}

  public async execute(
    refreshToken: string,
  ): Promise<UserAuthenticationOutputDTO> {
    const { id, userId, type } = this.tokenManager.verify(refreshToken);

    if (type !== 'default')
      throw new Exception({
        code: 403,
        message: 'Forbidden',
      });

    const foundUser = await this.userRepository.findById(userId);

    if (!foundUser)
      throw new Exception({
        code: 404,
        message: 'User not found',
      });

    await this.tokenRepository.ban(id);

    const newToken = this.tokenManager.create({
      userId: foundUser.id,
      type: 'default',
    });

    const newRefreshToken = this.tokenManager.create(
      {
        userId: foundUser.id,
        type: 'default',
      },
      {
        expiresIn: '7days',
      },
    );

    return { token: newToken, refreshToken: newRefreshToken };
  }
}
