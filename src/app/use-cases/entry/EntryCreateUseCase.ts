import { Entry } from '@/domain/entities/Entry';
import { IAccountRepository } from '@/domain/repositories/IAccountRepository';
import { IEntryRepository } from '@/domain/repositories/IEntryRepository';
import { Money } from '@/domain/value-objects/Money';
import { Exception } from '@/Exception';

type TEntryCreateInputDTO = {
  companyId: string;
  inclusion: string;
  debitId: string;
  creditId: string;
  value: number;
  note: string;
};

export class EntryCreateUseCase {
  constructor(
    private entryRepository: IEntryRepository,
    private accountRepository: IAccountRepository,
  ) {}

  async execute(input: TEntryCreateInputDTO): Promise<Entry> {
    const debitAccount = await this.accountRepository.findById(input.debitId);
    if (!debitAccount)
      throw new Exception({
        code: 404,
        message: 'Debit account not found',
      });
    const creditAccount = await this.accountRepository.findById(input.creditId);
    if (!creditAccount)
      throw new Exception({
        code: 404,
        message: 'Credit account not found',
      });
    return this.entryRepository.create({
      companyId: input.companyId,
      inclusion: new Date(input.inclusion),
      debitAccount,
      creditAccount,
      value: Money.fromNumber(input.value),
      note: input.note,
    });
  }
}
