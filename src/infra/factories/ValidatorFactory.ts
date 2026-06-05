import { Factory } from './Factory';
import { IPrimitiveValidator } from '@/domain/validator/IPrimitiveValidator';
import { PrimitiveValidator } from '../http/validators/zod/PrimitiveValidator';
import { IEnvFileValidator } from '@/domain/validator/IEnvFileValidator';
import { EnvFileValidator } from '../http/validators/zod/EnvFileValidator';

export class ValidatorFactory extends Factory {
  public static getEnvFileValidator(): IEnvFileValidator {
    return this.make('envFileValidator', EnvFileValidator);
  }

  public static getPrimitiveValidator(): IPrimitiveValidator {
    return this.make('primitiveValidator', PrimitiveValidator);
  }
}
