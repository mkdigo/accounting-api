import { Account } from '@/domain/entities/Account';
import { IAccountRepository } from '@/domain/repositories/IAccountRepository';

export class AccountListUseCase {
  constructor(private accountRepository: IAccountRepository) {}

  async execute(companyId: string): Promise<Account[]> {
    return this.accountRepository.list(companyId);
  }
}
