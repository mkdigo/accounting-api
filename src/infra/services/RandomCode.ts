import { IRandomCode } from '@/domain/services/IRandomCode';
import { randomInt, randomBytes } from 'crypto';

export class RandomCode implements IRandomCode {
  public number(size: number = 6): string {
    const code = randomInt(10 ** (size - 1), 10 ** size);
    return code.toString();
  }

  public alphanumeric(size: number = 6): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';

    const bytes = randomBytes(size);

    for (let i = 0; i < size; i++) {
      const index = bytes[i] % characters.length;
      code += characters[index];
    }

    return code;
  }
}
