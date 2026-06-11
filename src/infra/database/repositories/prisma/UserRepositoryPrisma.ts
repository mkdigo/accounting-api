import {
  IUserRepository,
  TUserCreateInput,
  TUserUpdateInput,
} from '@/domain/repositories/IUserRepository';
import { Prisma } from './Prisma';
import { User } from '@/domain/entities/User';
import { Email } from '@/domain/value-objects/Email';
import { Cellphone } from '@/domain/value-objects/Cellphone';
import { Zipcode } from '@/domain/value-objects/Zipcode';
import { Password } from '@/domain/value-objects/Password';

export class UserRepositoryPrisma extends Prisma implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    const foundUser = await this.prisma.user.findFirst({
      where: {
        id,
      },
    });
    if (!foundUser) return null;
    return new User({
      ...foundUser,
      email: new Email(foundUser.email),
      cellphone: new Cellphone(foundUser.cellphone),
      zipcode: new Zipcode(foundUser.zipcode),
    });
  }

  async findByUsername(username: string): Promise<User | null> {
    const foundUser = await this.prisma.user.findFirst({
      where: {
        username,
      },
    });
    if (!foundUser) return null;
    return new User({
      ...foundUser,
      email: new Email(foundUser.email),
      cellphone: new Cellphone(foundUser.cellphone),
      zipcode: new Zipcode(foundUser.zipcode),
    });
  }

  async findByEmail(email: Email): Promise<User | null> {
    const foundUser = await this.prisma.user.findFirst({
      where: {
        email: email.address,
      },
    });
    if (!foundUser) return null;
    return new User({
      ...foundUser,
      email: new Email(foundUser.email),
      cellphone: new Cellphone(foundUser.cellphone),
      zipcode: new Zipcode(foundUser.zipcode),
    });
  }

  async list(search: string): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { cellphone: { contains: search, mode: 'insensitive' } },
        ],
      },
    });
    return users.map(
      (user) =>
        new User({
          ...user,
          email: new Email(user.email),
          cellphone: new Cellphone(user.cellphone),
          zipcode: new Zipcode(user.zipcode),
        }),
    );
  }

  async create(input: TUserCreateInput): Promise<User> {
    const user = User.create({
      ...input,
      password: new Password(input.password),
    });
    const createdUser = await this.prisma.user.create({
      data: {
        ...user,
        email: user.email.address,
        cellphone: user.cellphone.value,
        zipcode: user.zipcode.value,
      },
    });
    return new User({
      ...createdUser,
      email: new Email(createdUser.email),
      cellphone: new Cellphone(createdUser.cellphone),
      zipcode: new Zipcode(createdUser.zipcode),
    });
  }

  async update(id: string, input: TUserUpdateInput): Promise<User> {
    const updatedUser = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        name: input.name,
        cellphone: input.cellphone.value,
        zipcode: input.zipcode.value,
        state: input.state,
        city: input.city,
        district: input.district,
        address: input.address,
        username: input.username,
      },
    });
    return new User({
      ...updatedUser,
      email: new Email(updatedUser.email),
      cellphone: new Cellphone(updatedUser.cellphone),
      zipcode: new Zipcode(updatedUser.zipcode),
    });
  }

  async changePassword(id: string, password: string): Promise<void> {
    await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        password,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }

  async emailVerify(id: string): Promise<void> {
    await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        email_verified_at: new Date(),
      },
    });
  }
}
