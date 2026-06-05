import { Exception } from '@/Exception';

export class Cellphone {
  private regex = /^(\+55\s)?(\(\d{2}\)\s)(9\d{4}-\d{4})$/;

  constructor(readonly value: string) {
    if (!this.isValid(this.value))
      throw new Exception({
        message: 'Invalid cellphone.',
        code: 400,
        errors: {
          cellphone: ['Invalid format. (12) 91234-1324'],
        },
      });
  }

  private isValid(value: string): boolean {
    if (typeof value !== 'string') return false;

    const cleanedValue = value.trim();

    if (cleanedValue.length > 19) return false;

    return this.regex.test(cleanedValue);
  }
}
