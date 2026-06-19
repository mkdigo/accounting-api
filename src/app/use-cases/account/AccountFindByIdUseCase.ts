import { Account } from '@/domain/entities/Account';
import { IAccountRepository } from '@/domain/repositories/IAccountRepository';

export class AccountFindByIdUseCase {
  constructor(private accountRepository: IAccountRepository) {}

  public async execute(id: string): Promise<Account | null> {
    return await this.accountRepository.findById(id);
  }
}
