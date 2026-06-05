import { UserRepositoryFake } from '@/infra/database/repositories/fake/UserRepositoryFake';
import { UserChangePasswordUseCase } from './UserChangePasswordUseCase';
import { BcryptHasher } from '@/infra/services/BcryptHasher';
import { Password } from '@/domain/value-objects/Password';
import { Exception } from '@/Exception';
import { TokenRepositoryFake } from '@/infra/database/repositories/fake/TokenRepositoryFake';

describe('UserChangePasswordUseCase', () => {
  it('should be able to change the user password', async () => {
    const userRepository = new UserRepositoryFake();
    const tokenRepository = new TokenRepositoryFake();
    const passwordHasher = new BcryptHasher();
    const userChangePasswordUseCase = new UserChangePasswordUseCase(
      userRepository,
      tokenRepository,
      passwordHasher,
    );
    const user = await userRepository.findByUsername('user');
    expect(
      userChangePasswordUseCase.execute(user!.id, new Password('NewPass123$')),
    ).toBeDefined();
    expect(() => {
      userChangePasswordUseCase.execute(user!.id, new Password('NewPass123'));
    }).toThrow(Exception);
  });
});
