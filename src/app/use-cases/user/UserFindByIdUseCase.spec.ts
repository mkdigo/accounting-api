import { UserRepositoryFake } from '@/infra/database/repositories/fake/UserRepositoryFake';
import { UserFindByIdUseCase } from './UserFindByIdUseCase';

describe('UserFindByIdUseCase', () => {
  it('should be able to find a user by id', async () => {
    const userRepository = new UserRepositoryFake();
    const user = await userRepository.findByUsername('user');
    if (!user) {
      expect(false).toBe(true);
      return;
    }
    const userFindByIdUseCase = new UserFindByIdUseCase(userRepository);
    const foundUser = await userFindByIdUseCase.execute(user.id);
    expect(foundUser).not.toBeNull();
  });
});
