import { Exception } from '@/Exception';

export class Password {
  private errors: string[] = [];

  constructor(readonly value: string) {
    if (!this.isValid()) {
      throw new Exception({
        code: 400,
        message: 'Invalid password format.',
        errors: { password: this.errors },
      });
    }
  }

  private isValid(): boolean {
    if (this.value.length < 8)
      this.errors.push('It must be longer than 8 characters.');
    if (!/[A-Z]/.test(this.value))
      this.errors.push('It must have at least one uppercase character.');
    if (!/[a-z]/.test(this.value))
      this.errors.push('It must have at least one lowercase character.');
    if (!/[0-9]/.test(this.value))
      this.errors.push('It must have at least one number.');
    if (!/[!@#$%^&*(),.?":{}|<>_\+-]/.test(this.value))
      this.errors.push('It must have at least one special character.');

    return this.errors.length === 0;
  }
}
