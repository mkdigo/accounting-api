import { JWTTokenManager } from '@/infra/auth/JWTTokenManager';
import { UserRepositoryFake } from '@/infra/database/repositories/fake/UserRepositoryFake';
import { BcryptHasher } from '@/infra/services/BcryptHasher';
import { UserAuthenticationUseCase } from './UserAuthenticationUseCase';
import { Exception } from '@/Exception';
import { TokenRepositoryFake } from '@/infra/database/repositories/fake/TokenRepositoryFake';

describe('UserAuthenticationUseCase', () => {
  const userRepository = new UserRepositoryFake();
  const tokenRepository = new TokenRepositoryFake();
  const passwordHasher = new BcryptHasher();
  const tokenManager = new JWTTokenManager();
  const userAuthenticationUseCase = new UserAuthenticationUseCase(
    userRepository,
    tokenRepository,
    passwordHasher,
    tokenManager,
  );

  it('should be able to authenticate a user', async () => {
    const { token, refreshToken } = await userAuthenticationUseCase.execute({
      username: 'admin',
      password: 'admin',
    });
    const tokenDecoded = tokenManager.verify(token.content);
    const refreshTokenDecoded = tokenManager.verify(refreshToken.content);
    expect(tokenDecoded.exp - tokenDecoded.iat).toBe(3600);
    expect(refreshTokenDecoded.exp - refreshTokenDecoded.iat).toBe(604800);
  });

  it('should not be able to authenticate a user when the credentials are incorrect', async () => {
    try {
      await userAuthenticationUseCase.execute({
        username: 'admin',
        password: '123',
      });
      expect(false).toBe(true);
    } catch (error: any) {
      expect(error).toBeInstanceOf(Exception);
      expect(error.message).toBe('Invalid credentials');
    }
  });
});
