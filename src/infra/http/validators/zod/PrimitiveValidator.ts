import { IPrimitiveValidator } from '@/domain/validator/IPrimitiveValidator';
import { Validator } from './Validator';

export class PrimitiveValidator
  extends Validator
  implements IPrimitiveValidator
{
  public string(value: any): string {
    const schema = this.z.string();
    const result = schema.safeParse(value);
    if (!result.success) throw this.parseError(result.error);
    return result.data;
  }

  public number(value: any): number {
    const schema = this.z.coerce.number();
    const result = schema.safeParse(value);
    if (!result.success) throw this.parseError(result.error);
    return result.data;
  }

  public boolean(value: any): boolean {
    const schema = this.z.boolean();
    const result = schema.safeParse(value);
    if (!result.success) throw this.parseError(result.error);
    return result.data;
  }
}
