import { Exception } from '@/Exception';
import { Password } from './Password';

describe('Password Object Value', () => {
  it('should be able to instance a password', () => {
    const rawPassword = 'Password123$';
    const password = new Password(rawPassword);
    expect(password.value).toBe(rawPassword);
  });

  it('should throw an error', () => {
    const rawPassword = '123';
    try {
      new Password(rawPassword);
    } catch (error: any) {
      expect(error).toBeInstanceOf(Exception);
      expect(error.errors).toStrictEqual({
        password: [
          'It must be longer than 8 characters.',
          'It must have at least one uppercase character.',
          'It must have at least one lowercase character.',
          'It must have at least one special character.',
        ],
      });
    }
  });
});
