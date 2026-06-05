import { Code } from '@/domain/entities/Code';
import {
  ICodeRepository,
  TAttemptsUpdateInput,
  TCreateInput,
} from '@/domain/repositories/ICodeRepository';
import { Exception } from '@/Exception';

export class CodeRepositoryFake implements ICodeRepository {
  private codes: Code[] = [];

  async create(input: TCreateInput): Promise<Code> {
    await this.deleteAll(input.userId);
    const code = Code.create(input);
    this.codes.push(code);
    return code;
  }

  async findById(id: string): Promise<Code | null> {
    const filteredCodes = this.codes.filter((code) => code.id === id);
    return filteredCodes.length > 0 ? filteredCodes[0] : null;
  }

  async findByUserId(userId: string): Promise<Code | null> {
    const filteredCodes = this.codes.filter((code) => code.userId === userId);
    return filteredCodes.length > 0 ? filteredCodes[0] : null;
  }

  async attemptsUpdate({ id, attempts }: TAttemptsUpdateInput): Promise<Code> {
    const foundCode = await this.findById(id);
    if (!foundCode)
      throw new Exception({ code: 404, message: 'Code not found.' });
    foundCode.attempts = attempts;
    this.codes = this.codes.map((code) => {
      if (foundCode.id === code.id) return foundCode;
      return code;
    });
    return foundCode;
  }

  async deleteAll(userId: string): Promise<void> {
    this.codes = this.codes.filter((code) => code.userId !== userId);
  }
}
