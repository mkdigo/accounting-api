import { Code, TCodeType } from '@/domain/entities/Code';
import { User } from '@/domain/entities/User';
import { ICodeRepository } from '@/domain/repositories/ICodeRepository';
import { IUserRepository } from '@/domain/repositories/IUserRepository';
import { IRandomCode } from '@/domain/services/IRandomCode';
import { Email } from '@/domain/value-objects/Email';
import { Exception } from '@/Exception';

type TOutput = {
  code: Code;
  user: User;
};

type TInput = {
  email: Email;
  type: TCodeType;
};

export class UserCreateSecurityCodeUseCase {
  constructor(
    private userRepository: IUserRepository,
    private codeRepository: ICodeRepository,
    private randomCode: IRandomCode,
  ) {}

  public async execute(input: TInput): Promise<TOutput> {
    const user = await this.userRepository.findByEmail(input.email);
    if (!user) throw new Exception({ code: 404, message: 'Email not found.' });
    const newCode = this.randomCode.alphanumeric();
    const code = await this.codeRepository.create({
      code: newCode,
      userId: user.id,
      type: input.type,
    });
    return { code, user };
  }
}
