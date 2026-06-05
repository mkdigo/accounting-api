import { IPasswordHasher } from '@/domain/services/IPasswordHasher';
import { Factory } from './Factory';
import { BcryptHasher } from '../services/BcryptHasher';
import { IMail } from '@/domain/services/IMail';
import { Nodemailer } from '../services/Nodemailer';
import { IRandomCode } from '@/domain/services/IRandomCode';
import { RandomCode } from '../services/RandomCode';

export class ServiceFactory extends Factory {
  public static getPasswordHasher(): IPasswordHasher {
    return this.make('passwordHasher', BcryptHasher);
  }

  public static getMail(): IMail {
    return this.make('mail', Nodemailer);
  }

  public static getRancomCode(): IRandomCode {
    return this.make('randomCode', RandomCode);
  }
}
