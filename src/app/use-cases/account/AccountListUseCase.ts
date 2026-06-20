import { Account } from '@/domain/entities/Account';
import { IAccountRepository } from '@/domain/repositories/IAccountRepository';
import { AccountGroup } from '@/domain/value-objects/AccountGroup';
import { AccountSubgroup } from '@/domain/value-objects/AccountSubgroup';
import { TagName } from '@/domain/value-objects/TagName';

type TAccountListInputDTO = {
  companyId: string;
  name?: string;
  group?: AccountGroup;
  subgroup?: AccountSubgroup;
  tagName?: TagName;
};

export class AccountListUseCase {
  constructor(private accountRepository: IAccountRepository) {}

  async execute(input: TAccountListInputDTO): Promise<Account[]> {
    return this.accountRepository.list(input);
  }
}
