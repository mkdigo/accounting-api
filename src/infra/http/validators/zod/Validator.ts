import { Exception } from '@/Exception';
import * as z from 'zod';

export class Validator {
  protected z = z;

  protected parseError(error: z.ZodError, code: number = 400): Exception {
    const errors: Record<string, string[]> = {};

    for (const issue of error.issues) {
      Object.assign(errors, { [issue.path[0]]: [issue.message] });
    }

    return new Exception({
      code,
      message:
        this.constructor.name === 'EnvFileValidator'
          ? 'EnvFileValidator'
          : 'Invalid input',
      errors,
    });
  }
}
