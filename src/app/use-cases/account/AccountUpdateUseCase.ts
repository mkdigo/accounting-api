import {
  IAccountRepository,
  TAccountUpdateInput,
} from '@/domain/repositories/IAccountRepository';

export class AccountUpdateUseCase {
  constructor(private accountRepository: IAccountRepository) {}

  async execute(id: string, input: TAccountUpdateInput) {
    return await this.accountRepository.update(id, input);
  }
}
