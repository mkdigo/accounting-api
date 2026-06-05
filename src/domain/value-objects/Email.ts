import { Exception } from '@/Exception';

export class Email {
  // Regex padrão RFC 5322 (simplificada para uso comum)
  private regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  constructor(readonly address: string) {
    if (!this.isValid(this.address))
      throw new Exception({
        message: 'Invalid email.',
        code: 400,
        errors: {
          email: ['Invalid email.'],
        },
      });
  }

  private isValid(address: string): boolean {
    if (typeof address !== 'string') return false;

    const cleanedEmail = address.trim();

    if (cleanedEmail.length > 254) return false;

    return this.regex.test(cleanedEmail);
  }
}
