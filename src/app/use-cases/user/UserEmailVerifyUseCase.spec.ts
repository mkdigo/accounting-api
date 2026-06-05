import { UserRepositoryFake } from '@/infra/database/repositories/fake/UserRepositoryFake';
import { UserEmailVerifyUseCase } from './UserEmailVerifyUseCase';
import { CodeRepositoryFake } from '@/infra/database/repositories/fake/CodeRepositoryFake';
import { UserCreateSecurityCodeUseCase } from '../auth/UserCreateSecurityCodeUseCase';
import { ServiceFactory } from '@/infra/factories/ServiceFactory';

describe('UserEmailVerifyUseCase', () => {
  it('should be able to verify a email', async () => {
    const userRepository = new UserRepositoryFake();
    const codeRepository = new CodeRepositoryFake();
    const randomCode = ServiceFactory.getRancomCode();
    const user = await userRepository.findByUsername('user');
    if (!user) {
      expect(false).toBe(true);
      return;
    }
    const userCreateSecurityCodeUseCase = new UserCreateSecurityCodeUseCase(
      userRepository,
      codeRepository,
      randomCode,
    );
    const { code } = await userCreateSecurityCodeUseCase.execute({
      email: user.email,
      type: 'email_verification',
    });
    const userEmailVerifyUseCase = new UserEmailVerifyUseCase(
      userRepository,
      codeRepository,
    );
    expect(user.email_verified_at).toBe(null);
    await userEmailVerifyUseCase.execute({
      email: user.email,
      code: code.code,
    });
    const updatedUser = await userRepository.findByUsername('user');
    expect(updatedUser?.email_verified_at).not.toBeNull();
  });
});
