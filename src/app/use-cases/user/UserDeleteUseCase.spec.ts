import { UserRepositoryFake } from '@/infra/database/repositories/fake/UserRepositoryFake';
import { UserDeleteUseCase } from './UserDeleteUseCase';

describe('UserDeleteUseCase', () => {
  it('should be able to delete a user', async () => {
    const userRepository = new UserRepositoryFake();
    const userDeleteUseCase = new UserDeleteUseCase(userRepository);
    const user = await userRepository.findByUsername('user');
    if (!user) {
      expect(false).toBe(true);
      return;
    }
    await userDeleteUseCase.execute(user.id);
    const deletedUser = await userRepository.findById(user.id);
    expect(deletedUser).toBe(null);
  });
});
