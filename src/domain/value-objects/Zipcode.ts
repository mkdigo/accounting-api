import { Exception } from '@/Exception';

export class Zipcode {
  private regex = /^\d{5}-\d{3}?/;

  constructor(readonly value: string) {
    if (!this.isValid(this.value))
      throw new Exception({
        message: 'Invalid zipcode.',
        code: 400,
        errors: {
          zipcode: ['invalid format. 99999-999'],
        },
      });
  }

  private isValid(zipcode: string): boolean {
    if (typeof zipcode !== 'string') return false;

    const cleanedValue = zipcode.trim();

    if (cleanedValue.length > 9) return false;

    return this.regex.test(cleanedValue);
  }
}
