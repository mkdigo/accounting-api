import { Cellphone } from '@/domain/value-objects/Cellphone';
import { Email } from '@/domain/value-objects/Email';
import { Password } from '@/domain/value-objects/Password';
import { Zipcode } from '@/domain/value-objects/Zipcode';

export type UserCreateInputDTO = {
  name: string;
  email: Email;
  cellphone: Cellphone;
  zipcode: Zipcode;
  state: string;
  city: string;
  district: string;
  address: string;
  username: string;
  password: Password;
};
