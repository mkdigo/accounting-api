import { BcryptHasher } from './BcryptHasher';

describe('BcryptHasher', () => {
  it('should be able to compare a password and a hash', async () => {
    const hasher = new BcryptHasher();
    const password = 'minhaSenhaSuperSecreta123';
    const hash = await hasher.hashPassword(password);
    const isMatch = await hasher.comparePassword(password, hash);
    expect(isMatch).toBe(true);
  });

  it('should return false when comparing an incorrect password.', async () => {
    const hasher = new BcryptHasher();
    const password = 'minhaSenhaSuperSecreta123';
    const hash = await hasher.hashPassword(password);
    const isMatch = await hasher.comparePassword(
      'minhaSenhaSuperSecreta12',
      hash,
    );
    expect(isMatch).toBe(false);
  });
});
