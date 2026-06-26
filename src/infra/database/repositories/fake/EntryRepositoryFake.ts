import { Entry } from '@/domain/entities/Entry';
import {
  IEntryRepository,
  TEntryCreateInput,
  TEntryListInput,
  TEntryUpdateInput,
} from '@/domain/repositories/IEntryRepository';
import { Exception } from '@/Exception';

export class EntryRepositoryFake implements IEntryRepository {
  private entries: Entry[] = [];

  async findById(id: string): Promise<Entry | null> {
    const filter = this.entries.filter((entry) => entry.id === id)[0];
    return filter ?? null;
  }

  async list(input: TEntryListInput): Promise<Entry[]> {
    return this.entries.filter(
      (entry) =>
        entry.company_id === input.companyId &&
        entry.inclusion.getTime() >= input.start.getTime() &&
        entry.inclusion.getTime() <= input.end.getTime() &&
        (entry.debit_name.toLowerCase().includes(input.search.toLowerCase()) ||
          entry.credit_name
            .toLowerCase()
            .includes(input.search.toLowerCase()) ||
          entry.note.toLowerCase().includes(input.search.toLowerCase())),
    );
  }

  async create(input: TEntryCreateInput): Promise<Entry> {
    const entry = Entry.create({
      company_id: input.companyId,
      inclusion: input.inclusion,
      debitAccount: input.debitAccount,
      creditAccount: input.creditAccount,
      value: input.value,
      note: input.note,
    });
    this.entries.push(entry);
    return entry;
  }

  async update(id: string, input: TEntryUpdateInput): Promise<Entry> {
    const foundEntry = this.entries.filter((entry) => entry.id === id)[0];
    if (!foundEntry)
      throw new Exception({
        code: 404,
        message: 'Entry not found',
      });
    foundEntry.inclusion = input.inclusion;
    foundEntry.debit_id = input.debitAccount.id;
    foundEntry.debit_name = input.debitAccount.name;
    foundEntry.credit_id = input.creditAccount.id;
    foundEntry.credit_name = input.creditAccount.name;
    foundEntry.value = input.value;
    foundEntry.note = input.note;
    return foundEntry;
  }

  async delete(id: string): Promise<void> {
    const foundEntry = this.entries.filter((entry) => entry.id === id)[0];
    if (!foundEntry)
      throw new Exception({
        code: 404,
        message: 'Entry not found',
      });
    this.entries = this.entries.filter((entry) => entry.id !== id);
  }
}
