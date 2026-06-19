import { IAccountRepository } from '@/domain/repositories/IAccountRepository';

export class AccountDeleteUseCase {
  constructor(private accountRepository: IAccountRepository) {}

  async execute(id: string): Promise<void> {
    await this.accountRepository.delete(id);
  }
}
