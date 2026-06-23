import { Exception } from '@/Exception';
import { TReply, TRequest } from '../HttpServer';
import { TokenManagerFactory } from '@/infra/factories/TokenManagerFactory';
import { TDecoded } from '@/domain/auth/ITokenManager';
import { ITokenRepository } from '@/domain/repositories/ITokenRepository';
import { RepositoryFactory } from '@/infra/factories/RepositoryFactory';

export class AuthMiddleware {
  private tokenRepository: ITokenRepository;

  constructor() {
    this.tokenRepository = RepositoryFactory.getTokenRepository();
  }

  private tokenDecode = (request: TRequest): TDecoded | null => {
    const authorization = request.headers.authorization;
    const regex = new RegExp(/Bearer\s\S*/);
    if (!authorization || !regex.test(authorization)) return null;
    const splited = authorization.split(' ');
    const token = splited[1];
    const tokenManager = TokenManagerFactory.get();
    return tokenManager.verify(token);
  };

  private setAuth = (request: TRequest, tokenDecoded: TDecoded) => {
    request.auth = {
      tokenId: tokenDecoded.id,
      user: {
        id: tokenDecoded.userId,
      },
    };
  };

  public defaultLogin = async (request: TRequest, reply: TReply) => {
    let isAuthenticated = false;

    const decoded = this.tokenDecode(request);

    if (decoded && decoded.type === 'default') {
      const token = await this.tokenRepository.findById(decoded.id);
      if (token && !token.is_banned) {
        this.setAuth(request, decoded);
        isAuthenticated = true;
      }
    }

    if (!isAuthenticated)
      throw new Exception({
        code: 401,
        message: 'Unauthorized',
      });
  };

  public passwordReset = async (request: TRequest, reply: TReply) => {
    let isAuthenticated = false;

    const decoded = this.tokenDecode(request);

    if (decoded && decoded.type === 'password-reset') {
      const token = await this.tokenRepository.findById(decoded.id);
      if (token && !token.is_banned) {
        this.setAuth(request, decoded);
        isAuthenticated = true;
      }
    }

    if (!isAuthenticated)
      throw new Exception({
        code: 401,
        message: 'Unauthorized',
      });
  };
}
