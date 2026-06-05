import { Token } from '@/domain/entities/Token';
import {
  ITokenRepository,
  TTokenCreateInput,
} from '@/domain/repositories/ITokenRepository';
import { Prisma } from './Prisma';

export class TokenRepositoryPrisma extends Prisma implements ITokenRepository {
  async create(input: TTokenCreateInput): Promise<Token> {
    const token = await this.prisma.token.create({
      data: {
        ...input,
      },
    });
    return new Token({ ...token });
  }

  async findById(id: string): Promise<Token | null> {
    const token = await this.prisma.token.findFirst({
      where: {
        id,
      },
    });
    if (!token) return null;
    return new Token({ ...token });
  }

  async ban(id: string): Promise<void> {
    await this.prisma.token.update({
      where: {
        id,
      },
      data: {
        is_banned: true,
      },
    });
  }

  async banAll(userId: string): Promise<void> {
    await this.prisma.token.updateMany({
      where: {
        user_id: userId,
        is_banned: false,
      },
      data: {
        is_banned: true,
      },
    });
  }
}
