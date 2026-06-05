import { Cellphone } from '@/domain/value-objects/Cellphone';
import { Email } from '@/domain/value-objects/Email';
import { Zipcode } from '@/domain/value-objects/Zipcode';

export type UserUpdateInputDTO = {
  name?: string;
  cellphone?: Cellphone;
  zipcode?: Zipcode;
  state?: string;
  city?: string;
  district?: string;
  address?: string;
  username?: string;
};
