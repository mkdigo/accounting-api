import {
  UserEmailVerifyInputDTO,
  UserEmailVerifyOutputDTO,
} from '@/app/dtos/UserEmailVerifyDTO';
import { ITokenManager } from '@/domain/auth/ITokenManager';
import { ICodeRepository } from '@/domain/repositories/ICodeRepository';
import { ITokenRepository } from '@/domain/repositories/ITokenRepository';
import { IUserRepository } from '@/domain/repositories/IUserRepository';
import { Exception } from '@/Exception';

export class UserEmailVerifyUseCase {
  constructor(
    private userRepository: IUserRepository,
    private codeRepository: ICodeRepository,
    private tokenRepository: ITokenRepository,
    private tokenManager: ITokenManager,
  ) {}

  public async execute(
    input: UserEmailVerifyInputDTO,
  ): Promise<UserEmailVerifyOutputDTO> {
    const foundUser = await this.userRepository.findByEmail(input.email);

    if (!foundUser)
      throw new Exception({ code: 401, message: 'Invalid credentials' });

    const code = await this.codeRepository.findByUserId(foundUser.id);

    if (!code || code.type !== 'email_verification')
      throw new Exception({ code: 401, message: 'Invalid credentials' });

    const isValidCode = code.compare(input.code);

    if (!isValidCode) {
      const attempts = code.attempts + 1;
      if (attempts < 5)
        await this.codeRepository.attemptsUpdate({ id: code.id, attempts });
      else await this.codeRepository.deleteAll(foundUser.id);
      throw new Exception({ code: 401, message: 'Invalid credentials' });
    }

    await this.codeRepository.deleteAll(foundUser.id);
    await this.userRepository.emailVerify(foundUser.id);

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
