import { Entry } from '@/domain/entities/Entry';
import { IAccountRepository } from '@/domain/repositories/IAccountRepository';
import { IEntryRepository } from '@/domain/repositories/IEntryRepository';
import { Money } from '@/domain/value-objects/Money';
import { Exception } from '@/Exception';

type TEntryUpdateInputDTO = {
  inclusion: string;
  debitId: string;
  creditId: string;
  value: number;
  note: string;
};

export class EntryUpdateUseCase {
  constructor(
    private entryRepository: IEntryRepository,
    private accountRepository: IAccountRepository,
  ) {}

  async execute(id: string, input: TEntryUpdateInputDTO): Promise<Entry> {
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
    return this.entryRepository.update(id, {
      inclusion: new Date(input.inclusion),
      debitAccount,
      creditAccount,
      value: Money.fromNumber(input.value),
      note: input.note,
    });
  }
}
