import bcrypt from 'bcrypt';
import { Exception } from '@/Exception';
import { IPasswordHasher } from '@/domain/services/IPasswordHasher';

export class BcryptHasher implements IPasswordHasher {
  private SALT_ROUNDS = 10;

  public async hashPassword(password: string): Promise<string> {
    try {
      const salt = await bcrypt.genSalt(this.SALT_ROUNDS);
      const hash = await bcrypt.hash(password, salt);
      return hash;
    } catch (error) {
      throw new Exception({ message: 'Error processing password hash.' });
    }
  }

  public async comparePassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hash);
    } catch (error) {
      return false;
    }
  }
}
