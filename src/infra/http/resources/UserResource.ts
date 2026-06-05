import { User } from '@/domain/entities/User';

type TOutput = {
  id: string;
  name: string;
  email: string;
  cellphone: string;
  zipcode: string;
  state: string;
  city: string;
  district: string;
  address: string;
  username: string;
  created_at: string;
  updated_at: string;
};

export class UserResource {
  public single(user: User): TOutput {
    return {
      id: user.id,
      name: user.name,
      email: user.email.address,
      cellphone: user.cellphone.value,
      zipcode: user.zipcode.value,
      state: user.state,
      city: user.city,
      district: user.district,
      address: user.address,
      username: user.username,
      created_at: user.created_at.toISOString(),
      updated_at: user.updated_at.toISOString(),
    };
  }

  public collection(users: User[]): TOutput[] {
    return users.map((user) => this.single(user));
  }
}
