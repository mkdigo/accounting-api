import { Token } from '@/domain/entities/Token';
import {
  ITokenRepository,
  TTokenCreateInput,
} from '@/domain/repositories/ITokenRepository';
import { Exception } from '@/Exception';

export class TokenRepositoryFake implements ITokenRepository {
  private tokens: Token[] = [];

  async create(input: TTokenCreateInput): Promise<Token> {
    const bannedToken = new Token({ ...input, is_banned: false });
    this.tokens.push(bannedToken);
    return bannedToken;
  }

  async findById(id: string): Promise<Token | null> {
    const tokens = this.tokens.filter((token) => token.id === id);
    if (tokens.length === 0) return null;
    return tokens[0];
  }

  async ban(id: string): Promise<void> {
    const token = await this.findById(id);
    if (!token)
      throw new Exception({
        code: 404,
        message: 'Token not found',
      });
    this.tokens = this.tokens.map((token) => {
      if (token.id !== id) return token;
      return {
        ...token,
        is_banned: true,
      };
    });
  }

  async banAll(userId: string): Promise<void> {
    this.tokens = this.tokens.map((token) => {
      if (token.user_id !== userId) return token;
      return {
        ...token,
        is_banned: true,
      };
    });
  }
}
