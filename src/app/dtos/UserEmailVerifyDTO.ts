import { Email } from '@/domain/value-objects/Email';

export type UserEmailVerifyDTO = {
  email: Email;
  code: string;
};
