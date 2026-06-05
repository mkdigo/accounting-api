import { JWTTokenManager } from '@/infra/auth/JWTTokenManager';
import { UserRepositoryFake } from '@/infra/database/repositories/fake/UserRepositoryFake';
import { BcryptHasher } from '@/infra/services/BcryptHasher';
import { UserAuthenticationUseCase } from './UserAuthenticationUseCase';
import { UserRefreshTokenUseCase } from './UserRefreshTokenUseCase';
import { TokenRepositoryFake } from '@/infra/database/repositories/fake/TokenRepositoryFake';

describe('UserRefreshTokenUseCase.spec', () => {
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
  const userRefreshTokenUseCase = new UserRefreshTokenUseCase(
    userRepository,
    tokenRepository,
    tokenManager,
  );

  it('should be able to refresh a token', async () => {
    const { token, refreshToken } = await userAuthenticationUseCase.execute({
      username: 'admin',
      password: 'admin',
    });
    expect(token).toBeDefined();
    expect(refreshToken).toBeDefined();

    const result = await userRefreshTokenUseCase.execute(refreshToken.content);

    const tokenDecoded = tokenManager.verify(result.token.content);
    const refreshTokenDecoded = tokenManager.verify(
      result.refreshToken.content,
    );
    expect(tokenDecoded.exp - tokenDecoded.iat).toBe(3600);
    expect(refreshTokenDecoded.exp - refreshTokenDecoded.iat).toBe(604800);
  });
});
