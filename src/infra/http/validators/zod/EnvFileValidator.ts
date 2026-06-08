import { StringValue } from 'ms';
import {
  IEnvFileValidator,
  TEnvValidatorOutput,
} from '@/domain/validator/IEnvFileValidator';
import { Validator } from './Validator';

export class EnvFileValidator extends Validator implements IEnvFileValidator {
  public execute(input: any): TEnvValidatorOutput {
    const schema = this.z.object({
      NODE_ENV: this.z.literal(['development', 'production', 'test']),
      APP_PORT: this.z.number().gte(1),
      LOGGER: this.z.boolean(),
      APP_SECRET: this.z.string().trim().min(8),
      APP_CORS_ORIGIN: this.z.string().trim().min(1),
      JWT_SECRET: this.z.string().trim().min(8),
      JWT_EXPIRES_IN: this.z
        .string()
        .trim()
        .min(2)
        .transform((value) => value as StringValue),
      MAIL_HOST: this.z.string().trim().min(3),
      MAIL_PORT: this.z.coerce.number().gte(1),
      MAIL_USER: this.z.string().trim().min(3),
      MAIL_PASS: this.z.string().trim().min(3),
      MAIL_TLS: this.z.boolean(),
      MAIL_FROM: this.z.string().trim().min(3),
      DATABASE_URL: this.z
        .string()
        .trim()
        .regex(/^postgresql:\/\/\w+:\w+@\w+:\d+\/\w+/),
    });

    const result = schema.safeParse(input);

    if (!result.success) throw this.parseError(result.error, 500);

    return result.data;
  }
}
