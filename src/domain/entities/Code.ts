import { randomUUID } from 'crypto';

export type TCodeType = 'email_verification' | 'password_reset';

type TConstructorInput = {
  id: string;
  userId: string;
  code: string;
  type: TCodeType;
  expires_in: number;
  attempts: number;
};

type TCreateInput = Omit<TConstructorInput, 'id' | 'expires_in' | 'attempts'>;

export class Code {
  public id: string;
  public userId: string;
  public code: string;
  public type: TCodeType;
  public expires_in: number;
  public attempts: number;

  constructor(input: TConstructorInput) {
    this.id = input.id;
    this.userId = input.userId;
    this.code = input.code;
    this.type = input.type;
    this.expires_in = input.expires_in;
    this.attempts = input.attempts;
  }

  public static create(input: TCreateInput): Code {
    const uuid = randomUUID();
    const now = new Date();
    return new Code({
      id: uuid,
      userId: input.userId,
      code: input.code,
      type: input.type,
      expires_in: Math.round((now.getTime() + 10 * 60 * 1000) / 1000),
      attempts: 0,
    });
  }

  public compare(code: string): boolean {
    const now = new Date();

    const isValidCode =
      new RegExp(`^${this.code}$`, 'i').test(code) &&
      this.expires_in >= Math.round(now.getTime() / 1000);

    return isValidCode;
  }
}
