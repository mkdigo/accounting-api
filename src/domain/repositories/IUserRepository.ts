import { User } from '../entities/User';
import { Cellphone } from '../value-objects/Cellphone';
import { Email } from '../value-objects/Email';
import { Zipcode } from '../value-objects/Zipcode';

export type TUserCreateInput = {
  name: string;
  email: Email;
  cellphone: Cellphone;
  zipcode: Zipcode;
  state: string;
  district: string;
  city: string;
  address: string;
  username: string;
  password: string;
};

export type TUserUpdateInput = Omit<TUserCreateInput, 'email' | 'password'>;

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  list(search: string): Promise<User[]>;
  create(input: TUserCreateInput): Promise<User>;
  update(id: string, input: TUserUpdateInput): Promise<User>;
  changePassword(id: string, password: string): Promise<void>;
  delete(id: string): Promise<void>;
  emailVerify(id: string): Promise<void>;
}
