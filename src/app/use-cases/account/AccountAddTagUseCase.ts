import { Account } from '@/domain/entities/Account';
import { Tag } from '@/domain/entities/Tag';
import { IAccountRepository } from '@/domain/repositories/IAccountRepository';
import { TagName } from '@/domain/value-objects/TagName';
import { Exception } from '@/Exception';

export class AccountAddTagUseCase {
  constructor(private accountRepository: IAccountRepository) {}

  async execute(account: Account, tagName: TagName): Promise<Account> {
    if (!Tag.check(account, tagName))
      throw new Exception({
        code: 400,
        message: `The tag could not be added. Perhaps the tag cannot be added to this subgroup, or the account already has a tag.`,
        errors: {
          tagName: [`Invalid tag: ${tagName.value}.`],
        },
      });
    return await this.accountRepository.addTag(account.id, tagName);
  }
}
