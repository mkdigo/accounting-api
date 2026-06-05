import { StringValue } from 'ms';

export type TEnvValidatorOutput = {
  NODE_ENV: 'development' | 'production' | 'test';
  APP_PORT: number;
  LOGGER: boolean;
  APP_SECRET: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: StringValue;
  MAIL_HOST: string;
  MAIL_PORT: number;
  MAIL_USER: string;
  MAIL_PASS: string;
  MAIL_TLS: boolean;
  MAIL_FROM: string;
  DATABASE_URL: string;
};

export interface IEnvFileValidator {
  execute(input: any): TEnvValidatorOutput;
}
