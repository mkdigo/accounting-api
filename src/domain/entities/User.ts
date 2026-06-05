import { randomUUID } from 'crypto';
import { Cellphone } from '../value-objects/Cellphone';
import { Email } from '../value-objects/Email';
import { Zipcode } from '../value-objects/Zipcode';
import { Password } from '../value-objects/Password';

type TConstructorInput = {
  id: string;
  name: string;
  email: Email;
  cellphone: Cellphone;
  zipcode: Zipcode;
  state: string;
  city: string;
  district: string;
  address: string;
  username: string;
  password: string;
  email_verified_at: Date | null;
  created_at: Date;
  updated_at: Date;
};

type TCreateInput = {
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

export class User {
  public id: string;
  public name: string;
  public email: Email;
  public cellphone: Cellphone;
  public zipcode: Zipcode;
  public state: string;
  public city: string;
  public district: string;
  public address: string;
  public username: string;
  public password: string;
  public email_verified_at: Date | null;
  public created_at: Date;
  public updated_at: Date;

  constructor(input: TConstructorInput) {
    this.id = input.id;
    this.name = input.name;
    this.email = input.email;
    this.cellphone = input.cellphone;
    this.zipcode = input.zipcode;
    this.state = input.state;
    this.city = input.city;
    this.district = input.district;
    this.address = input.address;
    this.username = input.username;
    this.password = input.password;
    this.email_verified_at = input.email_verified_at;
    this.created_at = input.created_at;
    this.updated_at = input.updated_at;
  }

  public static create(input: TCreateInput): User {
    const uuid = randomUUID();
    const now = new Date();
    return new User({
      id: uuid,
      name: input.name,
      email: input.email,
      cellphone: input.cellphone,
      zipcode: input.zipcode,
      state: input.state,
      city: input.city,
      district: input.district,
      address: input.address,
      username: input.username,
      password: input.password.value,
      email_verified_at: null,
      created_at: now,
      updated_at: now,
    });
  }
}
