import { StringValue } from 'ms';

type TTokenType = 'default' | 'password-reset';

type TUserPayload = {
  userId: string;
  type: TTokenType;
};

export type TPayload = TUserPayload;
export type TDecoded = TUserPayload & {
  id: string;
  exp: number;
  iat: number;
};

export type TTokenCreateOptions = {
  expiresIn?: StringValue;
};

export type TTokenCreateOutput = {
  id: string;
  content: string;
};

export interface ITokenManager {
  create(payload: TPayload, options?: TTokenCreateOptions): TTokenCreateOutput;
  verify(token: string): TDecoded;
}
