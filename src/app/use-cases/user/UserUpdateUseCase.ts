import { User } from '@/domain/entities/User';
import { IUserRepository } from '@/domain/repositories/IUserRepository';
import { Exception } from '@/Exception';
import { UserUpdateInputDTO } from '../../dtos/UserUpdateDTO';

export class UserUpdateUseCase {
  constructor(private userRepository: IUserRepository) {}

  public async execute(id: string, input: UserUpdateInputDTO): Promise<User> {
    const foundUser = await this.userRepository.findById(id);

    if (!foundUser)
      throw new Exception({ code: 404, message: 'User not found.' });

    if (input.username && input.username !== foundUser.username) {
      const usernameExist = await this.userRepository.findByUsername(
        input.username,
      );
      if (usernameExist)
        throw new Exception({
          code: 409,
          message: 'This username has already been taken.',
        });
      foundUser.username = input.username;
    }

    if (input.name) foundUser.name = input.name;
    if (input.cellphone) foundUser.cellphone = input.cellphone;
    if (input.zipcode) foundUser.zipcode = input.zipcode;
    if (input.state) foundUser.state = input.state;
    if (input.city) foundUser.city = input.city;
    if (input.district) foundUser.district = input.district;
    if (input.address) foundUser.address = input.address;

    const updatedUser = this.userRepository.update(id, foundUser);

    return updatedUser;
  }
}
