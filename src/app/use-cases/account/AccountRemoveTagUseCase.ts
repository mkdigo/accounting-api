import { Account } from '@/domain/entities/Account';
import { IAccountRepository } from '@/domain/repositories/IAccountRepository';
import { TagName } from '@/domain/value-objects/TagName';
import { Exception } from '@/Exception';

export class AccountRemoveTagUseCase {
  constructor(private accountRepository: IAccountRepository) {}

  async execute(account: Account, tagName: TagName): Promise<Account> {
    if (!account.tags.some((tag) => tag.name.value === tagName.value))
      throw new Exception({
        code: 404,
        message: 'Tag not found.',
      });
    return await this.accountRepository.removeTag(account.id, tagName);
  }
}
