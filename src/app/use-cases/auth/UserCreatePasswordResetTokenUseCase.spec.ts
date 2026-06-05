import { UserRepositoryFake } from '@/infra/database/repositories/fake/UserRepositoryFake';
import { UserCreatePasswordResetTokenUseCase } from './UserCreatePasswordResetTokenUseCase';
import { CodeRepositoryFake } from '@/infra/database/repositories/fake/CodeRepositoryFake';
import { TokenManagerFactory } from '@/infra/factories/TokenManagerFactory';
import { Email } from '@/domain/value-objects/Email';
import { Exception } from '@/Exception';
import { TokenRepositoryFake } from '@/infra/database/repositories/fake/TokenRepositoryFake';

describe('UserCreatePasswordResetTokenUseCase', () => {
  it('should be able to create a password reset token', async () => {
    const userRepository = new UserRepositoryFake();
    const codeRepository = new CodeRepositoryFake();
    const tokenRepository = new TokenRepositoryFake();
    const tokenManager = TokenManagerFactory.get();
    const email = new Email('admin@admin.com');
    const user = await userRepository.findByEmail(email);
    await codeRepository.create({
      code: 'ABCDEF',
      type: 'password_reset',
      userId: user!.id,
    });
    const userCreatePasswordResetTokenUseCase =
      new UserCreatePasswordResetTokenUseCase(
        userRepository,
        codeRepository,
        tokenRepository,
        tokenManager,
      );
    const { token } = await userCreatePasswordResetTokenUseCase.execute({
      code: 'abCDeF',
      email,
    });
    expect(token).toBeDefined();
  });

  it('should not be able to create a password reset token', async () => {
    const userRepository = new UserRepositoryFake();
    const codeRepository = new CodeRepositoryFake();
    const tokenRepository = new TokenRepositoryFake();
    const tokenManager = TokenManagerFactory.get();
    const email = new Email('admin@admin.com');
    const user = await userRepository.findByEmail(email);
    const code = await codeRepository.create({
      code: 'ABCDEF',
      type: 'password_reset',
      userId: user!.id,
    });
    const userCreatePasswordResetTokenUseCase =
      new UserCreatePasswordResetTokenUseCase(
        userRepository,
        codeRepository,
        tokenRepository,
        tokenManager,
      );

    for (let i = 1; i <= 5; i++) {
      try {
        await userCreatePasswordResetTokenUseCase.execute({
          code: 'abCDeE',
          email,
        });
        expect(false).toBe(true);
      } catch (error: any) {
        expect(error).toBeInstanceOf(Exception);
      }
    }

    const nullCode = await codeRepository.findById(code.id);
    expect(nullCode).toBe(null);
  });
});
