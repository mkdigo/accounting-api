import { Entry } from '@/domain/entities/Entry';
import { IEntryRepository } from '@/domain/repositories/IEntryRepository';

export class EntryFindByIdUseCase {
  constructor(private entryRepository: IEntryRepository) {}

  async execute(id: string): Promise<Entry | null> {
    return this.entryRepository.findById(id);
  }
}
