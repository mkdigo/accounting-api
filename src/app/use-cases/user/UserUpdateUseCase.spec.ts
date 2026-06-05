import { UserRepositoryFake } from '@/infra/database/repositories/fake/UserRepositoryFake';
import { UserUpdateUseCase } from './UserUpdateUseCase';
import { Zipcode } from '@/domain/value-objects/Zipcode';
import { Cellphone } from '@/domain/value-objects/Cellphone';
import { Exception } from '@/Exception';

describe('UserUpdateUseCase', () => {
  const userRepository = new UserRepositoryFake();
  const userUpdateUseCase = new UserUpdateUseCase(userRepository);
  const input = {
    name: 'New Name',
    cellphone: new Cellphone('(00) 90000-0000'),
    zipcode: new Zipcode('00000-000'),
    state: 'New State',
    city: 'New City',
    address: 'New Address',
    username: 'newUsername',
  };

  it('should be able to update a user', async () => {
    const user = await userRepository.findByUsername('user');
    if (!user) return;

    const updatedUser = await userUpdateUseCase.execute(user.id, input);

    expect(updatedUser).toMatchObject(input);
  });

  it('should not be able to update a user when the username has already been taken.', async () => {
    try {
      const user = await userRepository.findByUsername('newUsername');
      if (!user) return;

      await userUpdateUseCase.execute(user.id, {
        ...input,
        username: 'admin',
      });
    } catch (error: any) {
      expect(error).toBeInstanceOf(Exception);
      expect(error.message).toBe('This username has already been taken.');
    }
  });
});
