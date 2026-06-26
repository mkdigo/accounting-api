import { Entry } from '@/domain/entities/Entry';
import { IEntryRepository } from '@/domain/repositories/IEntryRepository';
import { AccountSubgroup } from '@/domain/value-objects/AccountSubgroup';

type TEntryListInputDTO = {
  companyId: string;
  start: string;
  end: string;
  search: string;
  take?: number;
  lastId?: string;
  subgroup?: AccountSubgroup;
};

export class EntryListUseCase {
  constructor(private entryRepository: IEntryRepository) {}

  async execute(input: TEntryListInputDTO): Promise<Entry[]> {
    return this.entryRepository.list({
      companyId: input.companyId,
      search: input.search,
      start: new Date(input.start),
      end: new Date(input.end),
      take: input.take,
      lastId: input.lastId,
      subgroup: input.subgroup,
    });
  }
}
