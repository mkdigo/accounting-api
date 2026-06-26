import { IEntryRepository } from '@/domain/repositories/IEntryRepository';

export class EntryDeleteUseCase {
  constructor(private entryRepository: IEntryRepository) {}

  async execute(id: string): Promise<void> {
    this.entryRepository.delete(id);
  }
}
