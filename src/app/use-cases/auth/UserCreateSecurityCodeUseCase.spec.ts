import { CodeRepositoryFake } from '@/infra/database/repositories/fake/CodeRepositoryFake';
import { UserCreateSecurityCodeUseCase } from './UserCreateSecurityCodeUseCase';
import { ServiceFactory } from '@/infra/factories/ServiceFactory';
import { UserRepositoryFake } from '@/infra/database/repositories/fake/UserRepositoryFake';
import { Code } from '@/domain/entities/Code';
import { Email } from '@/domain/value-objects/Email';
import { User } from '@/domain/entities/User';

describe('UserCreateSecurityCodeUseCase', () => {
  it('should be able to create a password reset code', async () => {
    const userRepository = new UserRepositoryFake();
    const codeRepository = new CodeRepositoryFake();
    const randomCode = ServiceFactory.getRancomCode();
    const userCreateSecurityCodeUseCase = new UserCreateSecurityCodeUseCase(
      userRepository,
      codeRepository,
      randomCode,
    );
    const { code, user } = await userCreateSecurityCodeUseCase.execute({
      email: new Email('admin@admin.com'),
      type: 'email_verification',
    });
    expect(code).toBeInstanceOf(Code);
    expect(user).toBeInstanceOf(User);
  });
});
