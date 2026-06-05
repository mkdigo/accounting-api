import { UserCreatePasswordResetTokenDTO } from '@/app/dtos/UserCreatePasswordResetTokenDTO';
import { ITokenManager } from '@/domain/auth/ITokenManager';
import { ICodeRepository } from '@/domain/repositories/ICodeRepository';
import { ITokenRepository } from '@/domain/repositories/ITokenRepository';
import { IUserRepository } from '@/domain/repositories/IUserRepository';
import { Exception } from '@/Exception';

export class UserCreatePasswordResetTokenUseCase {
  constructor(
    private userRepository: IUserRepository,
    private codeRepository: ICodeRepository,
    private tokenRepository: ITokenRepository,
    private tokenManager: ITokenManager,
  ) {}

  async execute(
    input: UserCreatePasswordResetTokenDTO,
  ): Promise<{ token: string }> {
    const foundUser = await this.userRepository.findByEmail(input.email);

    if (!foundUser)
      throw new Exception({ code: 401, message: 'Invalid credentials' });

    const code = await this.codeRepository.findByUserId(foundUser.id);

    if (!code || code.type !== 'password_reset')
      throw new Exception({ code: 401, message: 'Invalid credentials' });

    const isValidCode = code.compare(input.code);

    if (!isValidCode) {
      const attempts = code.attempts + 1;
      if (attempts < 5)
        await this.codeRepository.attemptsUpdate({ id: code.id, attempts });
      else await this.codeRepository.deleteAll(foundUser.id);
      throw new Exception({ code: 401, message: 'Invalid credentials' });
    }

    const token = this.tokenManager.create(
      {
        userId: foundUser.id,
        type: 'password-reset',
      },
      {
        expiresIn: '10m',
      },
    );

    this.codeRepository.deleteAll(foundUser.id);
    this.tokenRepository.create({
      id: token.id,
      user_id: foundUser.id,
    });

    return { token: token.content };
  }
}
