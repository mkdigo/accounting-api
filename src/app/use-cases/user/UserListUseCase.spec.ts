import { UserRepositoryFake } from '@/infra/database/repositories/fake/UserRepositoryFake';
import { UserListUseCase } from './UserListUseCase';

describe('UserListUseCase', () => {
  it('should be able to list the users', async () => {
    const userRepository = new UserRepositoryFake();
    const userListUseCase = new UserListUseCase(userRepository);
    const users = await userListUseCase.execute('common');
    expect(users.length).toBe(1);
    expect(users[0].name).toBe('Common User');
  });
});
