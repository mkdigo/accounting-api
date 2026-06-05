import jwt, { Secret } from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import {
  ITokenManager,
  TDecoded,
  TPayload,
  TTokenCreateOptions,
  TTokenCreateOutput,
} from '@/domain/auth/ITokenManager';
import { env } from '@/env';
import { Exception } from '@/Exception';

export class JWTTokenManager implements ITokenManager {
  private secret: Secret;

  constructor() {
    this.secret = env.JWT_SECRET;
  }
  public create(
    payload: TPayload,
    options?: TTokenCreateOptions,
  ): TTokenCreateOutput {
    const id = randomUUID();
    const expiresIn = options?.expiresIn || env.JWT_EXPIRES_IN;
    return {
      id,
      content: jwt.sign({ ...payload, id }, this.secret, { expiresIn }),
    };
  }

  public verify(token: string): TDecoded {
    try {
      return jwt.verify(token, this.secret) as TDecoded;
    } catch (error: any) {
      throw new Exception({ code: 401, message: error.message });
    }
  }
}
