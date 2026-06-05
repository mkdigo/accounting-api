import { Code } from '@/domain/entities/Code';
import {
  ICodeRepository,
  TAttemptsUpdateInput,
  TCreateInput,
} from '@/domain/repositories/ICodeRepository';
import { Prisma } from './Prisma';
import { Exception } from '@/Exception';

export class CodeRepositoryPrisma extends Prisma implements ICodeRepository {
  async create(input: TCreateInput): Promise<Code> {
    await this.deleteAll(input.userId);
    const code = Code.create(input);
    await this.prisma.code.create({
      data: {
        ...code,
      },
    });
    return code;
  }

  async findById(id: string): Promise<Code | null> {
    const foundCode = await this.prisma.code.findFirst({
      where: {
        id,
      },
    });
    if (!foundCode) return null;
    return new Code({ ...foundCode });
  }

  async findByUserId(userId: string): Promise<Code | null> {
    const foundCode = await this.prisma.code.findFirst({
      where: {
        userId,
      },
    });
    if (!foundCode) return null;
    return new Code({ ...foundCode });
  }

  async attemptsUpdate({ id, attempts }: TAttemptsUpdateInput): Promise<Code> {
    const foundCode = await this.findById(id);
    if (!foundCode)
      throw new Exception({ code: 404, message: 'Code not found.' });
    foundCode.attempts = attempts;
    const code = await this.prisma.code.update({
      where: {
        id: foundCode.id,
      },
      data: {
        attempts,
      },
    });
    return new Code({ ...code });
  }

  async deleteAll(userId: string): Promise<void> {
    await this.prisma.code.deleteMany({
      where: {
        userId,
      },
    });
  }
}
