import { Cellphone } from '@/domain/value-objects/Cellphone';
import { Email } from '@/domain/value-objects/Email';
import { Zipcode } from '@/domain/value-objects/Zipcode';
import { UserCreateUseCase } from './UserCreateUseCase';
import { UserRepositoryFake } from '@/infra/database/repositories/fake/UserRepositoryFake';
import { User } from '@/domain/entities/User';
import { BcryptHasher } from '@/infra/services/BcryptHasher';
import { Exception } from '@/Exception';
import { Password } from '@/domain/value-objects/Password';

describe('UserCreateUseCase', () => {
  const input = {
    name: 'User Test',
    email: new Email('userteste@mail.com'),
    cellphone: new Cellphone('(11) 91234-1234'),
    zipcode: new Zipcode('12345-123'),
    state: 'State',
    city: 'City',
    district: 'Center',
    address: 'Address',
    username: 'usertest',
    password: new Password('Password123$'),
  };
  const userRepository = new UserRepositoryFake();
  const passwordHasher = new BcryptHasher();
  const userCreateUseCase = new UserCreateUseCase(
    userRepository,
    passwordHasher,
  );

  it('should be able to create a new user', async () => {
    const newUser = await userCreateUseCase.execute(input);
    const password = passwordHasher.hashPassword('123');
    expect(newUser).toBeInstanceOf(User);
    expect(newUser).toMatchObject({ ...input, password });
  });

  it('should not be able to create a new user when the email has already been taken.', async () => {
    try {
      await userCreateUseCase.execute({
        ...input,
        email: new Email('usertest@mail.com'),
        username: 'usertest2',
      });
    } catch (error: any) {
      expect(error).toBeInstanceOf(Exception);
      expect(error.message).toBe('This email has already been taken.');
    }
  });

  it('should not be able to create a new user when the username has already been taken.', async () => {
    try {
      await userCreateUseCase.execute({
        ...input,
        email: new Email('usertest2@mail.com'),
        username: 'usertest',
      });
    } catch (error: any) {
      expect(error).toBeInstanceOf(Exception);
      expect(error.message).toBe('This username has already been taken.');
    }
  });
});
