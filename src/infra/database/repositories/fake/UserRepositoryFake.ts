import { User } from '@/domain/entities/User';
import {
  IUserRepository,
  TUserCreateInput,
  TUserUpdateInput,
} from '@/domain/repositories/IUserRepository';
import { Cellphone } from '@/domain/value-objects/Cellphone';
import { Email } from '@/domain/value-objects/Email';
import { Password } from '@/domain/value-objects/Password';
import { Zipcode } from '@/domain/value-objects/Zipcode';
import { Exception } from '@/Exception';

export class UserRepositoryFake implements IUserRepository {
  private users: User[] = [
    User.create({
      name: 'Admin User',
      cellphone: new Cellphone('(11) 91234-1234'),
      email: new Email('admin@admin.com'),
      zipcode: new Zipcode('12345-123'),
      state: 'São Paulo',
      city: 'São Paulo',
      district: 'Centro',
      address: 'Some address, 123',
      username: 'admin',
      // password: 'admin'
      password: new Password(
        '$2b$10$2cSuVHfo6u00KbwUQu8cCeGD0Ysyzu5rykchxUOsMi5CkQxsR7n5S',
      ),
    }),
    User.create({
      name: 'Common User',
      cellphone: new Cellphone('(11) 91234-1235'),
      email: new Email('user@mail.com'),
      zipcode: new Zipcode('12345-123'),
      state: 'São Paulo',
      city: 'São Paulo',
      district: 'Centro',
      address: 'Some address, 123',
      username: 'user',
      // password: '123'
      password: new Password(
        '$2b$10$tgwjPZNgiNoWdWVnwvxrb.F5hAPL.UenUJr5W2tax00IpZGGrPZeC',
      ),
    }),
  ];

  constructor() {
    this.users[0].email_verified_at = new Date();
  }

  async findById(id: string): Promise<User | null> {
    const filteredUsers = this.users.filter((user) => user.id === id);
    return filteredUsers.length > 0 ? filteredUsers[0] : null;
  }

  async findByUsername(username: string): Promise<User | null> {
    const filteredUsers = this.users.filter(
      (user) => user.username === username,
    );
    return filteredUsers.length > 0 ? filteredUsers[0] : null;
  }

  async findByEmail(email: Email): Promise<User | null> {
    const filteredUsers = this.users.filter(
      (user) => user.email.address === email.address,
    );
    return filteredUsers.length > 0 ? filteredUsers[0] : null;
  }

  async list(search: string): Promise<User[]> {
    const regex = new RegExp(search, 'i');
    return this.users.filter(
      (user) => regex.test(user.name) || regex.test(user.cellphone.value),
    );
  }

  async create(input: TUserCreateInput): Promise<User> {
    const user = User.create({
      ...input,
      password: new Password(input.password),
    });
    this.users.push(user);
    return user;
  }

  async update(id: string, input: TUserUpdateInput): Promise<User> {
    const foundUser = await this.findById(id);
    if (!foundUser)
      throw new Exception({ message: 'User not found.', code: 404 });
    const updatedUser = { ...foundUser, ...input };
    this.users = this.users.map((user) => {
      if (user.id !== id) return user;
      return updatedUser;
    });
    return updatedUser;
  }

  async changePassword(id: string, password: string): Promise<void> {
    const foundUser = await this.findById(id);
    if (!foundUser)
      throw new Exception({ message: 'User not found.', code: 404 });
    const updatedUser = { ...foundUser, password };
    this.users = this.users.map((user) => {
      if (user.id !== id) return user;
      return updatedUser;
    });
  }

  async delete(id: string): Promise<void> {
    const foundUser = await this.findById(id);
    if (!foundUser)
      throw new Exception({ message: 'User not found.', code: 404 });
    this.users = this.users.filter((user) => user.id !== id);
  }

  async emailVerify(id: string): Promise<void> {
    const foundUser = await this.findById(id);
    if (!foundUser)
      throw new Exception({ message: 'User not found.', code: 404 });
    this.users = this.users.map((user) => {
      if (user.id !== id) return user;
      return { ...foundUser, email_verified_at: new Date() };
    });
  }
}
