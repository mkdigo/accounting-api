import { TAccountCreateInput } from '@/app/dtos/AccountCreateDTO';
import { Account } from '@/domain/entities/Account';
import { Tag } from '@/domain/entities/Tag';
import { IAccountRepository } from '@/domain/repositories/IAccountRepository';
import { TagName } from '@/domain/value-objects/TagName';
import { Exception } from '@/Exception';

export class AccountCreateUseCase {
  constructor(private accountRepository: IAccountRepository) {}

  public async execute(input: TAccountCreateInput): Promise<Account> {
    if (input.tags.length > 1)
      throw new Exception({
        code: 400,
        message: 'It is not possible to add two tags.',
      });
    if (input.tags.length === 1) {
      const account = Account.create({ ...input, tags: [] });
      const tag = new TagName(input.tags[0]);
      if (!Tag.check(account, tag))
        throw new Exception({
          code: 400,
          message: `Invalid tag ${tag.value}.`,
          errors: {
            tags: [`Invalid tag ${tag.value}.`],
          },
        });
    }
    return await this.accountRepository.create(input);
  }
}
