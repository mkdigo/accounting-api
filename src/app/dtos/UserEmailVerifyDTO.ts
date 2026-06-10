import { Email } from '@/domain/value-objects/Email';

export type UserEmailVerifyInputDTO = {
  email: Email;
  code: string;
};

export type UserEmailVerifyOutputDTO = {
  token: {
    id: string;
    content: string;
  };
  refreshToken: {
    id: string;
    content: string;
  };
};
