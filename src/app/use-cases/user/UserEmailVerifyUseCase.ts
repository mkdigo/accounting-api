import { UserEmailVerifyDTO } from '@/app/dtos/UserEmailVerifyDTO';
import { ICodeRepository } from '@/domain/repositories/ICodeRepository';
import { IUserRepository } from '@/domain/repositories/IUserRepository';
import { Exception } from '@/Exception';

export class UserEmailVerifyUseCase {
  constructor(
    private userRepository: IUserRepository,
    private codeRepository: ICodeRepository,
  ) {}

  public async execute(input: UserEmailVerifyDTO): Promise<void> {
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
  }
}
