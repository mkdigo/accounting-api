import { ITokenManager } from '@/domain/auth/ITokenManager';
import { JWTTokenManager } from '../auth/JWTTokenManager';
import { Factory } from './Factory';

export class TokenManagerFactory extends Factory {
  public static get(): ITokenManager {
    return this.make('tokenManager', JWTTokenManager);
  }
}
