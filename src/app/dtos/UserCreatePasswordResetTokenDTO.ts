import { Email } from '@/domain/value-objects/Email';

export type UserCreatePasswordResetTokenDTO = {
  email: Email;
  code: string;
};
